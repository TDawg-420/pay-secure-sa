import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/Dashboard.css';
import '../assets/forms.css';

const History = () => {
    const { userId } = useParams(); // get userId from URL
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/payment/history/${userId}`);
                if (!res.ok) throw new Error('Failed to fetch payment history');
                const data = await res.json();
                setPayments(data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId]);

    if (loading) return <p>Loading user payment history...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
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
