// backend/server.js
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());




// Routes
app.use('/users', userRoutes); // Remove /api prefix
app.use('/doctors', doctorRoutes); // Remove /api prefix
app.use('/appointments', appointmentRoutes); // Remove /api prefix
app.use('/payments', paymentRoutes); // Remove /api prefix

// Home route
app.get('/', (req, res) => {
  res.send('Hospital App API is running');
});

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server is running on port 3000`);
});

module.exports = app;