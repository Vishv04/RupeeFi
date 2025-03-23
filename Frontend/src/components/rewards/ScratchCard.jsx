import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ScratchToReveal } from "../ui/scratch-to-reveal";
import "./scratchCard.css";

const ScratchCard = () => {
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState(null);
  const [cardsAvailable, setCardsAvailable] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to continue");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rewards/scratch-cards`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCardsAvailable(response.data.cardsAvailable);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserBalance(user.eRupeeBalance || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load scratch cards");
      }
    };

    fetchData();
  }, []);

  const startScratching = async () => {
    if (isScratching || cardsAvailable <= 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to scratch");
        return;
      }

      setIsScratching(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rewards/scratch`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.eRupeeBalance = (user.eRupeeBalance || 0) + response.data.amount;
      localStorage.setItem("user", JSON.stringify(user));
      setUserBalance(user.eRupeeBalance);

      setReward({
        amount: response.data.amount,
        type: response.data.type,
      });
      setCardsAvailable((prev) => prev - 1);
    } catch (err) {
      console.error("Error starting scratch:", err);
      setError(err.response?.data?.message || "Failed to start scratch card");
      setIsScratching(false);
    }
  };

  const handleComplete = () => {
    setIsRevealed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100/90 backdrop-blur-sm border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-lg"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20"
        >
          <motion.div
            className="text-center mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Scratch & Win
            </h2>
            <div className="flex justify-center space-x-6">
              <motion.p
                className="text-white/80"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
              >
                Cards: {cardsAvailable}
              </motion.p>
              <motion.p
                className="text-white/80"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
              >
                Balance: {userBalance} eRupee
              </motion.p>
            </div>
          </motion.div>

          {!isScratching && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScratching}
              disabled={cardsAvailable <= 0}
              className={`w-full py-3 px-6 rounded-xl text-lg font-semibold shadow-lg transform transition-all duration-300
              bg-gradient-to-r relative group overflow-hidden
              ${cardsAvailable > 0
                ? "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                : "from-gray-400 to-gray-500 cursor-not-allowed text-gray-200"
              }`}
            >
              <span className="relative z-10">
                {cardsAvailable > 0 ? "Start Scratching" : "No Cards Available"}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {isScratching && !isRevealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                className="perspective-1000"
              >
                <div className="transform-style-3d">
                  <ScratchToReveal
                    width={350}
                    height={350}
                    minScratchPercentage={70}
                    className="flex items-center justify-center overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg transform hover:scale-105 transition-transform duration-300"
                    onComplete={handleComplete}
                    gradientColors={["#6366f1", "#a855f7", "#ec4899"]}
                  >
                    <motion.div
                      className="text-center space-y-4 p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.p
                        className="text-6xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring" }}
                      >
                        {reward?.amount} eRupee
                      </motion.p>
                      <p className="text-xl text-white/90">{reward?.type}</p>
                    </motion.div>
                  </ScratchToReveal>
                </div>
              </motion.div>
            )}

            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="text-center p-8 space-y-6"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                  }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Congratulations!
                </h3>
                <motion.p
                  className="text-2xl text-white/90"
                  whileHover={{ scale: 1.05 }}
                >
                  You won {reward?.amount} eRupee
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsScratching(false);
                    setIsRevealed(false);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
                >
                  Claim Reward
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ScratchCard;
