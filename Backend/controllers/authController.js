const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');
const fetch = require('node-fetch');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    user = await User.create({
      name,
      email,
      password,
      otp: {
        code: otp,
        expiry: otpExpiry
      }
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Error sending verification email'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    if (user.otp.code !== otp || user.otp.expiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update visit count
    user.visitCount += 1;
    user.lastVisit = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    // Verify token with Google OAuth
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`);
    const data = await response.json();
    
    if (!data.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    let user = await User.findOne({ email: data.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: data.name,
        email: data.email,
        googleId: data.sub,
        isVerified: true
      });
    }

    // Update visit count
    user.visitCount += 1;
    user.lastVisit = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 