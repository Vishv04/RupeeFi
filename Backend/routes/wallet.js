import express from 'express';
import { protect } from '../middleware/auth.js';
import walletController from '../controllers/walletController.js';
const router = express.Router();

// Get both wallet balances
router.get('/balances/:userId', protect, walletController.getBalances);

// Get UPI wallet details
router.get('/upi/:userId', protect, walletController.getUpiWallet);

// Get eRupee wallet details
router.get('/erupee/:userId', protect, async (req, res) => {
  try {
    // Initialize wallets if they don't exist
    await initializeWallets(req.params.userId);

    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const wallet = await ERupeeWallet.findById(profile.eRupeeWalletId);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Ensure profile has an erupeeId
    if (!profile.erupeeId) {
      profile.erupeeId = `ERUP${req.params.userId.toString().slice(-6)}${Date.now().toString().slice(-4)}`;
      await profile.save();
    }
    
    // Format transactions for frontend
    const formattedTransactions = wallet.transactions.map(tx => ({
      _id: tx._id,
      amount: tx.amount,
      type: tx.type,
      description: tx.note,
      timestamp: tx.timestamp,
      from: tx.from,
      to: tx.to
    }));
    
    // Include erupeeId from profile in the response
    const walletData = {
      balance: wallet.balance,
      transactions: formattedTransactions,
      erupeeId: profile.erupeeId
    };
    
    res.json(walletData);
  } catch (error) {
    console.error('Error fetching eRupee wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Transfer from UPI to e-Rupee wallet
router.post('/transfer-to-erupee', protect, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  try {
    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get user's profile
      const profile = await Profile.findOne({ user: userId })
        .populate('upiWalletId')
        .populate('eRupeeWalletId')
        .session(session);

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Check UPI balance
      if (profile.upiWalletId.balance < amount) {
        throw new Error('Insufficient UPI balance');
      }

      // Update UPI wallet
      await UpiWallet.findByIdAndUpdate(
        profile.upiWalletId._id,
        {
          $inc: { balance: -amount },
          $push: {
            transactions: {
              type: 'debit',
              amount: amount,
              timestamp: new Date(),
              description: 'Transfer to e-Rupee wallet'
            }
          }
        },
        { session }
      );

      // Update e-Rupee wallet
      await ERupeeWallet.findByIdAndUpdate(
        profile.eRupeeWalletId._id,
        {
          $inc: { balance: amount },
          $push: {
            transactions: {
              type: 'credit',
              amount: amount,
              timestamp: new Date(),
              description: 'Received from UPI wallet'
            }
          }
        },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      res.json({ message: 'Transfer successful' });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;