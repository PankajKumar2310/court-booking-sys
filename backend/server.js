const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/coaches', require('./routes/coachRoutes'));
app.use('/api/pricing-rules', require('./routes/pricingRuleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
