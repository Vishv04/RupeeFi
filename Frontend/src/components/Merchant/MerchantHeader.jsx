import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Search, ChevronDown, LayoutDashboard, FileText, Users, UserCircle } from 'lucide-react';

const MerchantHeader = ({ 
  darkMode, 
  toggleDarkMode, 
  activeTab, 
  setActiveTab,
  bgColor,
  shadowColor,
  accentColor
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: FileText },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserCircle }
  ];

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 * i,
        duration: 0.3
      }
    })
  };

  return (
    <motion.header 
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-10 backdrop-blur-md shadow-md`}
      style={{ 
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        boxShadow: `0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor}`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-1">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  custom={i}
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 1 }}
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? `border-b-2 ${darkMode ? 'text-blue-400' : 'text-indigo-600'}`
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                  style={{
                    borderColor: isActive ? accentColor : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-300 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white bg-slate-700 hover:bg-slate-600' 
                  : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default MerchantHeader; 