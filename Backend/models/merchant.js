import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Erupee', 'Card', 'UPI', 'PhonePe', 'GPay', 'Other']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const MerchantSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  upiId: {
    type: String,
    trim: true
  },
  balance: {
    type: Number,
    default: 0
  },
  paymentMethods: {
    type: [PaymentMethodSchema],
    default: [
      { name: 'Erupee', discount: 5 },
      { name: 'Card', discount: 0 },
      { name: 'UPI', discount: 0 },
      { name: 'PhonePe', discount: 0 },
      { name: 'GPay', discount: 0 }
    ]
  },
  businessCategory: {
    type: String,
    enum: ['Retail', 'Food', 'Services', 'Entertainment', 'Education', 'Healthcare', 'Other'],
    default: 'Other'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  logo: {
    type: String,
    default: ''
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, {
  timestamps: true
});

// Hash the password before saving
MerchantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
MerchantSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Merchant = mongoose.model('Merchant', MerchantSchema);

export default Merchant; 