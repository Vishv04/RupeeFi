import Profile from '../models/Profile.js';
import User from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }

    const profile = await Profile.findOne({ user: userId });
    
    // If no profile exists, create one with default values
    if (!profile) {
      const newProfile = await Profile.create({
        user: userId,
        qrCode: `QR_${userId}`,
        erupeeId: `ERUP_${userId}`,
        referralCode: `REF_${Math.random().toString(36).substr(2, 9)}`
      });
      
      return res.json({
        success: true,
        data: newProfile
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        ...req.body
      });
    } else {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: req.body },
        { new: true }
      );
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user profile
export const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getProfile,
  updateProfile,
  deleteProfile
}; 