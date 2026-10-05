// Add this near your middleware setup in server.js
const authRoutes = require('./modules/auth/authRoutes');
app.use('/api/v1/auth', authRoutes);