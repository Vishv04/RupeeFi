import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Merchant from '../models/merchant.js';

const protect = async (req, res, next) => {
  try {
    // console.log(req.headers);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user using the id from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

export const authMerchant = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if merchant id exists in the decoded token
    if (!decoded.merchantId) {
      return res.status(401).json({ message: 'Not authorized as a merchant' });
    }
    
    // Find merchant by id
    const merchant = await Merchant.findById(decoded.merchantId).select('-password');
    
    if (!merchant) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Add merchant to request object
    req.merchant = merchant;
    req.merchantId = merchant._id;
    
    next();
  } catch (error) {
    console.error('Merchant authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protect; 