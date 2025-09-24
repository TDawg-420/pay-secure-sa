const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { fullName, idNumber, accountNumber, email, password } = req.body;

        // Basic validation
        if (![fullName, idNumber, accountNumber, email, password].every(Boolean)) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hash = await bcrypt.hash(password.trim(), 10);

        // Insert into DB
        await db.execute(
            'INSERT INTO users (fullName, idNumber, accountNumber, email, password) VALUES (?, ?, ?, ?, ?)',
            [fullName.trim(), idNumber.trim(), accountNumber.trim(), email.trim(), hash]
        );

        return res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);

        // More specific error messages
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'User already exists with this email or account number' });
        }

        return res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, rows[0].password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Send user info without password
        const { password: _, ...userWithoutPassword } = rows[0];

        // Include user ID explicitly
        res.json({
            message: 'Login successful!',
            userId: rows[0].id,    // <-- this is the user ID
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            'SELECT id, fullName, email, accountNumber FROM users WHERE id = ?',
            [id]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
