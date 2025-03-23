import express from 'express';
import protect from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profile.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

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

    // First find users matching the name
    const users = await User.aggregate([
      {
        $match: { 
          name: { $regex: searchQuery, $options: 'i' } 
        }
      },
      {
        $lookup: {
          from: 'profiles',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$user', '$$userId'] }
              }
            }
          ],
          as: 'profile'
        }
      },
      {
        $unwind: '$profile'
      },
      {
        $project: {
          _id: 1,
          name: 1,
          erupeeId: '$profile.erupeeId'
        }
      }
    ]).limit(5);

    // If any user doesn't have an erupeeId, initialize their wallet
    for (const user of users) {
      if (!user.erupeeId) {
        const profile = await Profile.findOne({ user: user._id });
        if (profile) {
          profile.erupeeId = `ERUP${user._id.toString().slice(-6)}${Date.now().toString().slice(-4)}`;
          await profile.save();
          user.erupeeId = profile.erupeeId;
        }
      }
    }

    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;