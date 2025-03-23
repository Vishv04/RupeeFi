import { useState } from 'react';
import { motion } from 'framer-motion';
import SpinWheel from './SpinWheel';
import ScratchCard from './ScratchCard';
import PaymentStreak from './PaymentStreak';

const RewardsPage = () => {
  const [activeReward, setActiveReward] = useState('spin');

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Win Exciting Rewards!
        </h1>
        <PaymentStreak />
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeReward === 'spin'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveReward('spin')}
        >
          Spin & Win
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            activeReward === 'scratch'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveReward('scratch')}
        >
          Scratch Card
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeReward === 'spin' ? <SpinWheel /> : <ScratchCard />}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {/* Reward Info Cards */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl bg-gradient-to-br from-indigo-900/70 to-purple-900/50 border border-indigo-500/20"
        >
          <h3 className="text-xl font-semibold mb-3 text-indigo-300">Daily Rewards</h3>
          <p className="text-gray-700">
            Make a payment using e-Rupee to earn a free spin! Come back daily for more chances to win.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl bg-gradient-to-br from-orange-900/70 to-red-900/50 border border-orange-500/20"
        >
          <h3 className="text-xl font-semibold mb-3 text-orange-300">Payment Streaks</h3>
          <p className="text-gray-700">
            Keep your payment streak alive! Pay with e-Rupee for 7 consecutive days to earn ₹7 bonus.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsPage;