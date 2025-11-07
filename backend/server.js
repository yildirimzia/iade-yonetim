const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');
const returnsRoutes = require('./routes/returns');
const inventoryRoutes = require('./routes/inventory');
const shipmentsRoutes = require('./routes/shipments');
const uploadRoutes = require('./routes/upload');

// Import database
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'İade Yönetim Sistemi API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/upload', uploadRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'İade Yönetim Sistemi API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      returns: '/api/returns',
      inventory: '/api/inventory',
      shipments: '/api/shipments'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Sunucu hatası'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ===================================');
  console.log(`✅ Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'iade_yonetim'}`);
  console.log('🔗 Endpoints:');
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - API: http://localhost:${PORT}/api`);
  console.log('===================================\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n👋 Server kapatılıyor...');
  await pool.end();
  process.exit(0);
});
