import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Profile = ({ setIsAuthenticated }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    picture: '',
    qrCode: '',
    erupeeId: '',
    referralCount: 0,
    referralCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
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
        const user = JSON.parse(localStorage.getItem('user'));
        setProfileData({
          ...response.data.data,
          name: user.name,
          email: user.email,
          picture: user.picture
        });
      }
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
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
                <label className="text-sm font-medium text-gray-600 mb-1">e-Rupee ID</label>
                <input
                  type="text"
                  value={profileData.erupeeId || 'Not set'}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({...profileData, erupeeId: e.target.value})}
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Referral Count</p>
                <p className="text-2xl font-bold text-indigo-600">{profileData.referralCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 