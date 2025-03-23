import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        default: null
    },
    qrCode: {
        type: String,
        required: true,
    },
    erupeeId: {
        type: String,
    },
    upiWalletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpiWallet'
    },
    eRupeeWalletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ERupeeWallet'
    },
    referralCount: {
        type: Number,
        default: 0,
    },
    referralCode: {
        type: String,
    },

});

export default mongoose.model('Profile', profileSchema); 