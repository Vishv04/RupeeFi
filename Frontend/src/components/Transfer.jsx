import React, { useState } from 'react';
import axios from 'axios';

const Transfer = ({ userErupeeId }) => { // Pass from auth
    const [receiverErupeeId, setReceiverErupeeId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleTransfer = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/blockchain/transfer`, {
                senderErupeeId: userErupeeId,
                receiverErupeeId,
                amount: parseInt(amount),
            });
            setMessage(response.data.message);
            setReceiverErupeeId('');
            setAmount('');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Transfer failed');
        }
    };

    return (
        <div className="transfer-container">
            <h2>Transfer e-Rupee</h2>
            {message && <p className="transfer-message">{message}</p>}
            <div className="transfer-form">
                <input
                    type="text"
                    placeholder="Receiver e-Rupee ID"
                    value={receiverErupeeId}
                    onChange={(e) => setReceiverErupeeId(e.target.value)}
                    className="transfer-input"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="transfer-input"
                    min="0"
                />
                <button
                    onClick={handleTransfer}
                    className="transfer-button"
                    disabled={!receiverErupeeId || !amount}
                >
                    Send
                </button>
            </div>
            {message && <p className="transfer-message">{message}</p>}
        </div>
    );
};

export default Transfer;
