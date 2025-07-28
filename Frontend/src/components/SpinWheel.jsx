import { useState } from 'react';

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinsAvailable, setSpinsAvailable] = useState(3);

  const rewards = [
    { value: '₹5' },
    { value: '₹10' },
    { value: '₹15' },
    { value: '₹20' },
    { value: '₹25' },
    { value: '₹50' },
    { value: '10% Off' },
    { value: 'Try Again' },
  ];

  const handleSpin = () => {
    if (isSpinning || spinsAvailable <= 0) return;
    
    setIsSpinning(true);
    const spinAmount = Math.floor(Math.random() * 360) + 1440; // Random spin + multiple rotations
    setRotation(prev => prev + spinAmount);
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinsAvailable(prev => prev - 1);
    }, 4000);
  };

  const wheelSegmentStyle = (index) => {
    const angle = (360 / 8); // 8 segments
    const rotation = index * angle - (angle / 2); // Subtract half segment angle to center
    
    return {
      position: 'absolute',
      width: '50%', // Half of wheel radius
      height: '2px',
      transformOrigin: 'left center',
      transform: `rotate(${rotation}deg)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: '20px',
    };
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '20px',
  };

  const wheelContainerStyle = {
    position: 'relative',
    width: '400px',
    height: '400px',
  };

  const wheelCircleStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '10px solid #333',
    background: 'conic-gradient(from -45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEEAD, #D4A5A5, #9B59B6, #3498DB)', // Adjusted starting angle
  };

  const pointerStyle = {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '30px solid #333',
    zIndex: 2,
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-2xl font-bold mb-8 text-center">Spin & Win</h2>
      
      <div style={wheelContainerStyle}>
        <div style={pointerStyle} />
        <div 
          style={{
            ...wheelCircleStyle,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          {rewards.map((reward, index) => (
            <div key={index} style={wheelSegmentStyle(index)}>
              <span className="text-white font-bold text-lg">{reward.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSpin}
        disabled={isSpinning || spinsAvailable <= 0}
      >
        {isSpinning ? 'Spinning...' : `Spin (${spinsAvailable} left)`}
      </button>
    </div>
  );
};

export default SpinWheel; 