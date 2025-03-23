import express from 'express';
import Blockchain from '../utils/Blockchain.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js'; // Import Profile model
import ERupeeWallet from '../models/eRupeeWallet.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const blockchain = new Blockchain();

// Get blockchain chain
router.get('/chain', protect, async (req, res) => {
  try {
    res.json(blockchain.chain);
  } catch (error) {
    console.error('Error fetching blockchain:', error);
    res.status(500).json({ error: 'Failed to fetch blockchain data' });
  }
});

// Get pending transactions
router.get('/pending', protect, async (req, res) => {
  try {
    res.json(blockchain.pendingTransactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ error: 'Failed to fetch pending transactions' });
  }
});

router.post('/transfer', protect, async (req, res) => {
  const { senderErupeeId, receiverErupeeId, amount } = req.body;

  try {
    // Find profiles by erupeeId
    const senderProfile = await Profile.findOne({ erupeeId: senderErupeeId });
    const receiverProfile = await Profile.findOne({ erupeeId: receiverErupeeId });

    if (!senderProfile || !receiverProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the actual users from the profiles
    const sender = await User.findById(senderProfile.user);
    const receiver = await User.findById(receiverProfile.user);

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the e-Rupee wallets
    const senderWallet = await ERupeeWallet.findOne({ userId: sender._id });
    const receiverWallet = await ERupeeWallet.findOne({ userId: receiver._id });

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Add transaction to blockchain
    blockchain.addTransaction(senderErupeeId, receiverErupeeId, amount);
    
    // Create a new block immediately
    const newBlock = blockchain.createBlock();

    // Update sender's wallet
    await ERupeeWallet.updateOne(
      { userId: sender._id },
      {
        $inc: { balance: -amount },
        $push: {
          transactions: {
            txHash: newBlock.hash,
            amount: amount,
            type: 'debit',
            from: senderErupeeId,
            to: receiverErupeeId,
            note: `Transfer to ${receiver.name}`,
            timestamp: new Date()
          }
        }
      }
    );

    // Update receiver's wallet
    await ERupeeWallet.updateOne(
      { userId: receiver._id },
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            txHash: newBlock.hash,
            amount: amount,
            type: 'credit',
            from: senderErupeeId,
            to: receiverErupeeId,
            note: `Transfer from ${sender.name}`,
            timestamp: new Date()
          }
        }
      }
    );

    // Update sender's transaction count for rewards
    await User.updateOne(
      { _id: sender._id },
      { $inc: { transactionCount: 1 } }
    );

    // Check for reward
    let rewardMessage = '';
    const updatedSender = await User.findById(sender._id);
    if (updatedSender.transactionCount % 3 === 0) {
      await User.updateOne(
        { _id: sender._id },
        {
          $inc: { scratchCardsAvailable: 1 },
          $push: {
            rewardHistory: {
              type: 'cashback',
              amount: 10,
              description: 'Scratch card for 3 transfers',
            },
          },
        }
      );
      rewardMessage = 'You earned a scratch card for completing 3 transfers!';
    }

    res.json({
      message: 'Transfer successful',
      rewardMessage
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed' });
  }
});

export default router;
