import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ERupeeWallet = () => {
  const { userId } = useParams();
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-32">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">eRupee Wallet</h2>
        <div className="text-3xl font-bold text-gray-900 mb-6">
          ₹{wallet.balance.toFixed(2)}
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