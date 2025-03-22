import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        upiBalance: user.upiBalance,
        eRupeeBalance: user.eRupeeBalance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      upiBalance: user.upiBalance,
      eRupeeBalance: user.eRupeeBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update UPI PIN
router.post('/update-upi-pin', auth, async (req, res) => {
  try {
    const { upiPin } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.upiPin = upiPin;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 