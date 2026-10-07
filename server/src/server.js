require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Initialize Express & HTTP Server for WebSockets
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] 
  }
});

// Connect to MongoDB
connectDB();

// ------------------------------------
// Security & Utility Middleware
// ------------------------------------
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(mongoSanitize({
  replaceWith: '_'
}));
app.use(morgan('dev')); // HTTP request logger

// Make Socket.io instance accessible inside controllers via req.app.get('io')
app.set('io', io);

// ------------------------------------
// API Routes Mounting
// ------------------------------------
// Auth & Tenant Routes (Active)
const authRoutes = require('./modules/auth/authRoutes');
app.use('/api/v1/auth', authRoutes);

// Uncomment these as you create their route files:
// const projectRoutes = require('./modules/projects/projectRoutes');
// app.use('/api/v1/projects', projectRoutes);

// const inventoryRoutes = require('./modules/inventory/inventoryRoutes');
// app.use('/api/v1/inventory', inventoryRoutes);

// const helpdeskRoutes = require('./modules/helpdesk/helpdeskRoutes');
// app.use('/api/v1/helpdesk', helpdeskRoutes);

// const aiRoutes = require('./modules/ai/aiRoutes');
// app.use('/api/v1/ai', aiRoutes);

// ------------------------------------
// Health Check Root Route
// ------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'OmniCore OS Enterprise API Gateway operational',
    timestamp: new Date().toISOString()
  });
});

// ------------------------------------
// Global Error Handler Middleware
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// ------------------------------------
// Socket.io Real-Time Connection Handling
// ------------------------------------
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Join a tenant-specific room for multi-tenant data isolation
  socket.on('join_tenant', (tenantId) => {
    socket.join(`tenant_${tenantId}`);
    console.log(`[Socket] Client ${socket.id} joined tenant room: tenant_${tenantId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ------------------------------------
// Start Server
// ------------------------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Server] OmniCore OS running on port ${PORT}`);
});