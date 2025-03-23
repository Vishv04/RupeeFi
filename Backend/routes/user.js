import express from 'express';
import protect from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profile.js';
import User from '../models/User.js'; // Assuming User model is defined in this file

const router = express.Router();

// Profile routes
router.get('/profile', getProfile);
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