import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  upiBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  eRupeeBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  upiTransactions: [
    {
      amount: Number,
      type: { type: String, enum: ['credit', 'debit'], required: true },
      from: String,
      to: String,
      description: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  eRupeeTransactions: [
    {
      txHash: String,
      amount: Number,
      type: { type: String, enum: ['credit', 'debit'], required: true },
      from: String,
      to: String,
      note: String,
      timestamp: { type: Date, default: Date.now },
    },
  ]
});

export default mongoose.model('Wallet', walletSchema); 