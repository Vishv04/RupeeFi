import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { motion, AnimatePresence } from "framer-motion";

function createColorGenerator(colorArray) {
  const colors = colorArray?.length
    ? colorArray
    : ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96c93d", "#ffcc5c", "#88d8b0", "#ff9f1c"];
  let currentIndex = 0;

  return function () {
    const color = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    return color;
  };
}

export const SpinWheel = ({
  itemColors = [],
  borderColor = "#444",
  spinActionName = "Spin Now",
  resetActionName = "Reset",
  spinTime = 4000,
  onResult,
  onFinishSpin,
  onReset,
  spinContainerStyle,
  spinWheelStyle,
  spinButtonStyle,
  resetButtonStyle,
  spinFontStyle,
  spinItemStyle,
}) => {
  const getColor = createColorGenerator(itemColors);

  const [wheelSize, setWheelSize] = useState(Math.min(450, Math.max(250, window.innerWidth * 0.8)));
  const [initState, setInitState] = useState(true);
  const [randIndex, setRandIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(true);
  const [items, setItems] = useState([]);
  const [spinsAvailable, setSpinsAvailable] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState(null);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWheelSize(Math.min(450, Math.max(250, window.innerWidth * 0.8)));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to play");
          return;
        }

        const spinsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rewards/spins-available`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSpinsAvailable(spinsResponse.data.spinsAvailable);

        setItems([
          { name: "₹5", type: "cashback", amount: 5 },
          { name: "₹10", type: "cashback", amount: 10 },
          { name: "₹15", type: "cashback", amount: 15 },
          { name: "₹20", type: "cashback", amount: 20 },
          { name: "₹25", type: "cashback", amount: 25 },
          { name: "₹50", type: "cashback", amount: 50 },
          { name: "10% Off", type: "discount", amount: 10 },
          { name: "Try Again", type: "none", amount: 0 },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load spin data");
      }
    };
    fetchData();
  }, []);

  const spinWheel = async () => {
    if (isSpinning || spinsAvailable <= 0) return;

    setShowRewardDialog(false);
    setIsSpinning(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to spin");
        setIsSpinning(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rewards/spin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reward = response.data.reward;
      const rewardIndex = items.findIndex((item) => item.name === reward);

      if (rewardIndex === -1) {
        setError("Received invalid reward from server");
        setIsSpinning(false);
        return;
      }

      onResult?.(items[rewardIndex]);
      setRandIndex(rewardIndex);
      setInitState(false);
      setIsFinished(false);

      setTimeout(() => {
        onFinishSpin?.(items[rewardIndex]);
        setIsFinished(true);
        setIsSpinning(false);
        setSpinsAvailable((prev) => prev - 1);
        setCurrentReward({
          ...items[rewardIndex],
          type: response.data.type,
          amount: response.data.amount,
        });
        setShowRewardDialog(true);

        if (response.data.type === "cashback") {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          user.eRupeeBalance = (user.eRupeeBalance || 0) + response.data.amount;
          localStorage.setItem("user", JSON.stringify(user));
        }
      }, spinTime);
    } catch (err) {
      console.error("Spin error:", err);
      setError(err.response?.data?.message || "Failed to spin the wheel");
      setIsSpinning(false);
    }
  };

  const resetWheel = () => {
    onReset?.();
    setInitState(true);
    setRandIndex(0);
  };

  const sidePercent =
    items.length > 0
      ? ((wheelSize - Math.tan((45 - 360 / items.length / 2) * (Math.PI / 180)) * wheelSize) / wheelSize) * 100
      : 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen overflow-x-hidden">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 p-4 bg-red-900/30 rounded-xl mb-6 border border-red-500/50"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <p className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
          Spins Available: {spinsAvailable}
        </p>
      </motion.div>

      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20 rotate-180"
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-600 shadow-lg" />
          <div className="w-4 h-8 bg-red-600 rounded-b-md mx-auto shadow-md" />
        </motion.div>

        <motion.div
          className="spin-container relative"
          style={{
            width: wheelSize,
            height: wheelSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1e1e1e, #333)",
            boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)",
            transformStyle: "preserve-3d",
            perspective: "1000px",
            ...spinContainerStyle,
          }}
          animate={{ rotateX: isSpinning ? 10 : 0, rotateY: isSpinning ? 10 : 0 }}
        >
          <motion.button
            className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full font-bold text-white text-sm sm:text-lg md:text-xl z-10 shadow-lg"
            style={{
              background: isSpinning
                ? "linear-gradient(135deg, #666, #888)"
                : "linear-gradient(135deg, #ff3cac, #784ba0)",
              ...spinButtonStyle,
            }}
            onClick={initState ? spinWheel : resetWheel}
            disabled={isSpinning || (!initState && !isFinished) || spinsAvailable <= 0}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSpinning ? "Spinning..." : initState ? spinActionName : resetActionName}
          </motion.button>

          <motion.div
            className="spin-wheel absolute inset-0"
            style={{
              border: `8px solid ${borderColor}`,
              borderRadius: "50%",
              transform: initState
                ? "rotate(0deg)"
                : `rotate(-${1080 + randIndex * (360 / items.length)}deg)`,
              transition: !initState
                ? `transform ${Math.floor(spinTime / 1000)}s cubic-bezier(0.25, 0.1, 0.25, 1)`
                : "none",
              ...spinWheelStyle,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.name}
                className="option absolute inset-0"
                style={{
                  background: getColor(),
                  transform: `rotate(${(360 / items.length) * index}deg)`,
                  clipPath: `polygon(0 0, ${sidePercent}% 0, 100% 100%, 0 ${sidePercent}%)`,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                  ...spinItemStyle,
                }}
              >
                <span
                  className="text-xs sm:text-sm md:text-base font-semibold text-white drop-shadow-md"
                  style={{ ...spinFontStyle }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showRewardDialog && currentReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowRewardDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-3xl sm:text-4xl">🏆</span>
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  You Won!
                </h2>
                <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-200">{currentReward.name}</p>
                {currentReward.type === "cashback" && (
                  <div className="bg-green-900/30 p-4 rounded-xl mb-4 sm:mb-6 border border-green-500/50">
                    <p className="text-green-300">
                      ₹{currentReward.amount} added to your e-Rupee balance
                    </p>
                  </div>
                )}
                {currentReward.type === "discount" && (
                  <div className="bg-blue-900/30 p-4 rounded-xl mb-4 sm:mb-6 border border-blue-500/50">
                    <p className="text-blue-300">
                      {currentReward.amount}% discount voucher unlocked!
                    </p>
                  </div>
                )}
                <motion.button
                  onClick={() => setShowRewardDialog(false)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Claim Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheel;
