import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
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
  }
});

export default mongoose.model('User', userSchema); 