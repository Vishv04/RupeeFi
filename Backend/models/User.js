import mongoose from 'mongoose';

const rewardHistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['cashback', 'discount', 'voucher'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  picture: String,
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  eRupeeBalance: {
    type: Number,
    default: 0
  },
  // Add reward-related fields
  spinsAvailable: {
    type: Number,
    default: 20  // Start with 3 free spins
  },
  totalSpinsUsed: {
    type: Number,
    default: 0
  },
  lastDailySpinClaim: {
    type: Date,
    default: null
  },
  isFirstLogin: {
    type: Boolean,
    default: true
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
  bankAccount: {
    accountNumber: String,
    ifscCode: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  scratchCardsAvailable: {
    type: Number,
    default: 20  // Start with 3 free scratch cards
  },
  totalScratchCardsUsed: {
    type: Number,
    default: 0
  },
  lastScratchCardDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema); 