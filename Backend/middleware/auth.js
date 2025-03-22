import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Merchant from '../models/merchant.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
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