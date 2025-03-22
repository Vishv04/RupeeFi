// models/ERupeeWallet.js
import mongoose from 'mongoose';

const erupeeWalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    transactions: [
        {
        txHash: String, // unique simulated transaction hash
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        note: String,
        timestamp: { type: Date, default: Date.now },
        },
    ],
});

export default mongoose.model('ERupeeWallet', erupeeWalletSchema);