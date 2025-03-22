import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown, Store, Menu, X } from 'lucide-react';

const MerchantNavbar = ({ darkMode, merchant, onLogout }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const merchantData = merchant || JSON.parse(localStorage.getItem('merchant') || '{}');

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('merchantToken');
      localStorage.removeItem('merchant');
      navigate('/merchant/login');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${darkMode ? 'bg-slate-900/90' : 'bg-white/90'} backdrop-blur-md shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/merchant" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mr-2"
              >
                <Store className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
              </motion.div>
              <motion.span 
                className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'} ml-1`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                RupeeFi Business
              </motion.span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`flex items-center rounded-full px-3 py-1.5 ${darkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}
            >
              <Store className={`w-4 h-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {merchantData.businessName || 'Your Business'}
              </span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutConfirm(true)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                darkMode 
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              } transition-colors duration-300`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
            >
              {showMobileMenu ? 
                <X className="w-6 h-6" /> : 
                <Menu className="w-6 h-6" />
              }
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-inner border-t border-gray-200 dark:border-gray-700`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className={`p-3 rounded-md ${darkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                <p className="font-medium text-sm text-gray-500 dark:text-gray-400">Business name</p>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {merchantData.businessName || 'Your Business'}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogoutConfirm(true)}
                className={`w-full px-4 py-2 rounded-md flex items-center ${
                  darkMode 
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'} rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl`}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Are you sure you want to logout from your merchant account?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`px-4 py-2 rounded ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default MerchantNavbar; 