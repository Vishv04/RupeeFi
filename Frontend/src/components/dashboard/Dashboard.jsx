import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import KYCForm from '../kyc/KYCForm';

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
    isMerchant: false,
    kycCompleted: false
  });
  const [showKYCForm, setShowKYCForm] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setUserData({
        ...user,
        isMerchant: user.isMerchant || false,
        kycCompleted: user.kycCompleted || false
      });
      fetchWalletBalances(user._id);
      checkKYCStatus(user._id);
    }
  }, []);

  const checkKYCStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking KYC status for user ID:', userId);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/kyc/status/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUserData(prev => ({ ...prev, kycCompleted: response.data.kycCompleted }));
    } catch (error) {
      console.error('Error checking KYC status:', error);
      console.error('Error details:', error.response?.data || error.message);
      console.log('Server responded with status:', error.response?.status);
    }
  };

  const fetchWalletBalances = async (userId) => {
    try {
      if (!userId) {
        console.error('No user ID provided');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallet/balances/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data) {
        setWalletData({
          upiWallet: response.data.upiWallet || { balance: 0 },
          eRupeeWallet: response.data.eRupeeWallet || { balance: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching wallet balances:', error.response?.data || error.message);
      // Handle specific error cases
      if (error.response?.status === 401) {
        navigate('/login');
      }
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

  const handleKYCComplete = () => {
    setShowKYCForm(false);
    setUserData(prev => ({ ...prev, kycCompleted: true }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <div className="px-4 py-6 sm:px-0">
          {/* KYC Banner */}
          {!userData.kycCompleted && !showKYCForm && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your KYC is not completed. Please complete your KYC to access full features.
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => setShowKYCForm(true)}
                      className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
                    >
                      Complete KYC now →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KYC Form */}
          {showKYCForm && (
            <div className="mb-6">
              <KYCForm onKYCComplete={handleKYCComplete} />
              <div className="mt-4 text-right">
                <button 
                  onClick={() => setShowKYCForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Close Form
                </button>
              </div>
            </div>
          )}

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