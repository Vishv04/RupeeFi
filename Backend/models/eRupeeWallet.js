// models/eRupeeWallet.js
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
            txHash: String,
            amount: Number,
            type: { type: String, enum: ['credit', 'debit'], required: true },
            from: String,
            to: String,
            note: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const eRupeeWallet = mongoose.model('eRupeeWallet', erupeeWalletSchema);

export default eRupeeWallet;