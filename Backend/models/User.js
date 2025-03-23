import mongoose from 'mongoose';

const rewardHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['cashback', 'discount', 'voucher'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: String,
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  eRupeeBalance: {
    type: Number,
    default: 500,  // Start with 500 for demo
  },
  upiBalance: {  // Added to support UPI integration
    type: Number,
    default: 500,  // Start with 500 for demo
  },
  spinsAvailable: {
    type: Number,
    default: 20,
  },
  totalSpinsUsed: {
    type: Number,
    default: 0,
  },
  lastDailySpinClaim: {
    type: Date,
    default: null,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
  },
  // Payment streak tracking
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastPaymentDate: {
    type: Date,
    default: null,
  },
  streakStartDate: {
    type: Date,
    default: null,
  },
  lastStreakRewardDate: {
    type: Date,
    default: null,
  },
  rewardHistory: [rewardHistorySchema],
  lastSpinDate: Date,
  visitCount: {
    type: Number,
    default: 0,
  },
  lastVisit: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  scratchCardsAvailable: {
    type: Number,
    default: 20,
  },
  isMerchant: {
    type: Boolean,
    default: false,
  },
  eRupeeId: {
    type: String,
    unique: true,
    sparse: true,
  }
});

const User = mongoose.model('User', userSchema);
export default User;