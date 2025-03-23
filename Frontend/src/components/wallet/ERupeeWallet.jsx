import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ERupeeWallet = () => {
  const { userId } = useParams();
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: [],
    eRupeeId: ''
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
  const searchTimeout = useRef(null);

  useEffect(() => {
    fetchWalletDetails();
  }, [userId]);

  const fetchWalletDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wallet/erupee/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setWallet(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch wallet details');
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setTransferData(prev => ({ ...prev, searchQuery: query }));
    setSelectedUser(null);
    setTransferData(prev => ({ ...prev, receiverErupeeId: '' }));

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set new timeout for debouncing
    searchTimeout.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/search?name=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }, 300); // 300ms debounce
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setTransferData(prev => ({
      ...prev,
      searchQuery: user.name,
      receiverErupeeId: user.eRupeeId
    }));
    setShowSuggestions(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferStatus('');
    
    if (!selectedUser) {
      setTransferStatus('Please select a user from the suggestions');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blockchain/transfer`,
        {
          senderErupeeId: wallet.eRupeeId,
          receiverErupeeId: transferData.receiverErupeeId,
          amount: parseInt(transferData.amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setTransferStatus('Transfer successful!');
      setTransferData({ searchQuery: '', receiverErupeeId: '', amount: '' });
      setSelectedUser(null);
      fetchWalletDetails();
    } catch (error) {
      setTransferStatus(error.response?.data?.error || 'Transfer failed');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">eRupee Wallet</h2>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₹{wallet.balance.toFixed(2)}
        </div>
        
        {/* Transfer Form */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Transfer e-Rupee</h3>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Receiver's Name
              </label>
              <input
                type="text"
                value={transferData.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Type receiver's name..."
                required
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                  {suggestions.map((user) => (
                    <div
                      key={user.eRupeeId}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectUser(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.eRupeeId}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="text-sm text-gray-600">
                Selected: {selectedUser.name} (ID: {selectedUser.eRupeeId})
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                value={transferData.amount}
                onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          {wallet.transactions.map((tx) => (
            <div key={tx.txHash} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Transaction #{tx.txHash.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-600">{tx.note}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="font-bold text-gray-900">
                  ₹{tx.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ERupeeWallet;