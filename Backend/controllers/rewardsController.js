import User from '../models/User.js';
import ERupeeWallet from '../models/eRupeeWallet.js';
import Profile from '../models/Profile.js';

// Get available spins
export const getSpinsAvailable = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      spinsAvailable: user.spinsAvailable || 0
    });
  } catch (error) {
    console.error('Error fetching spins:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching spins'
    });
  }
};

// Spin the wheel
export const spinWheel = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.spinsAvailable <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No spins available' 
      });
    }

    // Define rewards without probabilities
    const rewards = [
      { value: '₹5', type: 'cashback', amount: 5 },
      { value: '₹10', type: 'cashback', amount: 10 },
      { value: '₹15', type: 'cashback', amount: 15 },
      { value: '₹20', type: 'cashback', amount: 20 },
      { value: '₹25', type: 'cashback', amount: 25 },
      { value: '₹50', type: 'cashback', amount: 50 },
      { value: '10% Off', type: 'discount', amount: 10 },
      { value: 'Try Again', type: 'none', amount: 0 }
    ];

    // Generate random spins (between 3 and 5 full rotations)
    const fullSpins = Math.floor(Math.random() * 3) + 3;
    
    // Select random final position (0-7 for 8 slots)
    const randomIndex = Math.floor(Math.random() * rewards.length);
    
    // Calculate total degrees to spin
    // Each slot is 45 degrees (360/8)
    const degreesPerSlot = 360 / rewards.length;
    const finalDegrees = (fullSpins * 360) + (randomIndex * degreesPerSlot);
    
    const selectedReward = rewards[randomIndex];

    // Update user data
    user.spinsAvailable -= 1;
    user.totalSpinsUsed = (user.totalSpinsUsed || 0) + 1;
    user.lastSpinDate = new Date();

    if (selectedReward.type === 'cashback') {
      // Get user's profile and e-rupee wallet
      const profile = await Profile.findOne({ user: user._id });
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }

      const wallet = await ERupeeWallet.findById(profile.eRupeeWalletId);
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'e-Rupee wallet not found'
        });
      }

      // Update wallet balance and add transaction
      wallet.balance += selectedReward.amount;
      wallet.transactions.push({
        amount: selectedReward.amount,
        type: 'credit',
        from: 'REWARD_SYSTEM',
        to: profile.erupeeId,
        note: `Won ₹${selectedReward.amount} cashback from Spin & Win`,
        timestamp: new Date()
      });

      await wallet.save();
      user.rewardHistory.push({
        type: 'cashback',
        amount: selectedReward.amount,
        description: `Won ₹${selectedReward.amount} cashback from Spin & Win`
      });
    } else if (selectedReward.type === 'discount') {
      user.rewardHistory.push({
        type: 'discount',
        amount: selectedReward.amount,
        description: `Won ${selectedReward.amount}% discount voucher from Spin & Win`
      });
    }

    await user.save();

    res.json({
      success: true,
      reward: selectedReward.value,
      type: selectedReward.type,
      amount: selectedReward.amount,
      // Add these new properties for the spinning animation
      finalDegrees: finalDegrees,
      selectedIndex: randomIndex,
      totalSlots: rewards.length
    });
  } catch (error) {
    console.error('Error processing spin:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get reward history
export const getRewardHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      history: user.rewardHistory || []
    });
  } catch (error) {
    console.error('Error fetching reward history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Helper function to check if it's a new day
const isNewDay = (lastDate, currentDate) => {
  if (!lastDate) return true;
  
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  
  return (
    last.getFullYear() !== current.getFullYear() ||
    last.getMonth() !== current.getMonth() ||
    last.getDate() !== current.getDate()
  );
};

// Add this new function to your existing rewardsController.js
export const claimDailySpin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const now = new Date();
    const lastClaim = user.lastDailySpinClaim;

    if (!lastClaim || isNewDay(lastClaim, now)) {
      user.spinsAvailable += 1;
      user.lastDailySpinClaim = now;
      await user.save();

      res.json({
        success: true,
        message: 'Daily spin claimed successfully',
        spinsAvailable: user.spinsAvailable
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Daily spin already claimed',
        nextClaimTime: new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000)
      });
    }
  } catch (error) {
    console.error('Error claiming daily spin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

export const getScratchCards = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      cardsAvailable: user.scratchCardsAvailable
    });
  } catch (error) {
    console.error('Error fetching scratch cards:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const scratchCard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.scratchCardsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No scratch cards available'
      });
    }

    // Generate random reward between 10 and 50
    const amount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;

    // Get user's profile and e-rupee wallet
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const wallet = await ERupeeWallet.findById(profile.eRupeeWalletId);
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'e-Rupee wallet not found'
      });
    }

    // Update user data
    user.scratchCardsAvailable -= 1;
    user.totalScratchCardsUsed += 1;
    user.lastScratchCardDate = new Date();
    
    // Update wallet balance and add transaction
    wallet.balance += amount;
    wallet.transactions.push({
      amount: amount,
      type: 'credit',
      from: 'REWARD_SYSTEM',
      to: profile.erupeeId,
      note: `Won ₹${amount} cashback from Scratch Card`,
      timestamp: new Date()
    });

    await wallet.save();
    
    user.rewardHistory.push({
      type: 'cashback',
      amount: amount,
      description: `Won ₹${amount} cashback from Scratch Card`
    });

    await user.save();

    res.json({
      success: true,
      type: 'cashback',
      amount: amount
    });
  } catch (error) {
    console.error('Error processing scratch card:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 