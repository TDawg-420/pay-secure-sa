// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Routes, Route, Link } from 'react-router-dom';
import '../assets/Dashboard.css';

import Payments from './Payments';
import History from './History';
import Settings from './Settings';
import Support from './Support';

const Dashboard = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use .env variable OR fallback to 5001
    const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001';
    console.log('API_URL:', API_URL);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${API_URL}/api/users/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // if you’re using cookies
                });

                if (!res.ok) {
                    const text = await res.text();
                    let data;
                    try { data = JSON.parse(text); } catch { data = { error: text }; }
                    throw new Error(data.error || 'Failed to fetch user');
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, API_URL]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <nav className="navbar">
                <Link to={`/dashboard/${userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Pay Secure SA
                </Link>
                <ul className="nav-links">
                    <li><Link to={`/dashboard/${userId}/payments`}>International Payments</Link></li>
                    <li><Link to={`/dashboard/${userId}/history`}>Payment History</Link></li>
                    <li><Link to={`/dashboard/${userId}/settings`}>Account Settings</Link></li>
                    <li><Link to={`/dashboard/${userId}/support`}>Support</Link></li>
                    <li><a href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route
                        index
                        element={
                            <div className="dashboard-intro">
                                <h2>Welcome back, {user.fullName}!</h2>
                                <p>Email: {user.email}</p>
                                <p>Account Number: {user.accountNumber}</p>
                                <p>Select an option from the menu above to get started.</p>
                            </div>
                        }
                    />
                    <Route path="payments" element={<Payments user={user} />} />
                    <Route path="history" element={<History />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
