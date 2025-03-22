import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./scratchCard.css";

const ScratchCard = () => {
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState(null);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPoint = useRef(null);
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

        // Fetch available cards
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rewards/scratch-cards`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCardsAvailable(response.data.cardsAvailable);

        // Get current user balance
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setUserBalance(user.eRupeeBalance || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load scratch cards");
      }
    };

    fetchData();
  }, []);

  const initCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    contextRef.current = context;

    // Create metallic scratch surface
    const gradient = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#4f46e5");
    gradient.addColorStop(0.2, "#7c3aed");
    gradient.addColorStop(0.4, "#4f46e5");
    gradient.addColorStop(0.6, "#7c3aed");
    gradient.addColorStop(0.8, "#4f46e5");
    gradient.addColorStop(1, "#7c3aed");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch texture pattern
    for (let i = 0; i < canvas.width; i += 4) {
      for (let j = 0; j < canvas.height; j += 4) {
        if (Math.random() > 0.5) {
          context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
          context.fillRect(i, j, 2, 2);
        }
      }
    }

    // Add "Scratch Here!" text
    context.font = "bold 20px Arial";
    context.textAlign = "center";
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillText("Scratch Here!", canvas.width / 4, canvas.height / 2);
  };

  useEffect(() => {
    if (isScratching) {
      initCanvas();
    }
  }, [isScratching]);

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

      // Update user balance in localStorage
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

  const handleScratch = (e) => {
    if (!isScratching || !contextRef.current || !isMouseDown) return;

    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0].clientX) - rect.left) * 2;
    const y = ((e.clientY || e.touches?.[0].clientY) - rect.top) * 2;

    contextRef.current.globalCompositeOperation = "destination-out";
    contextRef.current.lineWidth = 40;
    contextRef.current.lineCap = "round";
    contextRef.current.lineJoin = "round";

    // Create scratch effect
    if (lastPoint.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(lastPoint.current.x, lastPoint.current.y);
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();

      // Add particle effect
      const particles = 3;
      for (let i = 0; i < particles; i++) {
        const radius = Math.random() * 2 + 1;
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        contextRef.current.beginPath();
        contextRef.current.arc(
          x + offsetX,
          y + offsetY,
          radius,
          0,
          Math.PI * 2
        );
        contextRef.current.fill();
      }
    }

    lastPoint.current = { x, y };

    // Calculate scratch percentage
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 70 && !isRevealed) {
      setIsRevealed(true);
      revealInstantly();
    }
  };

  const revealInstantly = () => {
    if (!contextRef.current) return;

    let opacity = 1;
    const fadeOut = () => {
      if (opacity <= 0) return;
      opacity -= 0.05;

      const gradient = contextRef.current.createLinearGradient(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      gradient.addColorStop(0, `rgba(79, 70, 229, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(124, 58, 237, ${opacity})`);
      gradient.addColorStop(1, `rgba(79, 70, 229, ${opacity})`);

      contextRef.current.globalCompositeOperation = "source-over";
      contextRef.current.fillStyle = gradient;
      contextRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (opacity > 0) {
        requestAnimationFrame(fadeOut);
      }
    };

    fadeOut();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {error && (
        <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="text-center mb-4 space-y-2">
        <p className="text-lg font-semibold">
          Scratch Cards Available: {cardsAvailable}
        </p>
        <p className="text-md text-gray-600">Current Balance: ₹{userBalance}</p>
      </div>

      <div className="scratch-card-container">
        {!isScratching ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="start-scratch-btn"
            onClick={startScratching}
            disabled={cardsAvailable <= 0}
          >
            <span className="relative z-10">Get Scratch Card</span>
          </motion.button>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width="600"
              height="300"
              onMouseDown={(e) => {
                setIsMouseDown(true);
                lastPoint.current = null;
                handleScratch(e);
              }}
              onMouseMove={handleScratch}
              onMouseUp={() => setIsMouseDown(false)}
              onMouseOut={() => setIsMouseDown(false)}
              onTouchStart={(e) => {
                setIsMouseDown(true);
                lastPoint.current = null;
                handleScratch(e);
              }}
              onTouchMove={handleScratch}
              onTouchEnd={() => setIsMouseDown(false)}
              className="scratch-canvas"
            />
            <div
              className="reward-content"
              style={{
                opacity: Math.min(scratchPercentage / 50, 1),
                transform: `scale(${isRevealed ? 1 : 0.9})`,
                transition: "all 0.5s ease",
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{
                  scale: isRevealed ? 1 : 0,
                  rotate: isRevealed ? 0 : -10,
                }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-center reward-amount"
              >
                <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  ₹{reward?.amount}
                </h3>
                <p className="text-xl text-indigo-600">Cashback Reward!</p>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsRevealed(false)}
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center"
                >
                  <span className="text-3xl">🎉</span>
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                >
                  Congratulations!
                </motion.h2>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-xl mb-4">You won ₹{reward?.amount}!</p>
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-green-800">
                      Amount added to your e-Rupee balance
                      <br />
                      <span className="font-semibold">
                        New Balance: ₹{userBalance}
                      </span>
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
                    onClick={() => {
                      setIsRevealed(false);
                      if (cardsAvailable > 0) {
                        setTimeout(() => {
                          setIsScratching(false);
                          setScratchPercentage(0);
                          setReward(null);
                          lastPoint.current = null;
                        }, 300);
                      }
                    }}
                  >
                    {cardsAvailable > 0 ? "Get Another Card" : "Awesome!"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScratchCard;
