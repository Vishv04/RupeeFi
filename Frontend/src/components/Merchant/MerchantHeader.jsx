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
  return (
    <div 
      className={`fixed top-0 w-full z-10 transition-all duration-300`} 
      style={{ 
        backgroundColor: bgColor,
        boxShadow: `0 1px 3px ${shadowColor}, 0 1px 2px ${shadowColor}`
      }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <span className="text-primary-DEFAULT text-2xl font-bold">E-Merchant</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button 
              className={`px-2 py-1 border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent hover:text-primary-light'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-2 py-1 border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent hover:text-primary-light'}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button 
              className={`px-2 py-1 border-b-2 transition-colors ${activeTab === 'employees' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent hover:text-primary-light'}`}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
            <button 
              className={`px-2 py-1 border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary-DEFAULT text-primary-DEFAULT' : 'border-transparent hover:text-primary-light'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className={`pl-9 pr-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-slate-800' : 'bg-white'} outline-none focus:ring-2 focus:ring-primary-light transition-all w-48`}
              style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)' }}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          </div>
          <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded-full transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-DEFAULT text-white flex items-center justify-center text-sm font-semibold shadow-md">
              MR
            </div>
            <ChevronDown className="w-4 h-4 hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantHeader; 