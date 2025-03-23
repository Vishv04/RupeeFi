import express from 'express';
import * as merchantController from '../controllers/merchant.js';
import { authMerchant } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import Merchant from '../models/merchant.js';
import auth from '../middleware/auth.js';
import Profile from '../models/Profile.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Register merchant
router.post('/register', async (req, res) => {
  try {
    const { businessName, email, password, phone, address, gstin, userId } = req.body;

    // Check if merchant already exists
    let merchant = await Merchant.findOne({ email });
    if (merchant) {
      return res.status(400).json({ message: 'Merchant already exists' });
    }

    // Create new merchant
    merchant = new Merchant({
      businessName,
      email,
      password,
      phone,
      address,
      gstin
    });

    await merchant.save();

    // Update user's profile with merchant ID
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      profile.merchantId = merchant._id;
      await profile.save();
    }

    // Generate token
    const token = jwt.sign(
      { merchantId: merchant._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      merchant: {
        _id: merchant._id,
        businessName: merchant.businessName,
        email: merchant.email,
        phone: merchant.phone,
        isVerified: merchant.isVerified
      }
    });
  } catch (error) {
    console.error('Merchant registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login merchant
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find merchant
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await merchant.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { merchantId: merchant._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      merchant: {
        _id: merchant._id,
        businessName: merchant.businessName,
        email: merchant.email,
        phone: merchant.phone,
        isVerified: merchant.isVerified
      }
    });
  } catch (error) {
    console.error('Merchant login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

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
router.get('/:merchantId', protect, async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.merchantId)
      .select('-password -__v');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.json({ merchant });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 