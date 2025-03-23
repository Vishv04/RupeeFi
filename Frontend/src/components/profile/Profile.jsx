import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCopy, FaStore } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    picture: '',
    qrCode: '',
    erupeeId: '',
    referralCount: 0,
    referralCode: '',
    isMerchant: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [merchantRegistrationData, setMerchantRegistrationData] = useState({
    businessName: '',
    businessCategory: 'Retail',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    gstin: ''
  });

  const businessCategories = [
    'Retail',
    'Food',
    'Services',
    'Entertainment',
    'Education',
    'Healthcare',
    'Other'
  ];

  useEffect(() => {
    fetchProfileData();
    checkMerchantStatus();
    
    // Check for merchant registration parameters in URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'merchant-registration') {
      setActiveTab('merchant-registration');
    }
  }, [location]);

  // Check if user is a merchant by examining different indicators
  const checkMerchantStatus = () => {
    try {
      // Check multiple indicators of merchant status
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const merchantToken = localStorage.getItem('merchantToken');
      const merchantData = JSON.parse(localStorage.getItem('merchant') || '{}');
      
      // If any of these indicators is true, the user is a merchant
      const isMerchant = 
        (user && user.isMerchant === true) || 
        (merchantToken && merchantToken.length > 10) || 
        (merchantData && merchantData._id);
      
      if (isMerchant) {
        console.log("User is a merchant based on available data");
        
        // Update user object if needed
        if (user && !user.isMerchant) {
          user.isMerchant = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        setProfileData(prev => ({
          ...prev,
          isMerchant: true
        }));
        
        // If we have a merchant token but missing merchant data, try to fetch it
        if (merchantToken && (!merchantData || !merchantData._id)) {
          fetchMerchantData();
        }
      }
    } catch (err) {
      console.error("Error checking merchant status:", err);
    }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user || !user._id) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { userId: user._id }
        }
      );

      if (response.data.success) {
        // Generate eRupeeId from email
        const email = user.email || '';
        const erupeeId = email.split('@')[0] + '@erupee';
        
        // Check multiple sources for merchant status
        const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
        const merchantToken = localStorage.getItem('merchantToken');
        const merchantData = localStorage.getItem('merchant');
        
        const isMerchant = 
          (userFromStorage && userFromStorage.isMerchant) || 
          (merchantToken && merchantToken.length > 10) || 
          (merchantData && merchantData !== '{}');
        
        console.log("Merchant status check:", { 
          userIsMerchant: userFromStorage.isMerchant, 
          hasMerchantToken: !!merchantToken,
          hasMerchantData: !!merchantData,
          finalStatus: isMerchant
        });
        
        // Make sure we have all necessary data from response or generate it
        setProfileData({
          ...response.data.profile,
          name: user.name || response.data.profile?.name || '',
          email: user.email || response.data.profile?.email || '',
          picture: user.picture || response.data.profile?.picture || '',
          erupeeId: erupeeId,
          referralCode: response.data.profile?.referralCode || 'WELCOME',
          referralCount: response.data.profile?.referralCount || 0,
          isMerchant: isMerchant
        });
        
        if (isMerchant) {
          fetchMerchantData();
        }
      }
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMerchantData = async () => {
    try {
      const merchantToken = localStorage.getItem('merchantToken');
      
      if (!merchantToken) {
        console.log('No merchant token found');
        return;
      }
      
      console.log("Fetching merchant data with token");
      
      // Try to get merchant profile
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/merchant/profile`,
        {
          headers: {
            Authorization: `Bearer ${merchantToken}`
          }
        }
      );
      
      if (response.data.success) {
        console.log("Successfully fetched merchant data:", response.data);
        
        // Update merchant data in localStorage
        localStorage.setItem('merchant', JSON.stringify(response.data.merchant));
        
        // Ensure the user is marked as a merchant
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && !user.isMerchant) {
          user.isMerchant = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Update profile data to reflect merchant status
        setProfileData(prev => ({
          ...prev,
          isMerchant: true
        }));
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      
      // If we get a 401 (Unauthorized) error, the token might be invalid
      if (error.response && error.response.status === 401) {
        console.log("Merchant token is invalid, removing from storage");
        localStorage.removeItem('merchantToken');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setProfileData(response.data.data);
        setIsEditing(false);
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedMessage('Copied to clipboard');
        setTimeout(() => setCopiedMessage(''), 2000);
      })
      .catch((err) => {
        setError('Failed to copy to clipboard');
        console.error('Copy to clipboard error:', err);
      });
  };
  
  // Function to handle merchant registration tab
  const handleMerchantRegistration = () => {
    // setActiveTab('merchant-registration');
    navigate('/merchant/register');
  };
  
  // Function to handle merchant registration form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties like address.street
      const [parent, child] = name.split('.');
      setMerchantRegistrationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setMerchantRegistrationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Function to submit merchant registration
  const handleMerchantFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Prepare registration data
      const registrationData = {
        businessName: merchantRegistrationData.businessName,
        email: profileData.email,
        // Generate a random password for merchant account (backend requirement)
        password: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`,
        phone: merchantRegistrationData.phone,
        address: merchantRegistrationData.address,
        gstin: merchantRegistrationData.gstin || 'NOTPROVIDED123456', // Provide default if empty
        businessCategory: merchantRegistrationData.businessCategory,
        userId: user._id // Link to the user account
      };
      
      console.log('Sending merchant registration data:', registrationData);
      
      // Submit registration to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/merchant/register`,
        registrationData
      );
      
      if (response.data.success) {
        // Update local state
        setProfileData(prev => ({
          ...prev,
          isMerchant: true
        }));
        
        // Update user in localStorage
        const updatedUser = { ...user, isMerchant: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Store merchant token and data
        localStorage.setItem('merchantToken', response.data.token);
        localStorage.setItem('merchant', JSON.stringify(response.data.merchant));
        
        // Return to profile view
        setActiveTab('profile');
        
        // Show success notification
        alert('Successfully registered as a merchant! You can now access the merchant dashboard.');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Merchant registration error:', err);
      
      if (err.response) {
        setError(err.response.data.message || `Registration failed with status: ${err.response.status}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          {activeTab === 'merchant-registration' && (
            <button
              onClick={() => setActiveTab('merchant-registration')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'merchant-registration'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Merchant Registration
            </button>
          )}
        </div>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-md mr-4">
                  <img 
                    src={profileData.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}`}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
              </div>
              <div className="flex space-x-3">
                {profileData.isMerchant && (
                  <button
                    onClick={() => navigate('/merchant/dashboard')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FaStore className="mr-2" /> Merchant Dashboard
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="p-2 border rounded-lg bg-gray-50"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">UPI ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profileData.erupeeId || 'Not set'}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, erupeeId: e.target.value})}
                      className="p-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none shadow-sm w-full pr-24"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profileData.erupeeId)}
                      className="absolute right-2 top-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                    >
                      <FaCopy className="mr-1" /> Copy
                    </button>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
                      <QRCodeSVG 
                        value={`upi://pay?pa=${profileData.erupeeId}&pn=${encodeURIComponent(profileData.name)}`} 
                        size={150} 
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-center text-gray-600 mt-2 text-sm">
                      Scan to pay {profileData.name} via UPI
                    </p>
                    {copiedMessage && (
                      <div className="mt-2 text-green-600 text-sm font-medium">{copiedMessage}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={profileData.referralCode || 'Not set'}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({...profileData, referralCode: e.target.value})}
                    className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Referral Count</p>
                  <p className="text-2xl font-bold text-indigo-600">{profileData.referralCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600">Merchant Status</p>
                  <p className="text-2xl font-bold" style={{ color: profileData.isMerchant ? '#4CAF50' : '#FF9800' }}>
                    {profileData.isMerchant ? 'Registered' : 'Not Registered'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Merchant Registration Section - Only show if not already registered */}
            {!profileData.isMerchant && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Become a Merchant</h2>
                <p className="text-gray-700 mb-4">
                  Register as a merchant to accept payments, track transactions, and access merchant-specific features.
                </p>
                <button
                  onClick={handleMerchantRegistration}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                >
                  <FaStore className="mr-2" /> Register as Merchant
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Merchant Registration Form */}
        {activeTab === 'merchant-registration' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Merchant Registration</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
              <p className="mb-2 font-medium text-blue-700">How Merchant Registration Works:</p>
              <ul className="list-disc pl-5 text-blue-600 space-y-1">
                <li>Registering as a merchant allows you to accept payments using your UPI ID.</li>
                <li>After registration, you can access your merchant dashboard from your profile.</li>
                <li>You'll be able to track transactions, set payment method discounts, and view payment insights.</li>
                <li>For demo purposes, you can leave the GSTIN field blank if you don't have one.</li>
              </ul>
            </div>
            
            <form onSubmit={handleMerchantFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={merchantRegistrationData.businessName}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category
                  </label>
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={merchantRegistrationData.businessCategory}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                  >
                    {businessCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={merchantRegistrationData.phone}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    id="gstin"
                    name="gstin"
                    type="text"
                    value={merchantRegistrationData.gstin}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                    placeholder="Enter GSTIN or leave blank for demo"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  id="streetAddress"
                  name="address.street"
                  value={merchantRegistrationData.address.street}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      name="address.city"
                      value={merchantRegistrationData.address.city}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      name="address.state"
                      value={merchantRegistrationData.address.state}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      id="zipCode"
                      name="address.zipCode"
                      value={merchantRegistrationData.address.zipCode}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-8">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className="mr-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {loading ? 'Registering...' : 'Register as Merchant'}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile; 