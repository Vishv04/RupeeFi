import express from 'express';
import {
  checkKYCStatus,
  submitKYCDetails,
  sendOTP,
  verifyOTP
} from '../controllers/kycController.js';

const router = express.Router();

router.get('/status/:userId', checkKYCStatus);
router.post('/details', submitKYCDetails);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router; 