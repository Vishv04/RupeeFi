import express from 'express';
import Blockchain from '../utils/Blockchain.js';
import User from '../models/User.js';

const router = express.Router();
const blockchain = new Blockchain();

router.post('/transfer', async (req, res) => {
  const { senderErupeeId, receiverErupeeId, amount } = req.body;

  try {
    const sender = await User.findOne({ eRupeeId: senderErupeeId });
    const receiver = await User.findOne({ eRupeeId: receiverErupeeId });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (sender.eRupeeBalance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    blockchain.addTransaction(senderErupeeId, receiverErupeeId, amount);

    let blockCreated = false;
    let rewardMessage = '';
    if (blockchain.pendingTransactions.length >= 3) {
      const newBlock = blockchain.createBlock();
      await User.updateOne(
        { eRupeeId: senderErupeeId },
        { $inc: { eRupeeBalance: -amount, transactionCount: 1 } }
      );
      await User.updateOne(
        { eRupeeId: receiverErupeeId },
        { $inc: { eRupeeBalance: amount } }
      );

      // Check for reward
      const updatedSender = await User.findOne({ eRupeeId: senderErupeeId });
      if (updatedSender.transactionCount % 3 === 0) {
        await User.updateOne(
          { eRupeeId: senderErupeeId },
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
        rewardMessage = ' + Scratch card earned!';
      }
      blockCreated = true;
    }

    res.json({
      message: blockCreated ? `Transfer completed, block created${rewardMessage}` : 'Transfer queued',
      block: blockCreated ? blockchain.chain[blockchain.chain.length - 1] : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chain', (req, res) => {
  res.json(blockchain.getChain());
});

export default router;
