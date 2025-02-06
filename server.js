require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Added CORS
const connectDB = require('./config/db');

const app = express();
const inventoryRoutes = require("./routes/inventoryRoutes");
// Connect Database
connectDB()
  .then(() => console.log('✅ Database connected'))
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1); 
  });

// Middleware
app.use(cors({ origin: 'http://localhost:5175', credentials: true })); // Enable CORS for frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes


app.use("/api/inventory", inventoryRoutes);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pharmacies', require('./routes/pharmacyRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack); // Log stack trace for debugging
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app; // For testing
