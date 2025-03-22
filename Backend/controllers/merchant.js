import Merchant from '../models/merchant.js';
import Transaction from '../models/transaction.js';
import { generateQRCode } from '../utils/qrUtils.js';

// Get merchant profile
export const getMerchantProfile = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    
    const merchant = await Merchant.findById(merchantId)
      .select('-password -__v');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    res.status(200).json({ merchant });
  } catch (error) {
    console.error('Error getting merchant profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update merchant profile
export const updateMerchantProfile = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { businessName, address, email, phone, upiId } = req.body;
    
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      { businessName, address, email, phone, upiId },
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    res.status(200).json({ merchant: updatedMerchant });
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get merchant balance
export const getMerchantBalance = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    
    const merchant = await Merchant.findById(merchantId)
      .select('balance');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    res.status(200).json({ balance: merchant.balance });
  } catch (error) {
    console.error('Error getting merchant balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get merchant transactions
export const getMerchantTransactions = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: 'customerId',
    };
    
    const transactions = await Transaction.paginate(
      { merchantId },
      options
    );
    
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error getting merchant transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get merchant payment methods and discounts
export const getPaymentMethods = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    
    const merchant = await Merchant.findById(merchantId)
      .select('paymentMethods');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    res.status(200).json({ paymentMethods: merchant.paymentMethods });
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payment method discounts
export const updatePaymentMethodDiscount = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { paymentMethod, discount } = req.body;
    
    if (!paymentMethod || discount === undefined) {
      return res.status(400).json({ message: 'Payment method and discount are required' });
    }
    
    const merchant = await Merchant.findById(merchantId);
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    // Find and update the specific payment method
    const methodIndex = merchant.paymentMethods.findIndex(
      method => method.name === paymentMethod
    );
    
    if (methodIndex === -1) {
      // If payment method doesn't exist, add it
      merchant.paymentMethods.push({ name: paymentMethod, discount });
    } else {
      // Update existing payment method
      merchant.paymentMethods[methodIndex].discount = discount;
    }
    
    await merchant.save();
    
    res.status(200).json({ 
      message: 'Discount updated successfully',
      paymentMethods: merchant.paymentMethods 
    });
  } catch (error) {
    console.error('Error updating payment method discount:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate payment QR code
export const generatePaymentQR = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { amount } = req.body;
    
    const merchant = await Merchant.findById(merchantId)
      .select('businessName upiId');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    const paymentData = {
      merchantId: merchantId,
      businessName: merchant.businessName,
      upiId: merchant.upiId,
      amount: amount || '',
      timestamp: new Date().toISOString()
    };
    
    const qrCode = await generateQRCode(JSON.stringify(paymentData));
    
    res.status(200).json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get customer insights
export const getCustomerInsights = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    
    // Get total customers count
    const totalCustomersQuery = await Transaction.distinct('customerId', { merchantId });
    const totalCustomers = totalCustomersQuery.length;
    
    // Get transactions by payment method
    const paymentMethodStats = await Transaction.aggregate([
      { $match: { merchantId: merchantId } },
      { $group: { 
        _id: '$paymentMethod', 
        count: { $sum: 1 },
        total: { $sum: '$amount' }
      }},
      { $project: {
        _id: 0,
        method: '$_id',
        count: 1,
        total: 1
      }}
    ]);
    
    // Get recent customers
    const recentCustomers = await Transaction.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'name email phone')
      .select('customerId amount paymentMethod createdAt');
    
    res.status(200).json({
      totalCustomers,
      paymentMethodStats,
      recentCustomers
    });
  } catch (error) {
    console.error('Error getting customer insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    
    // Get current balance
    const merchant = await Merchant.findById(merchantId)
      .select('balance paymentMethods');
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    // Get today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Transaction.aggregate([
      { 
        $match: { 
          merchantId: merchantId,
          createdAt: { $gte: today }
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      }
    ]);
    
    // Get yesterday's revenue for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayRevenue = await Transaction.aggregate([
      { 
        $match: { 
          merchantId: merchantId,
          createdAt: { $gte: yesterday, $lt: today }
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        } 
      }
    ]);
    
    // Get weekly revenue data for chart
    const weeklyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayRevenue = await Transaction.aggregate([
        { 
          $match: { 
            merchantId: merchantId,
            createdAt: { $gte: date, $lt: nextDate }
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: '$amount' }
          } 
        }
      ]);
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weeklyRevenue.push({
        name: days[date.getDay()],
        amount: dayRevenue.length > 0 ? dayRevenue[0].total : 0
      });
    }
    
    // Get payment method distribution
    const paymentMethodDistribution = await Transaction.aggregate([
      { $match: { merchantId: merchantId } },
      { $group: { 
        _id: '$paymentMethod', 
        value: { $sum: 1 }
      }},
      { $project: {
        _id: 0,
        name: '$_id',
        value: 1
      }}
    ]);
    
    // Get recent transactions
    const recentTransactions = await Transaction.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'name')
      .select('id customerId amount paymentMethod status createdAt');
    
    const formattedTransactions = recentTransactions.map(txn => ({
      id: txn._id.toString().slice(-7).toUpperCase(),
      customer: txn.customerId ? txn.customerId.name : 'Anonymous',
      amount: txn.amount,
      method: txn.paymentMethod,
      status: txn.status,
      date: txn.createdAt.toISOString().split('T')[0]
    }));
    
    res.status(200).json({
      currentBalance: merchant.balance,
      todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].total : 0,
      todayTransactions: todayRevenue.length > 0 ? todayRevenue[0].count : 0,
      yesterdayRevenue: yesterdayRevenue.length > 0 ? yesterdayRevenue[0].total : 0,
      yesterdayTransactions: yesterdayRevenue.length > 0 ? yesterdayRevenue[0].count : 0,
      paymentMethods: merchant.paymentMethods,
      revenueData: weeklyRevenue,
      paymentMethodData: paymentMethodDistribution,
      transactions: formattedTransactions
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 