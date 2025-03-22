import { useState } from 'react';
import { Button, TextInput, Typography, Widget } from '@neo4j-ndl/react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddMoney = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, {
        amount: amount * 100, // Convert to paise
        userId
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "RupeeFi",
        description: "Add money to UPI account",
        order_id: orderResponse.data.orderId,
        handler: async (response) => {
          try {
            // Verify payment and update UPI balance
            const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId
            });

            if (verifyResponse.data.success) {
              setAmount('');
              alert('Money added successfully to your UPI account!');
            }
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
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
            placeholder="Enter amount"
            required
            min="1"
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
          disabled={loading || !amount}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Add Money via Razorpay'}
        </Button>
      </form>
    </Widget>
  );
};

AddMoney.propTypes = {
  userId: PropTypes.string.isRequired
};

export default AddMoney; 