import mongoose from 'mongoose'; // Import mongoose
import Profile from '../models/Profile.js';
import UpiWallet from '../models/upiWallet.js';
import ERupeeWallet from '../models/eRupeeWallet.js';

const initializeWallets = async (userId) => {
    try {
      let profile = await Profile.findOne({ user: userId });
      
      if (!profile) {
        // Create a new profile if it doesn't exist
        profile = new Profile({
          user: userId,
          qrCode: `USER_${userId}_${Date.now()}`, // Generate a proper QR code in production
          erupeeId: `ERUP${userId.toString().slice(-6)}${Date.now().toString().slice(-4)}` // Generate unique erupeeId
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
  
      // Ensure profile has an erupeeId
      if (!profile.erupeeId) {
        profile.erupeeId = `ERUP${userId.toString().slice(-6)}${Date.now().toString().slice(-4)}`;
      }
  
      await profile.save();
      return profile;
    } catch (error) {
      console.error('Error initializing wallets:', error);
      throw error;
    }
};

export const getBalances = async (req, res) => {
    try {
      // Initialize wallets if they don't exist
      await initializeWallets(req.params.userId);
  
      const profile = await Profile.findOne({ user: req.params.userId });
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Get UPI wallet
      const upiWallet = await UpiWallet.findById(profile.upiWalletId);
      if (!upiWallet) {
        return res.status(404).json({ message: 'UPI wallet not found' });
      }
  
      // Get eRupee wallet
      const eRupeeWallet = await ERupeeWallet.findById(profile.eRupeeWalletId);
      if (!eRupeeWallet) {
        return res.status(404).json({ message: 'eRupee wallet not found' });
      }
  
      res.json({
        upiWallet: { 
          balance: upiWallet.balance || 0,
          id: upiWallet._id 
        },
        eRupeeWallet: { 
          balance: eRupeeWallet.balance || 0,
          id: eRupeeWallet._id 
        }
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

export const getUpiWallet = async (req, res) => {
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
};

export const getERupeeWallet = async (req, res) => {
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
};

export const transferToERupee = async (req, res) => {
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
};

export default { getBalances, getUpiWallet, getERupeeWallet, transferToERupee };