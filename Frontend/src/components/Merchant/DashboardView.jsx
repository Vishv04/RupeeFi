import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
import { ArrowRight, QrCode, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { revenueData as dummyRevenueData, paymentMethodData as dummyPaymentData, transactionsData as dummyTransactionsData } from './merchantData';

const API_URL = 'http://localhost:3000/api';

const DashboardView = ({ darkMode, cardShadow, textColor, cardBgColor }) => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [timeRange, setTimeRange] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API data states
  const [dashboardStats, setDashboardStats] = useState({
    currentBalance: 0,
    todayRevenue: 0,
    todayTransactions: 0,
    revenueData: [],
    paymentMethodData: [],
    transactions: []
  });
  
  // Function to fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats from API
      const response = await axios.get(`${API_URL}/merchant/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setDashboardStats(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
      
      // Use dummy data for demonstration
      setDashboardStats({
        currentBalance: 84250,
        todayRevenue: 18200,
        todayTransactions: 24,
        yesterdayRevenue: 16800,
        yesterdayTransactions: 20,
        revenueData: dummyRevenueData,
        paymentMethodData: dummyPaymentData,
        transactions: dummyTransactionsData
      });
    }
  };
  
  // Generate QR code function
  const generateQRCode = async () => {
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Call API to generate QR code
      const response = await axios.post(`${API_URL}/merchant/generate-qr`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.qrCode) {
        // Handle QR code display
        setShowQrCode(true);
        // Store QR code data if needed
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code. Please try again later.');
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

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
  
  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  const todayRevenueChange = calculatePercentageChange(
    dashboardStats.todayRevenue, 
    dashboardStats.yesterdayRevenue
  );
  
  const todayTransactionsChange = calculatePercentageChange(
    dashboardStats.todayTransactions, 
    dashboardStats.yesterdayTransactions
  );

  if (loading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-DEFAULT" />
        <span className="ml-2">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">Merchant Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground text-sm font-medium">Current Balance</h3>
            <div className="text-primary-DEFAULT w-5 h-5">💰</div>
          </div>
          <p className="text-2xl font-bold">₹{dashboardStats.currentBalance.toLocaleString()}</p>
          <p className="text-sm text-green-500 flex items-center mt-2">
            <span>Available for withdrawal</span>
          </p>
        </div>
        
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground text-sm font-medium">Today's Revenue</h3>
            <div className="text-primary-DEFAULT w-5 h-5">💳</div>
          </div>
          <p className="text-2xl font-bold">₹{dashboardStats.todayRevenue.toLocaleString()}</p>
          <p className={`text-sm ${todayRevenueChange >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-2`}>
            <span>{todayRevenueChange >= 0 ? '+' : ''}{todayRevenueChange.toFixed(1)}% from yesterday</span>
          </p>
        </div>
        
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground text-sm font-medium">Transactions Today</h3>
            <div className="text-primary-DEFAULT w-5 h-5">➡️</div>
          </div>
          <p className="text-2xl font-bold">{dashboardStats.todayTransactions}</p>
          <p className={`text-sm ${todayTransactionsChange >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-2`}>
            <span>{todayTransactionsChange >= 0 ? '+' : ''}{todayTransactionsChange.toFixed(1)}% from yesterday</span>
          </p>
        </div>
        
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-muted-foreground text-sm font-medium">Erupee Discount</h3>
            <div className="bg-primary-light/20 text-primary-DEFAULT px-2 py-1 rounded text-sm font-medium shadow-sm">Active</div>
          </div>
          <p className="text-2xl font-bold">
            {dashboardStats.paymentMethods?.find(method => method.name === 'Erupee')?.discount || 5}%
          </p>
          <button 
            className="text-sm text-primary-DEFAULT hover:text-primary-light transition-colors mt-2"
          >
            Update discount
          </button>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div 
          className={`lg:col-span-2 p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue Trend</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${timeRange === 'daily' ? 'bg-primary-DEFAULT text-white' : `${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`} transition-colors`}
                style={buttonStyle}
                onClick={() => setTimeRange('daily')}
              >
                Daily
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${timeRange === 'weekly' ? 'bg-primary-DEFAULT text-white' : `${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`} transition-colors`}
                style={buttonStyle}
                onClick={() => setTimeRange('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${timeRange === 'monthly' ? 'bg-primary-DEFAULT text-white' : `${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`} transition-colors`}
                style={buttonStyle}
                onClick={() => setTimeRange('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardStats.revenueData || dummyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: cardBgColor,
                    boxShadow: cardShadow,
                    color: textColor,
                    border: 'none'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#1e2cc8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <h3 className="font-semibold mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats.paymentMethodData || dummyPaymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: cardBgColor,
                    boxShadow: cardShadow,
                    color: textColor,
                    border: 'none'
                  }} 
                />
                <Bar dataKey="value" fill="#4552e3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* QR Code Generator and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div 
          className={`p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Accept Erupee Payment</h3>
            <div className="text-sm text-primary-DEFAULT bg-primary-light/20 px-2 py-1 rounded shadow-sm">
              {dashboardStats.paymentMethods?.find(method => method.name === 'Erupee')?.discount || 5}% Discount Active
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Generate a QR code to accept Erupee payments from your customers with automatic discount.
          </p>
          {showQrCode ? (
            <div className="flex flex-col items-center">
              <div 
                className={`w-48 h-48 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-lg flex items-center justify-center mb-4 shadow-lg`}
              >
                <QrCode className="w-32 h-32 text-primary-DEFAULT" />
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-4 py-2 bg-primary-DEFAULT text-white rounded-lg text-sm hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  Download
                </button>
                <button 
                  className={`px-4 py-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-lg text-sm hover:bg-opacity-80 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                  style={{ transition: 'all 0.2s ease' }}
                  onClick={() => setShowQrCode(false)}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="w-full px-4 py-3 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{ transition: 'all 0.2s ease' }}
              onClick={generateQRCode}
            >
              <QrCode className="w-5 h-5" />
              <span>Generate QR Code</span>
            </button>
          )}
        </div>
        
        {/* Recent Transactions */}
        <div 
          className={`lg:col-span-2 p-6 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-300`} 
          style={cardStyle}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Transactions</h3>
            <button 
              className="text-sm text-primary-DEFAULT hover:text-primary-light transition-colors flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {(dashboardStats.transactions || dummyTransactionsData).slice(0, 4).map((transaction, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3 text-muted-foreground">{transaction.id}</td>
                    <td className="py-3">{transaction.customer}</td>
                    <td className="py-3 font-medium">₹{transaction.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                        transaction.method === 'Erupee' 
                          ? 'bg-primary-light/20 text-primary-DEFAULT' 
                          : transaction.method === 'UPI' 
                            ? 'bg-green-100 text-green-600'
                            : transaction.method === 'Card'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {transaction.method}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs shadow-sm ${
                        transaction.status === 'Completed' 
                          ? 'bg-green-100 text-green-600' 
                          : transaction.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView; 