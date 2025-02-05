// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Connect Database
connectDB()
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if database connection fails
  });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);


// CORS Configuration (Corrected and More Specific)
const allowedOrigins = [
  'http://localhost:5173', // Development
  'http://localhost:3000', //If you're using create-react-app
  'https://quickmed-frontend.onrender.com', // Production
  process.env.FRONTEND_URL // In case you have other environments
].filter(Boolean); // Remove any undefined/empty values

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // VERY IMPORTANT for sending cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly list allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Explicitly list allowed headers
  exposedHeaders: ['set-cookie'], // If you're setting cookies from the server
  maxAge: 86400 // Cache CORS preflight response for 24 hours
};

app.use(cors(corsOptions)); // CORS MUST be before other routes

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Adjust as needed
  crossOriginEmbedderPolicy: false, // Adjust as needed
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...allowedOrigins], // Important: Include your allowed origins here too
      frameSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust as needed
      styleSrc: ["'self'", "'unsafe-inline'"], // Adjust as needed
      imgSrc: ["'self'", "data:", "https:"], // Adjust as needed
    }
  }
}));


// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Development Logging (Conditional)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    console.log('Body:', JSON.stringify(req.body, null, 2)); // Log request body
    next();
  });
}


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pharmacies', require('./routes/pharmacyRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));

// Error handling middleware (Improved)
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Specific error handling (example)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed', origin: req.headers.origin });
  }
    if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate key error',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Generic error handling (for production)
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message, // Don't send stack trace in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development
  });
});

// 404 Handler (Keep this at the very end)
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
  console.log('Environment:', process.env.NODE_ENV);
});

// Graceful Shutdown (Important)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});


module.exports = app; // For testing