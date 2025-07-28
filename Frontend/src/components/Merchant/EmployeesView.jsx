import React, { useState } from 'react';
import { UserPlus, Search, Edit, Trash2, IndianRupee, Split, Wallet } from 'lucide-react';
import { employeesData } from './merchantData';

const EmployeesView = ({ darkMode, cardShadow }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('split'); // 'split' or 'individual'
  const [totalAmount, setTotalAmount] = useState('');
  const [employeePayments, setEmployeePayments] = useState({});
  
  // Style for the card components
  const cardStyle = {
    boxShadow: cardShadow,
    transition: 'all 0.3s ease'
  };
  
  // Style for buttons
  const buttonStyle = {
    boxShadow: darkMode 
      ? '0 1px 2px rgba(0, 0, 0, 0.3)' 
      : '0 1px 2px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease'
  };

  const handleSplitPayment = () => {
    if (!totalAmount || totalAmount <= 0) return;
    
    const amountPerEmployee = Math.floor(totalAmount / employeesData.length);
    const payments = {};
    employeesData.forEach(employee => {
      payments[employee.id] = amountPerEmployee;
    });
    
    setEmployeePayments(payments);
  };

  const handleIndividualPayment = (employeeId, amount) => {
    setEmployeePayments(prev => ({
      ...prev,
      [employeeId]: amount
    }));
  };

  const handleSubmitPayments = async () => {
    try {
      // Validate that there are payments to process
      if (Object.keys(employeePayments).length === 0) {
        throw new Error('Please add payment amounts for employees');
      }

      // Validate that all amounts are positive numbers
      const invalidAmounts = Object.entries(employeePayments).filter(([, amount]) => 
        isNaN(amount) || amount <= 0
      );
      if (invalidAmounts.length > 0) {
        throw new Error('All payment amounts must be positive numbers');
      }

      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to process payments');
      }

      // Use the correct API endpoint
      const response = await fetch('/api/salary/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payments: employeePayments
        })
      });

      // First check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Failed to process payments';
        } catch {
          errorMessage = errorText || 'Failed to process payments';
        }
        throw new Error(errorMessage);
      }

      // Try to parse the response as JSON
      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }

      if (!data || !data.results) {
        throw new Error('Invalid response format from server');
      }

      // Check if any payments failed
      const failedPayments = data.results.filter(result => result.status === 'failed');
      if (failedPayments.length > 0) {
        const failedMessage = failedPayments.map(payment => 
          `Payment failed for employee ${payment.employeeId}: ${payment.message}`
        ).join('\n');
        throw new Error(failedMessage);
      }

      // Show success message
      alert('Salary payments processed successfully!');
      setShowSalaryModal(false);
      setEmployeePayments({});
      setTotalAmount('');
    } catch (error) {
      console.error('Error processing payments:', error);
      alert(error.message || 'Failed to process payments. Please try again.');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowSalaryModal(true)}
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
            style={buttonStyle}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Pay Salary</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg text-white bg-primary-DEFAULT hover:bg-primary-dark flex items-center space-x-2 transition-colors shadow-sm hover:shadow-md"
            style={buttonStyle}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
      
      <div 
        className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 mb-6`}
        style={cardStyle}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search employees..." 
              className={`pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all w-full sm:w-64`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center space-x-2">
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Roles</option>
              <option>Manager</option>
              <option>Cashier</option>
              <option>Sales</option>
            </select>
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left text-xs uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <th className="pb-3 font-medium">Employee</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Joined Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {employeesData.map((employee, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                        employee.name.charAt(0).toLowerCase() <= 'h' 
                          ? 'bg-primary-light' 
                          : employee.name.charAt(0).toLowerCase() <= 'p' 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                      } shadow-sm`}>
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{employee.role}</td>
                  <td className="py-3">{employee.phone}</td>
                  <td className="py-3 text-muted-foreground">{employee.joinedDate}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                      employee.status === 'Active' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors hover:shadow-sm p-1 rounded-full">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors hover:shadow-sm p-1 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 6 of 6 employees
          </div>
          <div className="flex items-center space-x-1">
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Previous
            </button>
            <button className="px-3 py-1 rounded-md text-sm bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md">
              1
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)}></div>
          <div 
            className={`relative w-full max-w-md p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 z-10 animate-fadeIn`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    className={`w-full px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                  >
                    <option>Manager</option>
                    <option>Cashier</option>
                    <option>Sales</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm text-white bg-primary-DEFAULT hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Payment Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSalaryModal(false)}></div>
          <div 
            className={`relative w-full max-w-2xl p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 z-10 animate-fadeIn`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 className="text-xl font-bold mb-4">Pay Employee Salaries</h2>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => setPaymentMode('split')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    paymentMode === 'split'
                      ? 'bg-primary-DEFAULT text-white'
                      : darkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Split className="w-4 h-4" />
                  <span>Split Payment</span>
                </button>
                <button
                  onClick={() => setPaymentMode('individual')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    paymentMode === 'individual'
                      ? 'bg-primary-DEFAULT text-white'
                      : darkMode
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>Individual Payment</span>
                </button>
              </div>

              {paymentMode === 'split' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Total Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                        style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                        placeholder="Enter total amount"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSplitPayment}
                    className="w-full px-4 py-2 rounded-lg text-white bg-primary-DEFAULT hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                  >
                    Calculate Split
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {employeesData.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.role}</div>
                      </div>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="number"
                          value={employeePayments[employee.id] || ''}
                          onChange={(e) => handleIndividualPayment(employee.id, e.target.value)}
                          className={`w-32 pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all`}
                          style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
                          placeholder="Amount"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-xl font-bold">
                    ₹{Object.values(employeePayments).reduce((sum, amount) => sum + (Number(amount) || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowSalaryModal(false)}
                    className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmitPayments}
                    className="px-4 py-2 rounded-lg text-sm text-white bg-primary-DEFAULT hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
                  >
                    Process Payments
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView; 