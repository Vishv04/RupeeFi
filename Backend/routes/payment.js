import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import Profile from '../models/Profile.js';
import Wallet from '../models/wallet.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify payment and update wallet
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
      walletType
    } = req.body;

    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Transaction not legit!' });
    }

    // Find user's profile and wallet
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const wallet = await Wallet.findById(profile.walletId);
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Get payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amountInRupees = payment.amount / 100;

    // Update appropriate wallet balance and transactions
    if (walletType === 'upi') {
      wallet.upiBalance += amountInRupees;
      wallet.upiTransactions.push({
        amount: amountInRupees,
        type: 'credit',
        from: 'Razorpay',
        to: 'Wallet',
        description: 'Added money via Razorpay',
        timestamp: new Date()
      });
    } else {
      wallet.eRupeeBalance += amountInRupees;
      wallet.eRupeeTransactions.push({
        txHash: `TX_${Date.now()}`,
        amount: amountInRupees,
        type: 'credit',
        from: 'Razorpay',
        to: 'Wallet',
        note: 'Added money via Razorpay',
        timestamp: new Date()
      });
    }

    await wallet.save();

    res.json({
      message: 'Payment verified successfully',
      balance: walletType === 'upi' ? wallet.upiBalance : wallet.eRupeeBalance
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

export default router; 