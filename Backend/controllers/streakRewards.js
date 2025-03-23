import User from '../models/User.js';
import ERupeeWallet from '../models/eRupeeWallet.js';
import Profile from '../models/Profile.js';

const STREAK_REWARD_AMOUNT = 7; // ₹7 reward for 7-day streak
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

// Check if two dates are consecutive days
const isConsecutiveDay = (date1, date2) => {
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return Math.abs(d2 - d1) === MILLISECONDS_PER_DAY;
};

// Update user's payment streak
export const updatePaymentStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    const lastPayment = user.lastPaymentDate;

    if (!lastPayment) {
      // First payment
      user.currentStreak = 1;
      user.streakStartDate = today;
    } else if (isConsecutiveDay(lastPayment, today)) {
      // Consecutive day payment
      user.currentStreak += 1;
    } else if (new Date(lastPayment).setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      // Already paid today, don't update streak
      return;
    } else {
      // Streak broken
      user.currentStreak = 1;
      user.streakStartDate = today;
    }

    user.lastPaymentDate = today;

    // Check if eligible for streak reward (7 days)
    if (user.currentStreak >= 7 && 
        (!user.lastStreakRewardDate || 
         !isConsecutiveDay(user.lastStreakRewardDate, user.streakStartDate))) {
      await giveStreakReward(user);
    }

    await user.save();
  } catch (error) {
    console.error('Error updating payment streak:', error);
  }
};

// Give streak reward to user
const giveStreakReward = async (user) => {
  try {
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) return;

    const wallet = await ERupeeWallet.findById(profile.eRupeeWalletId);
    if (!wallet) return;

    // Add reward to wallet
    wallet.balance += STREAK_REWARD_AMOUNT;
    wallet.transactions.push({
      amount: STREAK_REWARD_AMOUNT,
      type: 'CREDIT',
      from: 'REWARD_SYSTEM',
      to: profile.erupeeId,
      note: '7-day payment streak reward',
      timestamp: new Date()
    });

    // Update user's reward history
    user.rewardHistory.push({
      type: 'cashback',
      amount: STREAK_REWARD_AMOUNT,
      description: 'Reward for maintaining 7-day payment streak'
    });

    user.lastStreakRewardDate = new Date();
    
    await Promise.all([wallet.save(), user.save()]);
  } catch (error) {
    console.error('Error giving streak reward:', error);
  }
};

// Get user's streak information
export const getStreakInfo = async (req, res) => {
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
      currentStreak: user.currentStreak || 0,
      streakStartDate: user.streakStartDate,
      lastPaymentDate: user.lastPaymentDate,
      daysUntilReward: user.currentStreak >= 7 ? 0 : 7 - (user.currentStreak || 0)
    });
  } catch (error) {
    console.error('Error fetching streak info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching streak info'
    });
  }
};
