import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const BlockchainViewer = () => {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchChain = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        console.log("Fetching blockchain with token:", token);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blockchain/chain`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Blockchain response:", response.data);
        setChain(response.data);
      } catch (err) {
        console.error("Error fetching blockchain:", err);
        setError(
          err.response?.data?.error || "Failed to fetch blockchain data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChain();
    const interval = setInterval(fetchChain, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const drawBlockchain = (ctx, blocks) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const blockWidth = 160;
    const blockHeight = 80;
    const spacing = 40;
    const startX = 50;
    const startY = ctx.canvas.height / 2 - blockHeight / 2;

    blocks.forEach((block, index) => {
      ctx.fillStyle = '#e3f2fd';
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 2;
      
      const x = startX + index * (blockWidth + spacing);
      
      ctx.beginPath();
      ctx.roundRect(x, startY, blockWidth, blockHeight, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e40af';
      ctx.font = '22px Arial';
      ctx.fillText(`Block `, x + 10, startY + 25);
      ctx.font = '18px Arial';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${block.transactions.length} tx`, x + 10, startY + 55);

      if (index < blocks.length - 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.moveTo(x + blockWidth, startY + blockHeight / 2);
        ctx.lineTo(x + blockWidth + spacing, startY + blockHeight / 2);
        ctx.lineTo(x + blockWidth + spacing - 10, startY + blockHeight / 2 - 10);
        ctx.moveTo(x + blockWidth + spacing, startY + blockHeight / 2);
        ctx.lineTo(x + blockWidth + spacing - 10, startY + blockHeight / 2 + 10);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (!chain.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = Math.max(window.innerWidth - 100, chain.length * 200);
    canvas.height = 150;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= dpr;
    canvas.height *= dpr;
    ctx.scale(dpr, dpr);
    
    drawBlockchain(ctx, chain);
  }, [chain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600">
            Loading blockchain data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-30">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Blockchain Explorer
      </h1> */}

      <div className="mb-8 overflow-x-auto">
        <canvas
          ref={canvasRef}
          className="bg-white rounded-lg shadow-md p-4"
          style={{ minWidth: '100%', fontSize: '16px' }}
        />
      </div>

      <div className="space-y-6">
        {chain.map((block, index) => (
          <div
            key={block.hash}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-lg font-medium">
                    Block {index + 1}
                  </span>
                  <span className="text-gray-500 text-lg">
                    {formatTimestamp(block.timestamp)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-500">
                    {block.transactions.length} transactions
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="mb-4">
                <p className="text-lg text-gray-600">
                  <span className="font-medium">Hash: </span>
                  <span className="font-mono">{block.hash}</span>
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-medium">Previous Hash: </span>
                  <span className="font-mono">{block.previousHash}</span>
                </p>
              </div>

              <div className="space-y-4">
                {block.transactions.map((tx, txIndex) => (
                  <div key={txIndex} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900">
                          From: {tx.sender || 'Unknown'}
                        </p>
                        <p className="text-lg font-medium text-gray-900">
                          To: {tx.receiver || 'Unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {formatAmount(tx.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainViewer;
