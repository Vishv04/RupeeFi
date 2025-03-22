import React from 'react';
import { Filter, Download, Search } from 'lucide-react';
import { transactionsData } from './merchantData';

const TransactionsView = ({ darkMode, cardShadow }) => {
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

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Transactions</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-1 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'} transition-colors shadow-sm hover:shadow-md`} 
            style={buttonStyle}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-1 ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'} transition-colors shadow-sm hover:shadow-md`}
            style={buttonStyle}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      <div 
        className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300 mb-6`}
        style={cardStyle}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className={`pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all w-full md:w-64`}
                style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Methods</option>
              <option>Erupee</option>
              <option>UPI</option>
              <option>Card</option>
            </select>
            <select 
              className={`pl-4 pr-8 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-700' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all appearance-none cursor-pointer`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} shadow-sm`}>
              <span className="text-sm text-muted-foreground">From:</span>
              <input 
                type="date" 
                className={`bg-transparent outline-none focus:ring-0 text-sm border-0 p-0`}
              />
            </div>
            <div className={`flex items-center space-x-2 p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} shadow-sm`}>
              <span className="text-sm text-muted-foreground">To:</span>
              <input 
                type="date" 
                className={`bg-transparent outline-none focus:ring-0 text-sm border-0 p-0`}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left text-xs uppercase ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {transactionsData.map((transaction, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-3 text-muted-foreground">{transaction.id}</td>
                  <td className="py-3">{transaction.customer}</td>
                  <td className="py-3 font-medium">₹{transaction.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                      transaction.method === 'Erupee' 
                        ? 'bg-primary-light/20 text-primary-DEFAULT' 
                        : transaction.method === 'UPI' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {transaction.method}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                        : transaction.status === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{transaction.date}</td>
                  <td className="py-3">
                    <button className="text-primary-DEFAULT hover:text-primary-light transition-colors hover:shadow-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 8 of 245 transactions
          </div>
          <div className="flex items-center space-x-1">
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Previous
            </button>
            <button className="px-3 py-1 rounded-md text-sm bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md">
              1
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              2
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              3
            </button>
            <span className="text-muted-foreground">...</span>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              245
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors shadow-sm hover:shadow-md`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsView; 