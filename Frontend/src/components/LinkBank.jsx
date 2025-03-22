import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Link Bank Account
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter bank account number"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
            placeholder="Enter IFSC code"
            required
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
          disabled={loading || !accountNumber || !ifscCode}
          className={`w-full py-2 px-4 rounded-md text-white ${
            loading || !accountNumber || !ifscCode 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {loading ? 'Processing...' : 'Link Bank Account'}
        </button>
      </form>
    </div>
  );
};

LinkBank.propTypes = {
  userId: PropTypes.string.isRequired
};

export default LinkBank; 