import express from 'express';
import { protect } from '../middleware/auth.js';
import walletController from '../controllers/walletController.js';
const router = express.Router();

// Get both wallet balances
router.get('/balances/:userId', protect, walletController.getBalances);

// Get UPI wallet details
router.get('/upi/:userId', protect, walletController.getUpiWallet);

// Get eRupee wallet details
router.get('/erupee/:userId', protect, walletController.getERupeeWallet);

// Transfer from UPI to e-Rupee wallet
router.post('/transfer-to-erupee', protect, walletController.transferToERupee);

export default router;