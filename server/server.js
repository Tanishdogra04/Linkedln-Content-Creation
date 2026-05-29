const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment configurations
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Base Route for Checking API Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// App Feature Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/style', require('./routes/style'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/research', require('./routes/research'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/analytics', require('./routes/analytics'));

// Serve frontend in production
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LinkedIn Content Creation Agent API Running'
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`LinkedIn Content Creation Agent Server running on port ${PORT}`);
});
