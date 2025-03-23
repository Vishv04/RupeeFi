import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MoneyVisualizer from './MoneyVisualizer';

const ERupeeWallet = () => {
  const { userId } = useParams();
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: [],
    erupeeId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferData, setTransferData] = useState({
    searchQuery: '',
    receiverErupeeId: '',
    amount: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [transferStatus, setTransferStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showMoneyVisualizer, setShowMoneyVisualizer] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    fetchWalletDetails();
  }, [userId]);

  const fetchWalletDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallet/erupee/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Wallet response:', response.data);
      setWallet(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      setError(error.response?.data?.error || 'Failed to fetch wallet details');
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/search?name=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Search response:', response.data);

      const formattedSuggestions = response.data.map(user => {
        console.log('Processing user:', user);
        return {
          name: user.name,
          erupeeId: user.erupeeId
        };
      });

      console.log('Formatted suggestions:', formattedSuggestions);

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setTransferData(prev => ({
      ...prev,
      searchQuery: user.name,
      receiverErupeeId: user.erupeeId
    }));
    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setTransferData(prev => ({ ...prev, searchQuery: query }));
    setSelectedUser(null);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferStatus('');

    if (!selectedUser) {
      setTransferStatus('Please select a user from the suggestions');
      return;
    }

    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      setTransferStatus('Please enter a valid amount');
      return;
    }

    if (amount > wallet.balance) {
      setTransferStatus('Insufficient balance');
      return;
    }

    setShowMoneyVisualizer(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setTransferStatus('Not authenticated');
        return;
      }

      if (!selectedUser?.erupeeId) {
        setTransferStatus('Please select a valid recipient');
        return;
      }

      if (!wallet.erupeeId) {
        setTransferStatus('Your e-Rupee ID is not properly initialized');
        return;
      }

      const amount = parseFloat(transferData.amount);
      console.log('Transfer payload:', {
        senderErupeeId: wallet.erupeeId,
        receiverErupeeId: selectedUser.erupeeId,
        amount: amount
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blockchain/transfer`,
        {
          senderErupeeId: wallet.erupeeId,
          receiverErupeeId: selectedUser.erupeeId,
          amount: amount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowMoneyVisualizer(false);
      setTransferStatus(response.data.rewardMessage ? 
        `Transfer successful! ${response.data.rewardMessage}` : 
        'Transfer successful!'
      );
      setTransferData({
        searchQuery: '',
        receiverErupeeId: '',
        amount: ''
      });
      setSelectedUser(null);
      fetchWalletDetails();
    } catch (error) {
      setShowMoneyVisualizer(false);
      console.error('Transfer error:', error);
      setTransferStatus(
        error.response?.data?.error || 
        'Transfer failed. Please try again.'
      );
    }
  };

  const handleCancelTransfer = () => {
    setShowMoneyVisualizer(false);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      {showMoneyVisualizer && (
        <MoneyVisualizer
          amount={parseFloat(transferData.amount)}
          onConfirm={handleConfirmTransfer}
          onCancel={handleCancelTransfer}
        />
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">e-Rupee Wallet</h2>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₹{wallet.balance.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          e-Rupee ID: {wallet.erupeeId || 'Not available'}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Transfer e-Rupee</h3>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Recipient Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={transferData.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Search by name"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {suggestions.map((user) => (
                      <div
                        key={user.erupeeId}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectUser(user)}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">
                          e-Rupee ID: {user.erupeeId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedUser && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">Selected User:</p>
                <p className="text-gray-600">{selectedUser.name}</p>
                <p className="text-xs text-gray-500">e-Rupee ID: {selectedUser.erupeeId}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                min="1"
                step="1"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={!selectedUser || !transferData.amount}
            >
              Transfer
            </button>
          </form>
          {transferStatus && (
            <div className={`mt-3 text-sm ${transferStatus.includes('failed') || transferStatus.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
              {transferStatus}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <div className="space-y-4">
          {wallet.transactions && wallet.transactions.length > 0 ? (
            wallet.transactions.map((tx) => (
              <div key={tx._id || tx.timestamp} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {tx.type === 'CREDIT' ? 'Received' : 'Sent'}
                    </p>
                    <p className="text-sm text-gray-600">{tx.description || 'e-Rupee Transfer'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ERupeeWallet;