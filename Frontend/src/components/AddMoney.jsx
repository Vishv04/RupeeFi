import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddMoney = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle payment callback
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    
    if (status === 'success') {
      alert('Payment successful! Balance updated.');
      navigate('/dashboard', { replace: true });
    } else if (status === 'failed') {
      setError('Payment failed. Please try again.');
      navigate('/add-money', { replace: true });
    }
  }, [location, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/phonepe`, {
        amount: parseFloat(amount),
        userId
      });

      if (response.data.success) {
        window.location.href = response.data.paymentUrl;
      } else {
        setError('Failed to initiate payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Add Money to UPI Account
      </h2>

      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (₹1 to ₹1000)"
            required
            min="1"
            max="1000"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !amount || amount < 1 || amount > 1000}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading || !amount || amount < 1 || amount > 1000
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {loading ? 'Processing...' : 'Pay with PhonePe'}
        </button>
      </form>
    </div>
  );
};

AddMoney.propTypes = {
  userId: PropTypes.string.isRequired
};

export default AddMoney; 