import Merchant from '../models/merchant.js';
import Employee from '../models/employee.js';
import Transaction from '../models/transaction.js';

// Process salary payments to employees
export const processSalaryPayments = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const { payments } = req.body;

    if (!payments || Object.keys(payments).length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No payments provided',
        results: []
      });
    }

    // Get merchant details
    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ 
        success: false,
        message: 'Merchant not found',
        results: []
      });
    }

    // Calculate total amount to be paid
    const totalAmount = Object.values(payments).reduce((sum, amount) => sum + Number(amount), 0);

    // Check if merchant has sufficient balance
    if (merchant.balance < totalAmount) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient balance in merchant wallet',
        results: []
      });
    }

    // Process each payment
    const paymentResults = [];
    let hasErrors = false;

    for (const [employeeId, amount] of Object.entries(payments)) {
      try {
        // Get employee details
        const employee = await Employee.findById(employeeId);
        if (!employee) {
          paymentResults.push({
            employeeId,
            status: 'failed',
            message: 'Employee not found'
          });
          hasErrors = true;
          continue;
        }

        // Create transaction record
        const transaction = await Transaction.create({
          merchantId,
          employeeId,
          amount: Number(amount),
          type: 'salary',
          status: 'completed',
          paymentMethod: 'Erupee'
        });

        // Update merchant balance
        merchant.balance -= Number(amount);

        // Update employee balance
        employee.balance += Number(amount);

        // Save changes
        await Promise.all([
          merchant.save(),
          employee.save()
        ]);

        paymentResults.push({
          employeeId,
          status: 'success',
          transactionId: transaction._id,
          amount: Number(amount)
        });
      } catch (error) {
        paymentResults.push({
          employeeId,
          status: 'failed',
          message: error.message
        });
        hasErrors = true;
      }
    }

    // Return appropriate response based on whether there were any errors
    if (hasErrors) {
      return res.status(207).json({
        success: false,
        message: 'Some payments failed to process',
        results: paymentResults
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All salary payments processed successfully',
      results: paymentResults
    });
  } catch (error) {
    console.error('Error processing salary payments:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while processing payments',
      results: []
    });
  }
};

// Get salary payment history
export const getSalaryHistory = async (req, res) => {
  try {
    const merchantId = req.merchantId;

    const salaryTransactions = await Transaction.find({
      merchantId,
      type: 'salary'
    })
    .populate('employeeId', 'name role')
    .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      transactions: salaryTransactions
    });
  } catch (error) {
    console.error('Error getting salary history:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while fetching salary history',
      transactions: []
    });
  }
}; 