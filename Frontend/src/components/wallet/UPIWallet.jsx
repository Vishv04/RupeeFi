import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UPIWallet = () => {
  const { userId } = useParams();
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: []
  });
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWalletDetails();
  }, [userId]);

  const fetchWalletDetails = async () => {
    try {
      const token = localStorage.getItem('token');
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
                amount: parseFloat(amount) * 100
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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">UPI Wallet</h2>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₹{wallet.balance.toFixed(2)}
        </div>

        {/* Add Money Form */}
        <form onSubmit={handleAddMoney} className="mt-4">
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 p-2 border rounded"
              min="1"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!amount || amount <= 0}
            >
              Add Money
            </button>
          </div>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <div className="space-y-4">
          {wallet.transactions.map((tx) => (
            <div key={tx._id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {tx.type === 'credit' ? 'Received' : 'Sent'}
                  </p>
                  <p className="text-sm text-gray-600">{tx.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UPIWallet;