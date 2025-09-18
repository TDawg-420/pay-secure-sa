const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// POST /api/payment/submit-payment
router.post('/submit-payment', async (req, res) => {
    try {
        const { userId, amount, currency, recipientAccount, recipientBank, swiftCode, provider, description } = req.body;

        if (![userId, amount, currency, recipientAccount, recipientBank, swiftCode, provider].every(Boolean)) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await db.execute(
            `INSERT INTO payments 
            (userId, amount, currency, recipientAccount, recipientBank, swiftCode, provider, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, amount, currency, recipientAccount, recipientBank, swiftCode, provider, description || null]
        );

        res.status(201).json({ message: 'Payment submitted successfully' });
    } catch (err) {
        console.error('Payment submission error:', err);
        res.status(500).json({ error: 'Failed to submit payment' });
    }
});

// GET /api/payment/history/:userId
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await db.execute(
            `SELECT id, amount, currency, recipientAccount, recipientBank, swiftCode, provider, description, status, createdAt 
             FROM payments 
             WHERE userId = ? 
             ORDER BY createdAt DESC`,
            [userId]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching payment history:', err);
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

module.exports = router;
