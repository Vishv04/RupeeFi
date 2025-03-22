import { useState } from 'react';
import { motion } from 'framer-motion';
import SpinWheel from './SpinWheel';
import ScratchCard from './ScratchCard';

const RewardsPage = () => {
  const [activeReward, setActiveReward] = useState('spin');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
        Win Exciting Rewards!
      </h1>

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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">How to Play</h3>
          {activeReward === 'spin' ? (
            <p className="text-gray-600">
              Click the spin button to rotate the wheel and win exciting rewards!
              You can win cashback up to ₹50 or discount vouchers.
            </p>
          ) : (
            <p className="text-gray-600">
              Scratch the card to reveal your reward! Every card guarantees a
              cashback between ₹10 and ₹50.
            </p>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Rewards Info</h3>
          <ul className="text-gray-600 list-disc list-inside">
            <li>Daily free rewards available</li>
            <li>Instant credit to e-Rupee balance</li>
            <li>No minimum transaction required</li>
            <li>100% guaranteed rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage; 