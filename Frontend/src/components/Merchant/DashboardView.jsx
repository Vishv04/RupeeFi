import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar, ResponsiveContainer } from 'recharts';
import { ArrowRight, QrCode, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Users, CreditCard, IndianRupee, Calendar, ArrowUpRight } from 'lucide-react';
import { revenueData, paymentMethodData, transactionsData } from './merchantData';

const DashboardView = ({ darkMode, cardShadow, textColor, cardBgColor }) => {
  // Use dummy data directly without fetching
  const dashboardStats = {
    currentBalance: 84250,
    todayRevenue: 18200,
    todayTransactions: 24,
    yesterdayRevenue: 16800,
    yesterdayTransactions: 20,
    revenueData: revenueData,
    paymentMethodData: paymentMethodData,
    transactions: transactionsData
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const accentColor = darkMode ? '#818cf8' : '#4f46e5';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium opacity-80" style={{ color: textColor }}>
                Total Balance
              </h3>
              <p className="mt-2 text-3xl font-semibold flex items-center" style={{ color: textColor }}>
                <IndianRupee className="w-5 h-5 mr-1 opacity-70" />
                {dashboardStats.currentBalance.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
              <CreditCard color={accentColor} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1 opacity-70" />
            <span className="opacity-70">Updated today</span>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium opacity-80" style={{ color: textColor }}>
                Today's Revenue
              </h3>
              <p className="mt-2 text-3xl font-semibold flex items-center" style={{ color: textColor }}>
                <IndianRupee className="w-5 h-5 mr-1 opacity-70" />
                {dashboardStats.todayRevenue.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
              <TrendingUp color={darkMode ? '#6ee7b7' : '#10b981'} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center ${todayRevenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {todayRevenueChange >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(todayRevenueChange).toFixed(1)}% from yesterday
            </span>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium opacity-80" style={{ color: textColor }}>
                Today's Transactions
              </h3>
              <p className="mt-2 text-3xl font-semibold" style={{ color: textColor }}>
                {dashboardStats.todayTransactions}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <Users color={darkMode ? '#93c5fd' : '#3b82f6'} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center ${todayTransactionsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {todayTransactionsChange >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(todayTransactionsChange).toFixed(1)}% from yesterday
            </span>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium opacity-80" style={{ color: textColor }}>
                Generate QR
              </h3>
              <p className="mt-2 text-lg font-medium" style={{ color: textColor }}>
                Accept Payments
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
              <QrCode color={darkMode ? '#d8b4fe' : '#a855f7'} />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 rounded-lg text-white text-sm flex items-center justify-center w-full transition-all duration-300"
            style={{ backgroundColor: accentColor }}
          >
            Generate QR Code
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
            Revenue Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardStats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#475569" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="p-6 rounded-xl backdrop-blur-sm"
          style={{ 
            backgroundColor: cardBgColor,
            boxShadow: cardShadow
          }}
        >
          <h3 className="text-lg font-medium mb-4" style={{ color: textColor }}>
            Payment Methods
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats.paymentMethodData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#475569" : "#e2e8f0"} />
                <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill={darkMode ? '#818cf8' : '#4f46e5'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div 
        variants={itemVariants}
        className="p-6 rounded-xl backdrop-blur-sm"
        style={{ 
          backgroundColor: cardBgColor,
          boxShadow: cardShadow
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium" style={{ color: textColor }}>
            Recent Transactions
          </h3>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-medium flex items-center"
            style={{ color: accentColor }}
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" style={{ color: textColor }}>
                  Transaction ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" style={{ color: textColor }}>
                  Customer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" style={{ color: textColor }}>
                  Amount
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" style={{ color: textColor }}>
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-70" style={{ color: textColor }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardStats.transactions.slice(0, 5).map((transaction, index) => (
                <motion.tr 
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)' }}
                  className="transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>
                    #{transaction.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>
                    {transaction.customer}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" style={{ color: textColor }}>
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : transaction.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>
                    {transaction.date}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView; 