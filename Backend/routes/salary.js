import express from 'express';
import { authMerchant } from '../middleware/auth.js';
import { processSalaryPayments, getSalaryHistory } from '../controllers/salary.js';

const router = express.Router();

// Process salary payments
router.post('/process', authMerchant, processSalaryPayments);

// Get salary payment history
router.get('/history', authMerchant, getSalaryHistory);

export default router; 