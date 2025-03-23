import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile.js';
import UpiWallet from '../models/upiWallet.js';
import ERupeeWallet from '../models/eRupeeWallet.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Initialize wallets after successful login
    await initializeWallets(user._id);

    const token = generateToken(user._id);
    res.json({
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
    res.status(500).json({ message: 'Login failed' });
  }
};

export default {  googleLogin, login, initializeWallets };