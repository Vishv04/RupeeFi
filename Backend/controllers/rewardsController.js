import User from '../models/User.js';

// Get available spins
export const getSpinsAvailable = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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
      message: 'Server error' 
    });
  }
};

// Spin the wheel
export const spinWheel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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

    // Define rewards and their probabilities
    const rewards = [
      { value: '₹5', type: 'cashback', amount: 5, probability: 0.25 },
      { value: '₹10', type: 'cashback', amount: 10, probability: 0.20 },
      { value: '₹15', type: 'cashback', amount: 15, probability: 0.15 },
      { value: '₹20', type: 'cashback', amount: 20, probability: 0.10 },
      { value: '₹25', type: 'cashback', amount: 25, probability: 0.05 },
      { value: '₹50', type: 'cashback', amount: 50, probability: 0.02 },
      { value: '10% Off', type: 'discount', amount: 10, probability: 0.13 },
      { value: 'Try Again', type: 'none', amount: 0, probability: 0.10 }
    ];

    // Select reward based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedReward;

    for (const reward of rewards) {
      cumulativeProbability += reward.probability;
      if (random <= cumulativeProbability) {
        selectedReward = reward;
        break;
      }
    }

    // Update user data
    user.spinsAvailable -= 1;
    user.totalSpinsUsed = (user.totalSpinsUsed || 0) + 1;
    user.lastSpinDate = new Date();

    if (selectedReward.type === 'cashback') {
      user.eRupeeBalance = (user.eRupeeBalance || 0) + selectedReward.amount;
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
      amount: selectedReward.amount
    });
  } catch (error) {
    console.error('Error processing spin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

// Get reward history
export const getRewardHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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

// Add this new function to your existing rewardsController.js
export const claimDailySpin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
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
    const user = await User.findById(req.user.id);
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
    const user = await User.findById(req.user.id);
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

    // Update user data
    user.scratchCardsAvailable -= 1;
    user.totalScratchCardsUsed += 1;
    user.lastScratchCardDate = new Date();
    user.eRupeeBalance += amount;
    
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