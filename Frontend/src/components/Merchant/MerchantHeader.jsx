import React from 'react';
import { Bell, Moon, Sun, Search, ChevronDown } from 'lucide-react';

const MerchantHeader = ({ 
  darkMode, 
  toggleDarkMode, 
  activeTab, 
  setActiveTab,
  bgColor,
  shadowColor
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'employees', label: 'Employees' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <header className={`fixed w-full z-10 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-indigo-500 text-indigo-600'}`
                    : `${darkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MerchantHeader; 