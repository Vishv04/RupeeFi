import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStore } from 'react-icons/fa';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [walletData, setWalletData] = useState({
    upiWallet: { balance: 0 },
    eRupeeWallet: { balance: 0 }
  });
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    visitCount: 0,
    lastVisit: null,
    isMerchant: false
  });

  useEffect(() => {
    // Fetch user data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setUserData({
        ...user,
        isMerchant: user.isMerchant || false
      });
      setUserData(user);
      fetchWalletBalances(user._id);
    }
  }, []);

  const fetchWalletBalances = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallet/balances/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchant');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {userData.name}!</h2>
            <div className="space-y-3">
              <p><span className="font-medium">Email:</span> {userData.email}</p>
            </div>
          </div>

          {/* Wallets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* UPI Wallet Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">UPI Wallet</h3>
                <Link 
                  to={`/wallet/upi/${userData._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  More Details →
                </Link>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ₹{walletData.upiWallet.balance.toFixed(2)}
              </div>
            </div>

            {/* eRupee Wallet Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">eRupee Wallet</h3>
                <Link 
                  to={`/wallet/erupee/${userData._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  More Details →
                </Link>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ₹{walletData.eRupeeWallet.balance.toFixed(2)}
              </div>
              
              {/* Merchant Notice - Only show if user is a merchant */}
              {userData.isMerchant && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">You are a registered merchant</h3>
                      <p className="text-indigo-600">You can access your merchant dashboard to view transactions, manage payment methods, and access merchant-specific features.</p>
                    </div>
                    <Link 
                      to="/merchant" 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FaStore className="mr-2" /> Merchant Dashboard
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Merchant Registration - Only show if user is NOT a merchant */}
              {!userData.isMerchant && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-2">Become a Merchant</h3>
                      <p className="text-green-600">Register as a merchant to accept payments, track transactions, and access merchant-specific features.</p>
                    </div>
                    <Link 
                      to="/profile?tab=merchant-registration" 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaStore className="mr-2" /> Register as Merchant
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* eRupee Wallet Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">eRupee Wallet</h3>
                <Link 
                  to={`/wallet/erupee/${userData._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  More Details →
                </Link>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ₹{walletData.eRupeeWallet.balance.toFixed(2)}
              </div>
              
              {/* Merchant Notice - Only show if user is a merchant */}
              {userData.isMerchant && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700 mb-2">You are a registered merchant</h3>
                      <p className="text-indigo-600">You can access your merchant dashboard to view transactions, manage payment methods, and access merchant-specific features.</p>
                    </div>
                    <Link 
                      to="/merchant" 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FaStore className="mr-2" /> Merchant Dashboard
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Merchant Registration - Only show if user is NOT a merchant */}
              {!userData.isMerchant && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 mb-2">Become a Merchant</h3>
                      <p className="text-green-600">Register as a merchant to accept payments, track transactions, and access merchant-specific features.</p>
                    </div>
                    <Link 
                      to="/profile?tab=merchant-registration" 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaStore className="mr-2" /> Register as Merchant
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 