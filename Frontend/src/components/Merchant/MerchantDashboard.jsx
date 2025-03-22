import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MerchantHeader from './MerchantHeader';
import DashboardView from './DashboardView';
import TransactionsView from './TransactionsView';
import EmployeesView from './EmployeesView';
import ProfileView from './ProfileView';
import MerchantNavbar from './MerchantNavbar';

const MerchantDashboard = ({ onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}');
  const token = localStorage.getItem('merchantToken');

  // Set active tab based on URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const path = pathParts[pathParts.length - 1];
    
    // If we're at just /merchant/dashboard or with a trailing slash
    if (path === 'dashboard' || path === '') {
      setActiveTab('dashboard');
    } else if (['transactions', 'employees', 'profile'].includes(path)) {
      setActiveTab(path);
    }
    
    console.log('Current path:', path, 'Setting active tab to:', 
      path === 'dashboard' || path === '' ? 'dashboard' : path);
  }, [location.pathname]);

  // Check authentication
  useEffect(() => {
    if (!token) {
      console.log('No merchant token found, redirecting to login');
      navigate('/merchant/login');
    } else {
      console.log('Merchant authenticated, token found');
    }
  }, [token, navigate]);

  // Redirect to dashboard tab if we're just at /merchant/dashboard
  useEffect(() => {
    // Only run this if we're authenticated
    if (token && location.pathname === '/merchant/dashboard') {
      console.log('At dashboard root, initializing dashboard view');
      // We're already at dashboard, just make sure the tab is set
      setActiveTab('dashboard');
    }
  }, [location.pathname, token, navigate]);

  if (!token) return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get theme colors based on dark mode
  const bgColor = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const secondaryBgColor = darkMode ? '#334155' : '#f1f5f9';
  const cardBgColor = darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  const shadowColor = darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)';
  const cardShadow = darkMode 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)' 
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
  const accentColor = darkMode ? '#818cf8' : '#4f46e5';

  // Function to navigate between tabs
  const handleTabChange = (tab) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
    if (tab === 'dashboard') {
      navigate('/merchant/dashboard');
    } else {
      navigate(`/merchant/dashboard/${tab}`);
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  console.log('Rendering merchant dashboard with active tab:', activeTab);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-slate-900'} transition-colors duration-300`}
    >
      <MerchantNavbar darkMode={darkMode} merchant={merchant} onLogout={onLogout} />
      
      {/* Top Navigation */}
      <MerchantHeader 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        bgColor={bgColor}
        shadowColor={shadowColor}
        accentColor={accentColor}
      />

      {/* Main Content */}
      <div className="container mx-auto pt-24 px-4 pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DashboardView 
                darkMode={darkMode} 
                cardShadow={cardShadow} 
                textColor={textColor} 
                cardBgColor={cardBgColor} 
                accentColor={accentColor}
              />
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TransactionsView 
                darkMode={darkMode} 
                cardShadow={cardShadow}
                cardBgColor={cardBgColor}
                accentColor={accentColor}
              />
            </motion.div>
          )}

          {activeTab === 'employees' && (
            <motion.div
              key="employees"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EmployeesView 
                darkMode={darkMode} 
                cardShadow={cardShadow}
                cardBgColor={cardBgColor}
                accentColor={accentColor}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProfileView 
                darkMode={darkMode} 
                cardShadow={cardShadow}
                cardBgColor={cardBgColor}
                accentColor={accentColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MerchantDashboard;