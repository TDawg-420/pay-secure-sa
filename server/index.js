const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment'); // <-- this line

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Mount routes
app.use('/api', authRoutes);
app.use('/api/payment', paymentRoutes); // <-- mount payments route

app.listen(5000, () => {
    console.log('API running on http://localhost:5000');
});
