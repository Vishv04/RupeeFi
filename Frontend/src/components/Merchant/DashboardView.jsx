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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div 
          className="p-6 rounded-lg"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
        >
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            Total Revenue
          </h3>
          <p className="mt-2 text-3xl font-semibold" style={{ color: textColor }}>
            ₹50,000
          </p>
        </div>
        {/* Add more stat cards */}
      </div>

      {/* Recent Transactions */}
      <div 
        className="p-6 rounded-lg"
        style={{ 
          backgroundColor: cardBgColor,
          boxShadow: cardShadow
        }}
      >
        <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
          Recent Transactions
        </h3>
        {/* Add transaction list */}
      </div>
    </div>
  );
};

export default DashboardView; 