import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MerchantNavbar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchant');
    navigate('/merchant/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/merchant" className="text-xl font-bold text-indigo-600">
              RupeeFi Business
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {merchant.businessName}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout from your merchant account?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MerchantNavbar; 