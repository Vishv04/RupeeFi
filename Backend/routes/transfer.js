const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Verify UPI PIN
router.post('/verify-upi-pin', auth, async (req, res) => {
  try {
    const { userId, upiPin } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.upiPin !== upiPin) {
      return res.status(400).json({ message: 'Invalid UPI PIN' });
    }

    res.json({ verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Transfer money from UPI to e-Rupee wallet
router.post('/transfer-to-erupee', auth, async (req, res) => {
  try {
    const { userId, amount, upiPin } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify UPI PIN again for security
    if (user.upiPin !== upiPin) {
      return res.status(400).json({ message: 'Invalid UPI PIN' });
    }

    // Check if user has sufficient balance in UPI
    if (user.upiBalance < amount) {
      return res.status(400).json({ message: 'Insufficient UPI balance' });
    }

    // Perform the transfer
    user.upiBalance -= amount;
    user.eRupeeBalance += amount;
    
    // Save the updated balances
    await user.save();

    // Return updated balances
    res.json({
      success: true,
      upiBalance: user.upiBalance,
      eRupeeBalance: user.eRupeeBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 