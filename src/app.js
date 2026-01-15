const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const folderRoutes = require('./modules/folder/folder.routes');
const fileRoutes = require('./modules/file/file.routes');
const storageRoutes = require('./modules/storage/storage.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/storage', storageRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Storage Management API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

module.exports = app;