import mongoose from 'mongoose';

const userkycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    aadharNumber: {
        type: String,
        required: true,
    },
    panNumber: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    facialData: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }

});

export default mongoose.model('Userkyc', userkycSchema); 