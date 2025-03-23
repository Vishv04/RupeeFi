import express from 'express';
import protect from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profile.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js'; // Assuming User model is defined in this file

const router = express.Router();

// Profile routes
router.get('/profile', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.query.userId })
      .populate('merchantId', '-password -__v')
      .populate('upiWalletId')
      .populate('eRupeeWalletId');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

// Search users by name
router.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.name;
    if (!searchQuery) {
      return res.json([]);
    }

    const users = await User.find(
      { 
        name: { $regex: searchQuery, $options: 'i' } 
      },
      'name eRupeeId' // Only return name and eRupeeId fields
    ).limit(5);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;