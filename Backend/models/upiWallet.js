import mongoose from 'mongoose';

const upiWalletSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    transactions: [
        {
            amount: Number,
            type: { type: String, enum: ['credit', 'debit'], required: true },
            from: String,
            to: String,
            description: String,
            timestamp: { type: Date, default: Date.now },
        },
    ]
});

const UpiWallet = mongoose.model('UpiWallet', upiWalletSchema);

export default UpiWallet;