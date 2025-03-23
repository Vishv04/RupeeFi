import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UPIWallet = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: []
  });
  const [amount, setAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferStatus, setTransferStatus] = useState('');
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = currentUser?._id;
    
    // If no userId provided or matches current user, use current user's wallet
    if (!userId) {
      if (currentUserId) {
        navigate(`/wallet/upi/${currentUserId}`, { replace: true });
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
        `${import.meta.env.VITE_API_URL}/api/wallet/upi/${userId}`,
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

  const handleAddMoney = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { amount: parseFloat(amount) * 100 },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.amount,
        currency: "INR",
        name: "RupeeFi",
        description: "Add Money to UPI Wallet",
        order_id: response.data.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                amount: parseFloat(amount) * 100,
                walletType: 'upi'
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchWalletDetails();
            setAmount('');
          } catch (error) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Failed to initiate payment');
    }
  };

  const handleTransferToERupee = async (e) => {
    e.preventDefault();
    setTransferStatus('');
    setError(null);

    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(transferAmount) > wallet.balance) {
      setError('Insufficient balance');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/wallet/transfer-to-erupee`,
        { amount: parseFloat(transferAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransferStatus('Transfer successful!');
      setTransferAmount('');
      fetchWalletDetails();
    } catch (error) {
      setError(error.response?.data?.error || 'Transfer failed');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          UPI Wallet {viewMode && <span className="text-sm font-normal text-gray-500">(View Only)</span>}
        </h2>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₹{wallet.balance.toFixed(2)}
        </div>

        {/* Only show add money and transfer forms if not in view mode */}
        {!viewMode && (
          <>
            {/* Add Money Form */}
            <form onSubmit={handleAddMoney} className="mb-6">
              <div className="mb-4">
                <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                  Add Money
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Money
              </button>
            </form>

            {/* Transfer to e-Rupee Form */}
            <form onSubmit={handleTransferToERupee} className="mb-6">
              <div className="mb-4">
                <label htmlFor="transferAmount" className="block text-gray-700 font-medium mb-2">
                  Transfer to e-Rupee Wallet
                </label>
                <input
                  type="number"
                  id="transferAmount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount to transfer"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Transfer to e-Rupee
              </button>
            </form>
          </>
        )}

        {transferStatus && (
          <div className="text-green-600 text-center mb-4">{transferStatus}</div>
        )}

        {/* Transaction History */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          {wallet.transactions && wallet.transactions.length > 0 ? (
            <div className="space-y-4">
              {wallet.transactions.map((transaction, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`font-bold ${
                      transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
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
    </div>
  );
};

export default UPIWallet;