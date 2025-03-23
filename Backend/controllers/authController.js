import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import UpiWallet from '../models/upiWallet.js';
import ERupeeWallet from '../models/eRupeeWallet.js';

export const initializeWallets = async (userId) => {
  try {
    let profile = await Profile.findOne({ user: userId });
    
    if (!profile) {
      profile = new Profile({
        user: userId,
        qrCode: `USER_${userId}_${Date.now()}`,
        erupeeId: `ERUP_${userId}`,
        referralCode: `REF_${Math.random().toString(36).substr(2, 9)}`
      });
    }

    // Create UPI wallet if it doesn't exist
    if (!profile.upiWalletId) {
      const upiWallet = new UpiWallet({
        profile: profile._id,
        balance: 0,
        transactions: []
      });
      await upiWallet.save();
      profile.upiWalletId = upiWallet._id;
    }

    // Create eRupee wallet if it doesn't exist
    if (!profile.eRupeeWalletId) {
      const eRupeeWallet = new ERupeeWallet({
        userId: userId,
        balance: 0,
        transactions: []
      });
      await eRupeeWallet.save();
      profile.eRupeeWalletId = eRupeeWallet._id;
    }

    await profile.save();
    return profile;
  } catch (error) {
    console.error('Error initializing wallets:', error);
    throw error;
  }
};

export const googleLogin = async (req, res) => {
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
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name
      }, 
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {  googleLogin, initializeWallets };