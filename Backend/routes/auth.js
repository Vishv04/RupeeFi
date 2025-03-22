import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/google-login', async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId,
        upiBalance: 0,
        eRupeeBalance: 0
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({
      success: true,
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 