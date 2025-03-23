import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentStreak = () => {
  const [streakInfo, setStreakInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchStreakInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view streak');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/streak/info`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStreakInfo(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching streak info:', err);
      setError(err.response?.data?.message || 'Failed to load streak info');
    }
  };

  // Fetch streak info on mount and every minute
  useEffect(() => {
    fetchStreakInfo();
    const interval = setInterval(fetchStreakInfo, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-sm">{error}</div>
    );
  }

  if (!streakInfo) {
    return (
      <div className="animate-pulse flex space-x-2 items-center">
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center space-x-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 rounded-xl"
      >
        <div className="relative">
          {/* Fire emoji with glow effect */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-2xl relative z-10"
          >
            🔥
          </motion.div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {streakInfo.currentStreak}
            </span>
            <span className="text-sm text-gray-200">day streak</span>
          </div>

          {streakInfo.daysUntilReward > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400"
            >
              {streakInfo.daysUntilReward} days until ₹7 reward
            </motion.p>
          )}

          {streakInfo.daysUntilReward === 0 && streakInfo.currentStreak >= 7 && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-xs font-medium text-green-400"
            >
              Reward earned! 🎉
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentStreak;
