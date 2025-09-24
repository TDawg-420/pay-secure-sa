// server/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const path = require('path');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

// === Middleware ===
app.use(cors({
    origin: 'https://localhost:3000', // React dev server
    credentials: true
}));
app.use(express.json());

// === API routes ===
app.use('/api', authRoutes);
app.use('/api/payment', paymentRoutes);

// === Serve React build ===
const buildPath = path.join(__dirname, '../build');
if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    // catch-all for React routing (exclude /api)
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// === SSL setup ===
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert.cer')) // use .cer or .pem depending on your file
};

const HTTPS_PORT = 5001;

// Start HTTPS server only
https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`✅ HTTPS server running at https://localhost:${HTTPS_PORT}`);
});
