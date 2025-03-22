import express from 'express';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// PhonePe Sandbox API configs
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// Create PhonePe payment request
router.post('/phonepe', auth, async (req, res) => {
  try {
    const { amount, userId } = req.body;
    
    // Validate amount limits (₹1 to ₹1000 for testing)
    if (amount < 1 || amount > 1000) {
      return res.status(400).json({ 
        message: 'Amount should be between ₹1 and ₹1000 for testing' 
      });
    }

    const transactionId = `TXN_${Date.now()}_${userId}`;

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectUrl: `${process.env.FRONTEND_URL}/payment/callback`,
      redirectMode: 'POST',
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const message = base64Payload + '/pg/v1/pay' + SALT_KEY;
    const sha256 = crypto.createHash('sha256').update(message).digest('hex');
    const checksum = sha256 + '###' + SALT_INDEX;

    const response = await fetch(`${API_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum
      },
      body: JSON.stringify({
        request: base64Payload
      })
    });

    const data = await response.json();

    if (data.success) {
      res.json({
        success: true,
        paymentUrl: data.data.instrumentResponse.redirectInfo.url
      });
    } else {
      res.status(400).json({ 
        message: data.message || 'Failed to create payment' 
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle PhonePe callback
router.post('/callback', async (req, res) => {
  try {
    const { merchantTransactionId, code, amount } = req.body;

    if (code === 'PAYMENT_SUCCESS') {
      const userId = merchantTransactionId.split('_')[2];
      const user = await User.findById(userId);
      
      if (user) {
        user.upiBalance += amount / 100;
        await user.save();
      }

      res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=success`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=failed&code=${code}`);
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=error`);
  }
});

export default router; 