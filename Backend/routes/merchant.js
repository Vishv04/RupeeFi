import express from 'express';
import * as merchantController from '../controllers/merchant.js';
import { authMerchant } from '../middleware/auth.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Register merchant
router.post('/register', merchantController.registerMerchant);

// Login merchant
router.post('/login', merchantController.loginMerchant);

// Route to get merchant profile
router.get('/profile', authMerchant, merchantController.getMerchantProfile);

// Route to update merchant profile
router.put('/profile', authMerchant, merchantController.updateMerchantProfile);

// Route to get merchant balance
router.get('/balance', authMerchant, merchantController.getMerchantBalance);

// Route to get merchant transactions
router.get('/transactions', authMerchant, merchantController.getMerchantTransactions);

// Route to get payment methods and discounts
router.get('/payment-methods', authMerchant, merchantController.getPaymentMethods);

// Route to update payment method discount
router.put('/payment-methods', authMerchant, merchantController.updatePaymentMethodDiscount);

// Route to generate payment QR code
router.post('/generate-qr', authMerchant, merchantController.generatePaymentQR);

// Route to get customer insights
router.get('/customer-insights', authMerchant, merchantController.getCustomerInsights);

// Route to get dashboard stats
router.get('/dashboard-stats', authMerchant, merchantController.getDashboardStats);

// Get merchant by ID
router.get('/:merchantId', protect, merchantController.getMerchantProfile);

export default router; 