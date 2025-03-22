import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextInput, Typography, Widget } from '@neo4j-ndl/react';
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
    <Widget className="p-4">
      <Typography variant="h4" className="mb-4">
        Add Money to UPI Account
      </Typography>

      <form onSubmit={handlePayment}>
        <div className="mb-4">
          <TextInput
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (₹1 to ₹1000)"
            required
            min="1"
            max="1000"
            className="w-full"
          />
        </div>

        {error && (
          <Typography variant="body2" className="text-red-500 mb-3">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          disabled={loading || !amount || amount < 1 || amount > 1000}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Pay with PhonePe'}
        </Button>
      </form>
    </Widget>
  );
};

AddMoney.propTypes = {
  userId: PropTypes.string.isRequired
};

export default AddMoney; 