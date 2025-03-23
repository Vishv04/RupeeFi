import express from 'express';
import {
  checkKYCStatus,
  submitKYCDetails,
  sendOTP,
  verifyOTP
} from '../controllers/kycController.js';

const router = express.Router();

// Test route (no auth)
router.get('/test', (req, res) => {
  res.json({ message: 'KYC routes are working' });
});

// Check KYC status
router.get('/status/:userId', checkKYCStatus);

// Submit KYC details
router.post('/details', submitKYCDetails);

// Send OTP for verification
router.post('/send-otp', sendOTP);

// Verify OTP
router.post('/verify-otp', verifyOTP);

export default router; 