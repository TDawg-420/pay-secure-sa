import React, { useState } from 'react';
import '../App.css';

export default function RegisterPage() {
    const [form, setForm] = useState({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full Name is required';
        if (!form.idNumber.trim()) errs.idNumber = 'ID Number is required';
        if (!form.accountNumber.trim()) errs.accountNumber = 'Account Number is required';
        if (!emailRegex.test(form.email)) errs.email = 'Invalid email address';
        if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        return errs;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setSubmitting(true);
        setErrors({});
        setMessage('');

        try {
            const { fullName, idNumber, accountNumber, email, password } = form;

            const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:5001';

            const res = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, idNumber, accountNumber, email, password }),
            });


            // Try to read as JSON first
            let data;
            try {
                data = await res.json();
            } catch {
                const text = await res.text();
                throw new Error('Invalid server response: ' + text);
            }

            if (!res.ok) throw new Error(data.error || 'Registration failed');

            setMessage('✅ Registration successful! You can now log in.');
            setForm({
                fullName: '',
                idNumber: '',
                accountNumber: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
        } catch (err) {
            console.error('Registration error:', err);
            setMessage(`❌ ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                {Object.keys(form).map((key) => (
                    <div key={key}>
                        <input
                            type={key.toLowerCase().includes('password') ? 'password' : 'text'}
                            name={key}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={form[key]}
                            onChange={handleChange}
                            disabled={submitting}
                            autoComplete="off"
                        />
                        {errors[key] && <small style={{ color: 'orange' }}>{errors[key]}</small>}
                    </div>
                ))}
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Registering...' : 'Register'}
                </button>
                {message && (
                    <p style={{ marginTop: '1rem', color: message.includes('successful') ? '#0f0' : 'orange' }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
