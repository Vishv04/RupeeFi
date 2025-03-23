import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MoneyVisualizer from './MoneyVisualizer';

const ERupeeWallet = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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
  const [viewMode, setViewMode] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = currentUser?._id;
    
    // If no userId provided or matches current user, use current user's wallet
    if (!userId) {
      if (currentUserId) {
        navigate(`/wallet/erupee/${currentUserId}`, { replace: true });
      } else {
        setError('User not authenticated');
        setLoading(false);
      }
    } else {
      // Set view mode if viewing someone else's wallet
      setViewMode(currentUserId && userId !== currentUserId);
      fetchWalletDetails();
    }
  }, [userId, navigate]);

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

  const handleSearch = (e) => {
    const query = e.target.value;
    setTransferData(prev => ({ ...prev, searchQuery: query }));

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for debouncing
    searchTimeout.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferStatus('');
    
    if (!selectedUser) {
      setTransferStatus('Please select a recipient from the suggestions');
      return;
    }

    if (!transferData.amount || isNaN(transferData.amount) || parseFloat(transferData.amount) <= 0) {
      setTransferStatus('Please enter a valid amount');
      return;
    }

    // Show money visualizer instead of proceeding with transfer immediately
    setShowMoneyVisualizer(true);
  };

  const handleConfirmTransfer = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Validate balance before transfer
      if (parseFloat(transferData.amount) > wallet.balance) {
        setTransferStatus('Insufficient balance');
        setShowMoneyVisualizer(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/blockchain/transfer`,
        {
          senderErupeeId: wallet.erupeeId,
          receiverErupeeId: selectedUser.erupeeId,
          amount: parseFloat(transferData.amount)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTransferStatus('Transfer successful!');
      
      // Reset form
      setTransferData({
        searchQuery: '',
        receiverErupeeId: '',
        amount: ''
      });
      setSelectedUser(null);

      // Refresh wallet details
      fetchWalletDetails();

      // Hide money visualizer after transfer is complete
      setShowMoneyVisualizer(false);

    } catch (error) {
      console.error('Transfer failed:', error);
      setTransferStatus(error.response?.data?.error || 'Transfer failed');
      setShowMoneyVisualizer(false);
    }
  };

  const handleCancelTransfer = () => {
    setShowMoneyVisualizer(false);
    setTransferStatus('Transfer cancelled');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-red-600">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            e-Rupee Wallet {viewMode && <span className="text-sm font-normal text-gray-500">(View Only)</span>}
          </h2>
          
          {/* Balance Display */}
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Current Balance</h3>
            <p className="text-4xl font-bold text-indigo-600">₹{wallet.balance.toFixed(2)}</p>
            <p className="text-sm text-indigo-500 mt-2">e-Rupee ID: {wallet.erupeeId}</p>
          </div>

          {/* Only show transfer form if not in view mode */}
          {!viewMode && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Send e-Rupee</h3>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipient by name"
                    value={transferData.searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg">
                      {suggestions.map((user, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectUser(user)}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.erupeeId}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      Selected: {selectedUser.name} (ID: {selectedUser.erupeeId})
                    </p>
                  </div>
                )}

                <div>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={transferData.amount}
                    onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                >
                  Send
                </button>

                {transferStatus && (
                  <div className={`mt-4 p-3 rounded ${
                    transferStatus.includes('successful') 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {transferStatus}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          {wallet.transactions && wallet.transactions.length > 0 ? (
            <div className="space-y-4">
              {wallet.transactions.map((tx, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-lg font-semibold ${
                      tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {tx.type === 'debit' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No transactions yet</p>
          )}
        </div>
      </div>

      {/* Money Visualizer */}
      {showMoneyVisualizer && (
        <MoneyVisualizer 
          amount={parseFloat(transferData.amount)} 
          selectedUser={selectedUser}
          onConfirm={handleConfirmTransfer}
          onCancel={handleCancelTransfer}
        />
      )}
    </div>
  );
};

export default ERupeeWallet;