import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextInput, Typography, Widget } from '@neo4j-ndl/react';
import PropTypes from 'prop-types';
import axios from 'axios';

const LinkBank = ({ userId }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const linkStatus = params.get('link');
    
    if (linkStatus === 'success') {
      alert('Bank account linked successfully!');
      navigate('/dashboard', { replace: true });
    } else if (linkStatus === 'failed') {
      setError('Failed to link bank account. Please try again.');
      navigate('/link-bank', { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/link-account`, {
        accountNumber,
        ifscCode,
        userId
      });

      if (response.data.success) {
        window.location.href = response.data.linkUrl;
      } else {
        setError('Failed to initiate account linking');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Widget className="p-4">
      <Typography variant="h4" className="mb-4">
        Link Bank Account
      </Typography>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextInput
            label="Account Number"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter bank account number"
            required
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <TextInput
            label="IFSC Code"
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
            placeholder="Enter IFSC code"
            required
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
          disabled={loading || !accountNumber || !ifscCode}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Link Bank Account'}
        </Button>
      </form>
    </Widget>
  );
};

LinkBank.propTypes = {
  userId: PropTypes.string.isRequired
};

export default LinkBank; 