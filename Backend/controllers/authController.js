import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { initializeWallets } from '../routes/wallet.js';
import Wallet from '../models/wallet.js';
import Profile from '../models/profile.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const initializeWallet = async (userId) => {
  try {
    let profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      profile = new Profile({
        user: userId,
        qrCode: `USER_${userId}_${Date.now()}`,
      });
    }

    if (!profile.walletId) {
      const wallet = await Wallet.create({
        profile: profile._id,
        upiBalance: 0,
        eRupeeBalance: 0,
        upiTransactions: [],
        eRupeeTransactions: []
      });
      profile.walletId = wallet._id;
      await profile.save();
    }

    return profile;
  } catch (error) {
    console.error('Error initializing wallet:', error);
    throw error;
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;

    // Validate required fields
    if (!email || !name || !googleId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { email, name, googleId }
      });
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId,
        visitCount: 1,
        lastVisit: new Date()
      });
    } else {
      // Update existing user's info and increment visit count
      user.name = name;
      user.picture = picture;
      user.googleId = googleId;
      user.visitCount += 1;
      user.lastVisit = new Date();
      await user.save();
    }

    // Generate JWT token with MongoDB _id
    const jwtToken = jwt.sign(
      { 
        id: user._id,
        email,
        name,
        sub: googleId,
        picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        visitCount: user.visitCount,
        lastVisit: user.lastVisit
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      message: 'Error processing login',
      error: error.message 
    });
  }
};

export default { googleLogin };