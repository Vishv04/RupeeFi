import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const TransactionSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  originalAmount: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Erupee', 'Card', 'UPI', 'PhonePe', 'GPay', 'Other']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: String
  },
  reference: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add pagination plugin
TransactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction; 