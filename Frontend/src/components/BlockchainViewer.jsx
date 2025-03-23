import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlockchainViewer = () => {
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChain = async () => {
            try {
                setError(null);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blockchain/chain`);
                setChain(response.data);
            } catch (err) {
                setError('Failed to fetch blockchain data');
                console.error('Error fetching blockchain:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChain();
        const interval = setInterval(fetchChain, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="blockchain-loading">Loading blockchain data...</div>;
    }

    if (error) {
        return <div className="blockchain-error">{error}</div>;
    }

    return (
        <div className="blockchain-viewer">
            <h2 className="text-2xl font-bold mb-4">e-Rupee Blockchain</h2>
            <div className="blockchain-blocks">
                {chain.map((block, index) => (
                    <div
                        key={block.hash}
                        className="block-card mb-4 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="block-header flex justify-between items-center mb-2">
                            <span className="text-lg font-semibold">Block #{index}</span>
                            <span className="text-sm text-gray-500 font-mono">
                                Hash: {block.hash.slice(0, 16)}...
                            </span>
                        </div>
                        <div className="transactions-container bg-gray-50 p-3 rounded">
                            <h3 className="text-md font-medium mb-2">Transactions</h3>
                            {block.transactions.map((tx, txIndex) => (
                                <div
                                    key={txIndex}
                                    className="transaction-item p-2 mb-2 bg-white rounded border border-gray-100"
                                >
                                    <div className="flex justify-between text-sm">
                                        <span>From: {tx.senderErupeeId}</span>
                                        <span>→</span>
                                        <span>To: {tx.receiverErupeeId}</span>
                                    </div>
                                    <div className="text-right text-sm font-medium text-green-600">
                                        Amount: ₹{tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {block.previousHash && (
                            <div className="text-xs text-gray-400 mt-2">
                                Previous Hash: {block.previousHash.slice(0, 16)}...
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {chain.length === 0 && (
                <div className="text-center text-gray-500 mt-4">
                    No blocks in the chain yet. Make some transactions!
                </div>
            )}
        </div>
    );
};

export default BlockchainViewer;
