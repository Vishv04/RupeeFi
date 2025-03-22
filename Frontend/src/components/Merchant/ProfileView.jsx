import React, { useState, useEffect } from 'react';
import { Edit2, Camera, CheckSquare, LogOut, User, Phone, Mail, MapPin, CreditCard, QrCode, Edit, Save, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const ProfileView = ({ darkMode, cardShadow }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  
  // Profile state
  const [profile, setProfile] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    upiId: '',
    businessCategory: '',
    paymentMethods: []
  });
  
  // Edit state
  const [editedProfile, setEditedProfile] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    upiId: ''
  });
  
  // Discount edit states
  const [paymentMethodDiscounts, setPaymentMethodDiscounts] = useState({
    Erupee: 5,
    Card: 0,
    UPI: 0,
    PhonePe: 0,
    GPay: 0
  });
  
  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Fetch merchant profile from API
      const response = await axios.get(`${API_URL}/merchant/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.merchant) {
        setProfile(response.data.merchant);
        setEditedProfile({
          businessName: response.data.merchant.businessName,
          email: response.data.merchant.email,
          phone: response.data.merchant.phone,
          address: { ...response.data.merchant.address },
          upiId: response.data.merchant.upiId
        });
        
        // Set payment method discounts
        const discounts = {};
        response.data.merchant.paymentMethods.forEach(method => {
          discounts[method.name] = method.discount;
        });
        setPaymentMethodDiscounts(discounts);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again later.');
      setLoading(false);
      
      // Use dummy data for demonstration
      const dummyProfile = {
        businessName: 'Sharma General Store',
        email: 'sharma.store@example.com',
        phone: '+91 98765 43210',
        address: {
          street: '123 Merchants Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        upiId: 'sharma.store@ybl',
        businessCategory: 'Retail',
        paymentMethods: [
          { name: 'Erupee', discount: 5 },
          { name: 'Card', discount: 0 },
          { name: 'UPI', discount: 0 },
          { name: 'PhonePe', discount: 0 },
          { name: 'GPay', discount: 0 }
        ]
      };
      
      setProfile(dummyProfile);
      setEditedProfile({
        businessName: dummyProfile.businessName,
        email: dummyProfile.email,
        phone: dummyProfile.phone,
        address: { ...dummyProfile.address },
        upiId: dummyProfile.upiId
      });
      
      // Set payment method discounts
      const discounts = {};
      dummyProfile.paymentMethods.forEach(method => {
        discounts[method.name] = method.discount;
      });
      setPaymentMethodDiscounts(discounts);
    }
  };
  
  // Generate QR code
  const generateQRCode = async () => {
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Call API to generate QR code
      const response = await axios.post(`${API_URL}/merchant/generate-qr`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.qrCode) {
        setQrCode(response.data.qrCode);
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code. Please try again later.');
    }
  };
  
  // Update profile
  const updateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Update merchant profile
      const response = await axios.put(
        `${API_URL}/merchant/profile`, 
        editedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.merchant) {
        setProfile(response.data.merchant);
        setEditMode(false);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
      setLoading(false);
    }
  };
  
  // Update payment method discount
  const updateDiscount = async (paymentMethod, discount) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      // Update payment method discount
      const response = await axios.put(
        `${API_URL}/merchant/payment-methods`, 
        { paymentMethod, discount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.paymentMethods) {
        // Update profile payment methods
        setProfile({
          ...profile,
          paymentMethods: response.data.paymentMethods
        });
        
        // Update discount states
        const discounts = { ...paymentMethodDiscounts };
        response.data.paymentMethods.forEach(method => {
          discounts[method.name] = method.discount;
        });
        setPaymentMethodDiscounts(discounts);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating discount:', err);
      setError('Failed to update discount. Please try again later.');
      setLoading(false);
    }
  };
  
  // Handle discount change
  const handleDiscountChange = (method, value) => {
    const numericValue = Math.min(Math.max(0, parseInt(value) || 0), 100);
    setPaymentMethodDiscounts({
      ...paymentMethodDiscounts,
      [method]: numericValue
    });
  };
  
  // Handle save discount
  const handleSaveDiscount = (method) => {
    updateDiscount(method, paymentMethodDiscounts[method]);
  };
  
  // Handle profile input change
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent],
          [child]: value
        }
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };
  
  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);
  
  if (loading && !profile.businessName) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-DEFAULT" />
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  // Card styles
  const cardStyleBase = `rounded-lg overflow-hidden transition-all duration-300 ${darkMode ? 'bg-slate-800' : 'bg-white'}`;
  const inputClass = `py-2 px-3 rounded-lg w-full ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-slate-600' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all`;
  
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6">Merchant Profile</h1>
      
      {error && (
        <div className="rounded-lg bg-red-100 p-4 mb-6 text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Business Info */}
        <div className={cardStyleBase} style={{ boxShadow: cardShadow }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Business Information</h2>
              <button 
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <Save className="w-5 h-5 text-primary-DEFAULT" />
                ) : (
                  <Edit className="w-5 h-5 text-primary-DEFAULT" />
                )}
              </button>
            </div>
            
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Business Name</label>
                  <input 
                    type="text" 
                    className={inputClass}
                    value={editedProfile.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    className={inputClass}
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className={inputClass}
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">UPI ID</label>
                  <input 
                    type="text" 
                    className={inputClass}
                    value={editedProfile.upiId}
                    onChange={(e) => handleInputChange('upiId', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input 
                    type="text" 
                    className={inputClass}
                    value={editedProfile.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input 
                      type="text" 
                      className={inputClass}
                      value={editedProfile.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input 
                      type="text" 
                      className={inputClass}
                      value={editedProfile.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code</label>
                    <input 
                      type="text" 
                      className={inputClass}
                      value={editedProfile.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input 
                      type="text" 
                      className={inputClass}
                      value={editedProfile.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pt-3">
                  <button 
                    className="w-full py-2 px-4 rounded-lg bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors"
                    onClick={updateProfile}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-3 mt-0.5 text-primary-DEFAULT" />
                  <div>
                    <p className="text-xs text-muted-foreground">Business Name</p>
                    <p className="font-medium">{profile.businessName}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 mt-0.5 text-primary-DEFAULT" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 mt-0.5 text-primary-DEFAULT" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 mr-3 mt-0.5 text-primary-DEFAULT" />
                  <div>
                    <p className="text-xs text-muted-foreground">UPI ID</p>
                    <p className="font-medium">{profile.upiId || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary-DEFAULT" />
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {profile.address.street}, {profile.address.city}<br />
                      {profile.address.state} {profile.address.zipCode}<br />
                      {profile.address.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Methods & Discounts */}
        <div className={cardStyleBase} style={{ boxShadow: cardShadow }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Methods & Discounts</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Set discount percentages for different payment methods</p>
              
              {['Erupee', 'Card', 'UPI', 'PhonePe', 'GPay'].map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{method}</p>
                    <p className="text-xs text-muted-foreground">
                      {method === 'Erupee' ? 'Recommended to offer discount' : 'Optional discount'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className={`w-16 py-1 px-2 rounded ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-slate-600' : 'border-gray-300'}`}
                      value={paymentMethodDiscounts[method]}
                      onChange={(e) => handleDiscountChange(method, e.target.value)}
                    />
                    <span>%</span>
                    <button
                      className="p-1 rounded-full bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors"
                      onClick={() => handleSaveDiscount(method)}
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium mb-2">Benefits of Offering Erupee Discount</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Increased customer loyalty</li>
                  <li>Higher transaction volume</li>
                  <li>Faster settlements</li>
                  <li>Reduced processing fees</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className={cardStyleBase} style={{ boxShadow: cardShadow }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment QR Code</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a QR code for your storefront to make it easy for customers to pay using Erupee.
            </p>
            
            {qrCode ? (
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-white rounded-lg p-2 mb-4 shadow-md">
                  <img src={qrCode} alt="Payment QR Code" className="w-full h-full" />
                </div>
                <div className="flex space-x-3">
                  <button
                    className="py-2 px-4 rounded-lg bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors"
                    onClick={() => window.open(qrCode)}
                  >
                    Download
                  </button>
                  <button
                    className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-800'} hover:opacity-80 transition-colors`}
                    onClick={() => setQrCode('')}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div 
                  className={`w-48 h-48 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg flex items-center justify-center mb-4`}
                >
                  <QrCode className="w-24 h-24 text-muted-foreground opacity-40" />
                </div>
                <button
                  className="w-full py-2 px-4 rounded-lg bg-primary-DEFAULT text-white hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                  onClick={generateQRCode}
                >
                  <QrCode className="w-5 h-5" />
                  <span>Generate QR Code</span>
                </button>
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium mb-2">QR Code Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Print and place at your counter</li>
                <li>Include in receipts and invoices</li>
                <li>Share on your business social media</li>
                <li>Add to your website for online payments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 
