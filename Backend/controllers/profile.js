import Profile from '../models/Profile.js';
import User from '../models/User.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.query.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Get UPI wallet
    const upiWalletData = await UpiWallet.findById(profile.upiWalletId);
    
    // Get eRupee wallet
    const erupeeWalletData = await ERupeeWallet.findById(profile.eRupeeWalletId);

    // Get user data
    const user = await User.findById(req.query.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      profile: {
        ...profile.toObject(),
        upiWallet: upiWalletData || null,
        eRupeeWallet: erupeeWalletData || null,
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
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