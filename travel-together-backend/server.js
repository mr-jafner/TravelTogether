const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database and routes
const database = require('./database/init.js');
const tripsRouter = require('./routes/trips.js');
const ratingsRouter = require('./routes/ratings.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'https://jafner.com', 'http://jafner.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TravelTogether API'
  });
});

// API routes
app.use('/api/trips', tripsRouter);
app.use('/api', ratingsRouter);

// TravelTogether-prefixed API routes for frontend served from /traveltogether/
app.use('/traveltogether/api/trips', tripsRouter);
app.use('/traveltogether/api', ratingsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`TravelTogether API server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('API endpoints:');
      console.log('  GET    /api/trips           - List all trips');
      console.log('  GET    /api/trips/:id       - Get single trip');
      console.log('  POST   /api/trips           - Create new trip');
      console.log('  PUT    /api/trips/:id       - Update trip');
      console.log('  DELETE /api/trips/:id       - Delete trip');
      console.log('  POST   /api/trips/:id/activities/:actId/rate - Rate activity');
      console.log('  POST   /api/trips/:id/restaurants/:restId/rate - Rate restaurant');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;