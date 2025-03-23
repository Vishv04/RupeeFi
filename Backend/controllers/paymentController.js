import User from '../models/User.js';
import { updatePaymentStreak } from './streakRewards.js';

// After successful e-Rupee payment
const handleSuccessfulPayment = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;
    
    // Add 1 spin for each e-Rupee payment
    user.spinsAvailable += 1;
    
    // Update payment streak
    await updatePaymentStreak(userId);
    
    await user.save();
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};