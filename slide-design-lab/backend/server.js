const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());

// Import routes
const slideGenerationRoutes = require('./routes/slideGeneration');
const trainingDataRoutes = require('./routes/trainingData');
const analyticsRoutes = require('./routes/analytics');
const slidevRoutes = require('./routes/slidev');
const templatesRoutes = require('./routes/templates');

// Routes
app.use('/api/generate', slideGenerationRoutes);
app.use('/api/training', trainingDataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/slidev', slidevRoutes);
app.use('/api/templates', templatesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Slide Design Lab API',
    port: PORT,
    integration: 'ready-for-main-app'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧪 Slide Design Lab API running on port ${PORT}`);
  console.log(`🔬 Training data collection active`);
  console.log(`🔗 Integration endpoint: http://localhost:${PORT}/api/analytics/export-for-main-app`);
});

module.exports = app;