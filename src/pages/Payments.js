import React, { useState } from 'react';
import '../assets/forms.css'; // minimal extra styles for full-page layout

const Payments = ({ user }) => {
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverBank: '',
        swiftCode: '',
        amount: '',
        currency: 'USD',
        purpose: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/payment/submit-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    amount: formData.amount,
                    currency: formData.currency,
                    recipientAccount: formData.receiverName,
                    recipientBank: formData.receiverBank,
                    swiftCode: formData.swiftCode,
                    provider: formData.receiverBank,
                    description: formData.purpose
                })
            });


            const data = await response.json();
            if (response.ok) {
                alert('Payment submitted successfully!');
                setFormData({
                    receiverName: '',
                    receiverBank: '',
                    swiftCode: '',
                    amount: '',
                    currency: 'USD',
                    purpose: ''
                });
            } else {
                alert(data.error || 'Payment failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Payment could not be submitted.');
        }
    };

    return (
        <div className="main-content full-page-form">
            <h3>International Payments</h3>
            <p>Initiate international transfers safely and securely.</p>

            <form onSubmit={handleSubmit} className="full-form">
                <label>Recipient Name</label>
                <input
                    type="text"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>Recipient Bank</label>
                <input
                    type="text"
                    name="receiverBank"
                    value={formData.receiverBank}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>SWIFT Code</label>
                <input
                    type="text"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                <label>Currency</label>
                <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="form-input"
                >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                </select>

                <label>Purpose of Payment</label>
                <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows="4"
                    className="form-input"
                />

                <button type="submit" className="form-button">
                    Submit Payment
                </button>
            </form>
        </div>
    );
};

export default Payments;
