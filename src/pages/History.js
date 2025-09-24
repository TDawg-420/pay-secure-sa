import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/Dashboard.css';
import '../assets/forms.css';

const History = () => {
    const { userId } = useParams();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001';

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`${API_URL}/api/payment/history/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!res.ok) {
                    const text = await res.text();
                    let data;
                    try { data = JSON.parse(text); } catch { data = { error: text }; }
                    throw new Error(data.error || 'Failed to fetch payment history');
                }

                const data = await res.json();
                setPayments(data);
            } catch (err) {
                console.error('Error fetching user history:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, API_URL]);

    if (loading) return <p>Loading user payment history...</p>;
    if (error) return <p style={{ color: 'orange' }}>Error: {error}</p>;

    return (
        <div className="dashboard-history-container">
            <h3>Payment History</h3>
            {payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <table className="payment-history-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Recipient</th>
                            <th>Bank</th>
                            <th>Amount</th>
                            <th>Currency</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.recipientAccount}</td>
                                <td>{payment.recipientBank}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.status}</td>
                                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default History;
