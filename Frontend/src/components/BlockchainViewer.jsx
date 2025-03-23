import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlockchainViewer = () => {
    const [chain, setChain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedBlock, setExpandedBlock] = useState(null);

    useEffect(() => {
        const fetchChain = async () => {
            try {
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Not authenticated');
                    setLoading(false);
                    return;
                }

                console.log('Fetching blockchain with token:', token);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/blockchain/chain`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                console.log('Blockchain response:', response.data);
                setChain(response.data);
            } catch (err) {
                console.error('Error fetching blockchain:', err);
                setError(err.response?.data?.error || 'Failed to fetch blockchain data');
            } finally {
                setLoading(false);
            }
        };

        fetchChain();
        const interval = setInterval(fetchChain, 5000); // Auto-refresh every 5s
        return () => clearInterval(interval);
    }, []);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-lg text-gray-600">Loading blockchain data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 mt-18">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Blockchain Explorer</h1>
            
            <div className="space-y-6">
                {chain.map((block, index) => (
                    <div key={block.hash} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div 
                            className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => setExpandedBlock(expandedBlock === index ? null : index)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        Block {block.index}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {formatTimestamp(block.timestamp)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">
                                        {block.transactions.length} transactions
                                    </span>
                                    <svg 
                                        className={`w-5 h-5 transform transition-transform ${expandedBlock === index ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        {expandedBlock === index && (
                            <div className="p-4 border-t border-gray-200">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Hash: </span>
                                        <span className="font-mono">{block.hash}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Previous Hash: </span>
                                        <span className="font-mono">{block.previousHash}</span>
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                    {block.transactions.map((tx, txIndex) => (
                                        <div key={txIndex} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        From: {tx.senderErupeeId}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        To: {tx.receiverErupeeId}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600">
                                                        {formatAmount(tx.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatTimestamp(tx.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainViewer;
