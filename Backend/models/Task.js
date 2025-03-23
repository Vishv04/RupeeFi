import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'referral', 'transaction', 'daily'],
    required: true
  },
  reward: {
    type: Number,
    required: true,
    default: 0
  },
  requirements: {
    type: Map,
    of: Number,
    default: {}
  },
  isDaily: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
});

// Index for faster queries
taskSchema.index({ type: 1, isDaily: 1 });

export default mongoose.model('Task', taskSchema); 