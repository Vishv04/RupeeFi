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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      setUserData({
        ...user,
        isMerchant: user.isMerchant || false
      });
      fetchWalletBalances(user._id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchWalletBalances = async (userId) => {
    try {
      if (!userId) {
        console.error('No user ID provided');
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      // First try to initialize wallets (this will be no-op if already initialized)
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wallet/initialize`,
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (initError) {
        console.log('Wallet may already be initialized:', initError);
        // Continue even if initialization fails as wallets might already exist
      }

      // Now try to fetch the balances
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wallet/balances/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data) {
          setWalletData({
            upiWallet: response.data.upiWallet || { balance: 0 },
            eRupeeWallet: response.data.eRupeeWallet || { balance: 0 }
          });
          setIsLoading(false);
        }
      } catch (balanceError) {
        console.error('Error fetching combined balances:', balanceError.response?.data || balanceError.message);
        
        // Try fetching individual wallets as fallback
        try {
          // Store token in local scope for the fallback
          const upiResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/wallet/upi/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          const eRupeeResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/wallet/erupee/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Update wallet data with individual responses
          setWalletData({
            upiWallet: { balance: upiResponse.data?.balance || 0 },
            eRupeeWallet: { balance: eRupeeResponse.data?.balance || 0 }
          });
        } catch (fallbackError) {
          console.error('Fallback wallet fetch failed:', fallbackError);
          // Default to zero balances if everything fails
          setWalletData({
            upiWallet: { balance: 0 },
            eRupeeWallet: { balance: 0 }
          });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error in wallet fetching:', error);
      setWalletData({
        upiWallet: { balance: 0 },
        eRupeeWallet: { balance: 0 }
      });
      setIsLoading(false);
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-0">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Welcome, {userData.name}!</h2>
              <div className="space-y-3">
                <p className="text-gray-600">Email: {userData.email}</p>
                <p className="text-gray-600">Visit Count: {userData.visitCount}</p>
                {userData.lastVisit && (
                  <p className="text-gray-600">
                    Last Visit: {new Date(userData.lastVisit).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Wallet Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">UPI Wallet Balance</h3>
                <p className="text-3xl font-bold">₹{walletData.upiWallet.balance.toFixed(2)}</p>
                <Link
                  to="/wallet/upi"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  Manage UPI Wallet →
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">e-Rupee Balance</h3>
                <p className="text-3xl font-bold">₹{walletData.eRupeeWallet.balance.toFixed(2)}</p>
                <Link
                  to="/wallet/erupee"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                >
                  Manage e-Rupee Wallet →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/transfer"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">Send Money</h3>
                <p className="text-gray-600">Transfer e-Rupee to other users</p>
              </Link>

              <Link
                to="/rewards"
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">Rewards</h3>
                <p className="text-gray-600">View and claim your rewards</p>
              </Link>

              {userData.isMerchant ? (
                <Link
                  to="/merchant/dashboard"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaStore className="mr-2" />
                    Merchant Dashboard
                  </h3>
                  <p className="text-gray-600">Manage your merchant account</p>
                </Link>
              ) : (
                <Link
                  to="/merchant/register"
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <FaStore className="mr-2" />
                    Become a Merchant
                  </h3>
                  <p className="text-gray-600">Start accepting e-Rupee payments</p>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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