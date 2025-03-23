import Userkyc from '../models/Userkyc.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { generateOTP } from '../utils/otp.js';
import { createLogger } from 'vite';

// Check KYC status
export const checkKYCStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Received request to check KYC status for user ID:', userId);

    const kyc = await Userkyc.findOne({ user: userId });
    console.log('KYC record found:', kyc ? 'Yes' : 'No');
    
    // If no KYC record is found, return a response indicating KYC is not completed
    // but return 200 status instead of 404
    res.json({
      kycCompleted: kyc ? kyc.isVerified : false,
      status: kyc ? kyc.status : 'pending'
    });
  } catch (error) {
    console.error('Error checking KYC status:', error);
    res.status(500).json({ message: 'Error checking KYC status' });
  }
};

// Submit KYC details
export const submitKYCDetails = async (req, res) => {
  try {
    console.log('Received KYC submission request');
    
    const { aadhaarNumber, contactNumber, panNumber } = req.body;
    console.log(req.user);
    const userId = req.user._id;

    console.log('User ID from token:', userId);

    // Check if KYC already exists
    let kyc = await Userkyc.findOne({ user: userId });
    
    if (kyc) {
      return res.status(400).json({ message: 'KYC already submitted' });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.signature || !req.files.facialData) {
      console.log('Missing required files');
      return res.status(400).json({ 
        message: 'Signature and facial data files are required',
        received: req.files ? Object.keys(req.files) : 'No files' 
      });
    }

    // Handle file uploads
    const signatureFile = req.files.signature;
    const facialDataFile = req.files.facialData;

    // Create new KYC record
    kyc = new Userkyc({
      user: userId,
      profile: userId, // Using userId as profile reference since we don't have a separate profile model
      aadharNumber: aadhaarNumber,
      panNumber,
      contactNumber,
      signature: signatureFile.name, // Store file name instead of path
      facialData: facialDataFile.name, // Store file name instead of path
      status: 'pending'
    });

    console.log('Saving KYC record:', kyc);
    await kyc.save();

    console.log(kyc);
    res.status(201).json({
      message: 'KYC details submitted successfully',
      kycId: kyc._id
    });
  } catch (error) {
    console.error('Error submitting KYC details:', error);
    res.status(500).json({ message: 'Error submitting KYC details' });
  }
};

// Send OTP for verification
export const sendOTP = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user document
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    await sendEmail({
      to: user.email,
      subject: 'KYC Verification OTP',
      text: `Your OTP for KYC verification is: ${otp}. This OTP will expire in 10 minutes.`
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP request found' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update KYC status
    const kyc = await Userkyc.findOne({ user: userId });
    if (kyc) {
      kyc.isVerified = true;
      kyc.status = 'approved';
      await kyc.save();
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'KYC verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
}; 