import { useState } from 'react';
import { Button, TextInput, Typography, Widget } from '@neo4j-ndl/react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AddMoney = ({ userId, onTransferComplete }) => {
  const [amount, setAmount] = useState('');
  const [upiPin, setUpiPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // First verify UPI PIN
      const verifyResponse = await axios.post('/api/verify-upi-pin', {
        userId,
        upiPin
      });

      if (verifyResponse.data.verified) {
        // If PIN is verified, proceed with transfer
        const transferResponse = await axios.post('/api/transfer-to-erupee', {
          userId,
          amount: parseFloat(amount),
          upiPin
        });

        if (transferResponse.data.success) {
          setSuccess('Money transferred successfully to e-Rupee wallet!');
          setAmount('');
          setUpiPin('');
          if (onTransferComplete) {
            onTransferComplete(transferResponse.data);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget className="p-4">
      <Typography variant="h4" className="mb-4">
        Add Money to e-Rupee Wallet
      </Typography>

      <form onSubmit={handleTransfer}>
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

        <div className="mb-4">
          <TextInput
            label="UPI PIN"
            type="password"
            value={upiPin}
            onChange={(e) => setUpiPin(e.target.value)}
            placeholder="Enter UPI PIN"
            required
            maxLength="6"
            className="w-full"
          />
        </div>

        {error && (
          <Typography variant="body2" className="text-red-500 mb-3">
            {error}
          </Typography>
        )}

        {success && (
          <Typography variant="body2" className="text-green-500 mb-3">
            {success}
          </Typography>
        )}

        <Button
          type="submit"
          disabled={loading || !amount || !upiPin}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Add Money'}
        </Button>
      </form>
    </Widget>
  );
};

AddMoney.propTypes = {
  userId: PropTypes.string.isRequired,
  onTransferComplete: PropTypes.func
};

export default AddMoney; 