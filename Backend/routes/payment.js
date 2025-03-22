import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify payment and update UPI balance
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Get payment details
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      // Update user's UPI balance
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.upiBalance += payment.amount / 100; // Convert paise to rupees
      await user.save();

      res.json({
        success: true,
        balance: user.upiBalance
      });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

export default router; 