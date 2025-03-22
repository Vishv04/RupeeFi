import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { motion, AnimatePresence } from "framer-motion";

function createColorGenerator(colorArray) {
  const colors = colorArray?.length
    ? colorArray
    : ["#ff0f7b", "#ff930f", "#45caff", "#f5e050", "#8a2be2", "#00ff7f", "#ff4500"];
  let currentIndex = 0;

  return function () {
    const color = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    return color;
  };
}

export const SpinWheel = ({
  itemColors = [],
  borderColor = "#666",
  spinActionName = "spin", // Updated default to lowercase
  resetActionName = "Reset",
  size = 400,
  spinTime = 3000,
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
      ? ((size - Math.tan((45 - 360 / items.length / 2) * (Math.PI / 180)) * size) / size) * 100
      : 0;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {error && (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-lg font-semibold">Spins Available: {spinsAvailable}</p>
      </div>

      <div className="relative">
        {/* Enhanced Pointer */}
        <motion.div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-20 pointer rotate-180"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="pointer-head" />
          <div className="pointer-stem" />
        </motion.div>

        <div
          className="spin-container"
          style={{
            width: size,
            height: size,
            boxShadow: `0 0 15px #333 inset, 0 0 15px ${borderColor}`,
            ...spinContainerStyle,
          }}
        >
          {initState ? (
            <button
              className="spin-button"
              style={spinButtonStyle}
              onClick={spinWheel}
              disabled={isSpinning || spinsAvailable <= 0}
            >
              {isSpinning ? "spinning" : "spin"}
            </button>
          ) : (
            <button
              className="spin-button"
              style={resetButtonStyle}
              onClick={resetWheel}
              disabled={!isFinished}
            >
              {resetActionName}
            </button>
          )}

          <div
            className="spin-wheel"
            style={{
              border: `solid 5px ${borderColor}`,
              transform: initState
                ? "rotate(0deg)"
                : `rotate(-${720 + randIndex * (360 / items.length)}deg)`,
              transition: !initState
                ? `transform ${Math.floor(spinTime / 1000)}s ease`
                : "none",
              ...spinWheelStyle,
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.name}
                className="option"
                style={{
                  backgroundColor: getColor(),
                  transform: `rotate(${(360 / items.length) * index + 45}deg)`,
                  clipPath: `polygon(0 0, ${sidePercent}% 0, 100% 100%, 0 ${sidePercent}%)`,
                  ...spinItemStyle,
                }}
              >
                <span style={spinFontStyle}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Dialog */}
      <AnimatePresence>
        {showRewardDialog && currentReward && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setShowRewardDialog(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  Congratulations!
                </h2>
                <p className="text-xl mb-4">You won {currentReward.name}!</p>
                {currentReward.type === "cashback" && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-green-800">
                      ₹{currentReward.amount} has been added to your e-Rupee balance
                    </p>
                  </div>
                )}
                {currentReward.type === "discount" && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-blue-800">
                      {currentReward.amount}% discount voucher added to your account
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowRewardDialog(false)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheel;