import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const res = await fetch('https://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });


            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Login failed');

            // ✅ Store user ID for dashboard use
            localStorage.setItem('userId', data.userId);

            setMessage('✅ Login successful! Redirecting...');
            setTimeout(() => navigate(`/dashboard/${data.userId}`), 1000); // pass userId in URL
        } catch (err) {
            setMessage(`❌ ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} noValidate>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={submitting}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={submitting}
                />
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
                {message && <p style={{ color: message.includes('successful') ? '#0f0' : 'orange' }}>{message}</p>}
            </form>
        </div>
    );
}
