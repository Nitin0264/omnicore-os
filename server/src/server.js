// Add this near your middleware setup in server.js
const authRoutes = require('./modules/auth/authRoutes');
app.use('/api/v1/auth', authRoutes);

const projectRoutes = require('./modules/projects/projectRoutes');
app.use('/api/v1/projects', projectRoutes);

// Add these imports at the top of server.js
const http = require('http');
const { Server } = require('socket.io');

// Wrap Express app with HTTP server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production frontend URL later
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handler for multi-tenant rooms
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Clients join a specific tenant room upon authentication
  socket.on('join_tenant', (tenantId) => {
    socket.join(`tenant_${tenantId}`);
    console.log(`[Socket] User joined room: tenant_${tenantId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// Export io so modules can trigger real-time broadcasts
app.set('io', io);

// Replace app.listen with server.listen
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  await connectRedis();
  
  server.listen(PORT, () => {
    console.log(`[Server] OmniCore OS running on port ${PORT}`);
  });
};

startServer();

const helpdeskRoutes = require('./modules/helpdesk/helpdeskRoutes');
app.use('/api/v1/helpdesk', helpdeskRoutes);