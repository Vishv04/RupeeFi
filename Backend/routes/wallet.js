import express from 'express';
import { protect } from '../middleware/auth.js';
import UpiWallet from '../models/upiWallet.js';
import ERupeeWallet from '../models/eRupeeWallet.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// Initialize wallets for a user
const initializeWallets = async (userId) => {
  try {
    let profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      // Create a new profile if it doesn't exist
      profile = new Profile({
        user: userId,
        qrCode: `USER_${userId}_${Date.now()}`, // Generate a proper QR code in production
      });
    }

    // Create UPI wallet if it doesn't exist
    if (!profile.upiWalletId) {
      const upiWallet = await UpiWallet.create({
        profile: profile._id,
        balance: 0,
        transactions: []
      });
      profile.upiWalletId = upiWallet._id;
    }

    // Create eRupee wallet if it doesn't exist
    if (!profile.eRupeeWalletId) {
      const eRupeeWallet = await ERupeeWallet.create({
        userId: userId,
        balance: 0,
        transactions: []
      });
      profile.eRupeeWalletId = eRupeeWallet._id;
    }

    await profile.save();
    return profile;
  } catch (error) {
    console.error('Error initializing wallets:', error);
    throw error;
  }
};

// Get both wallet balances
router.get('/balances/:userId', protect, async (req, res) => {
  try {
    // Initialize wallets if they don't exist
    await initializeWallets(req.params.userId);

    const profile = await Profile.findOne({ user: req.params.userId })
      .populate('upiWalletId')
      .populate('eRupeeWalletId');

    res.json({
      upiWallet: { 
        balance: profile.upiWalletId?.balance || 0,
        id: profile.upiWalletId?._id 
      },
      eRupeeWallet: { 
        balance: profile.eRupeeWalletId?.balance || 0,
        id: profile.eRupeeWalletId?._id 
      }
    });
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get UPI wallet details
router.get('/upi/:userId', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const wallet = await UpiWallet.findById(profile.upiWalletId)
      .populate('transactions.from', 'name')
      .populate('transactions.to', 'name');
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error('Error fetching UPI wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get eRupee wallet details
router.get('/erupee/:userId', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const wallet = await ERupeeWallet.findById(profile.eRupeeWalletId)
      .populate('transactions.from', 'name')
      .populate('transactions.to', 'name');
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    res.json(wallet);
  } catch (error) {
    console.error('Error fetching eRupee wallet:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;