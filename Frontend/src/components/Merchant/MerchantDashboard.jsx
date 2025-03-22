import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MerchantHeader from './MerchantHeader';
import DashboardView from './DashboardView';
import TransactionsView from './TransactionsView';
import EmployeesView from './EmployeesView';
import ProfileView from './ProfileView';
import MerchantNavbar from './MerchantNavbar';

const MerchantDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}');
  const token = localStorage.getItem('merchantToken');

  useEffect(() => {
    if (!token) {
      navigate('/merchant/login');
    }
  }, [token, navigate]);

  if (!token) return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get background and text colors based on dark mode
  const bgColor = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const secondaryBgColor = darkMode ? '#334155' : '#f1f5f9';
  const cardBgColor = darkMode ? '#334155' : '#ffffff';
  // Replace border with shadow properties
  const shadowColor = darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)';
  const cardShadow = darkMode 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2)' 
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <MerchantNavbar />
      {/* Top Navigation */}
      <MerchantHeader 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        bgColor={bgColor}
        shadowColor={shadowColor}
      />

      {/* Main Content */}
      <div className="container mx-auto pt-20 px-4 pb-8">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            darkMode={darkMode} 
            cardShadow={cardShadow} 
            textColor={textColor} 
            cardBgColor={cardBgColor} 
          />
        )}

        {/* Transactions View */}
        {activeTab === 'transactions' && (
          <TransactionsView 
            darkMode={darkMode} 
            cardShadow={cardShadow}
          />
        )}

        {/* Employees View */}
        {activeTab === 'employees' && (
          <EmployeesView 
            darkMode={darkMode} 
            cardShadow={cardShadow}
          />
        )}

        {/* Profile View */}
        {activeTab === 'profile' && (
          <ProfileView 
            darkMode={darkMode} 
            cardShadow={cardShadow}
          />
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;