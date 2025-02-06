require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB()
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); 
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pharmacies', require('./routes/pharmacyRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ message: err.message });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Start Server on any available port
const PORT = process.env.PORT || 0; // 0 means any available port
const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`Server running on port ${address.port}`);
});

module.exports = app; // For testing