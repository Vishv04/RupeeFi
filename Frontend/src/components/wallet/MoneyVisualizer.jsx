import { useState, useEffect } from 'react';
import rupee500 from '../../assets/500rupee.png';
import rupee100 from '../../assets/100rupee.png';
import rupee50 from '../../assets/50rupee.png';
import rupee20 from '../../assets/20rupee.png';
import rupee10 from '../../assets/10rupee.png';
import rupee5 from '../../assets/5rupee.png';
import rupee2 from '../../assets/2rupee.png';
import rupee1 from '../../assets/1coin.png';

const DENOMINATIONS = [
  { value: 500, image: rupee500, type: 'note' },
  { value: 100, image: rupee100, type: 'note' },
  { value: 50, image: rupee50, type: 'note' },
  { value: 20, image: rupee20, type: 'note' },
  { value: 10, image: rupee10, type: 'note' },
  { value: 5, image: rupee5, type: 'note' },
  { value: 2, image: rupee2, type: 'coin' },
  { value: 1, image: rupee1, type: 'coin' },
];

const MoneyVisualizer = ({ amount, onConfirm, onCancel, selectedUser }) => {
  const [denominations, setDenominations] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [confirmClicked, setConfirmClicked] = useState(false);

  useEffect(() => {
    calculateDenominations(amount);
  }, [amount]);

  const calculateDenominations = (totalAmount) => {
    let remaining = totalAmount;
    const result = [];

    DENOMINATIONS.forEach(({ value, image, type }) => {
      if (remaining >= value) {
        const count = Math.floor(remaining / value);
        remaining = remaining % value;
        result.push({ value, count, image, type });
      }
    });

    setDenominations(result);
  };

  const handleConfirm = () => {
    if (confirmClicked) return; // Prevent double clicks
    setConfirmClicked(true);
    setIsAnimating(true);
    
    // Wait for animation to complete before confirming
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur rounded-2xl p-6 w-screen h-screen overflow-y-auto overflow-x-hidden">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Confirm Your Transfer
          </h2>
          <div className="inline-block bg-blue-50 rounded-full px-8 py-4 shadow-lg">
            <p className="text-3xl font-bold text-blue-600">
              ₹{amount.toFixed(2)}
            </p>
          </div>
          {selectedUser && (
            <div className="mt-4 text-lg text-gray-600">
              To: <span className="font-semibold">{selectedUser.name}</span>
              <div className="text-sm text-gray-500">ID: {selectedUser.erupeeId}</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mb-6 py-4 px-2">
          {denominations.map(({ value, count, image, type }, index) => (
            count > 0 && (
              <div
                key={value}
                className="relative group"
              >
                <div className="absolute -right-3 -top-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20 border-2 border-white">
                  {count}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <img
                    src={image}
                    alt={`₹${value} ${type}`}
                    className={`w-[300px] h-[140px] object-contain ${isAnimating ? 'animate-slide-right' : ''
                      } drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                    ₹{value} {type}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onCancel}
            disabled={confirmClicked}
            className={`w-full sm:w-auto px-12 py-4 text-lg border-2 border-gray-300 rounded-xl font-medium transition-all duration-300 
              ${confirmClicked 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50 hover:border-red-300 hover:text-red-500 hover:scale-105'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmClicked}
            className={`w-full sm:w-auto px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 
              ${confirmClicked 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:shadow-lg'}`}
          >
            {confirmClicked ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoneyVisualizer;
