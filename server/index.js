const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const guideRoutes = require('./routes/guideRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const publicRoutes = require('./routes/publicRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const olympicsRoutes = require('./routes/olympicsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const growthRoutes = require('./routes/growthRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const shopRoutes = require('./routes/shopRoutes');
const academyRoutes = require('./routes/academyRoutes');
const agoraRoutes = require('./routes/agoraRoutes');
const db = require('./utils/db');
const setupRandomChat = require('./sockets/randomChat');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // API Logging

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased for dev testing
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5001',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});
app.set('io', io);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// API Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/olympics', olympicsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/agora', agoraRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 [Unhandled Error]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ZilliGO API is running!', timestamp: new Date().toISOString() });
});

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // Catch-all: serve React app for any non-API route
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'ZilliGO API is running in development mode. Frontend at http://localhost:3001' });
  });
}

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      if (!data.isSystem) {
        await db.query(`
          INSERT INTO live_chat_messages (room_id, sender_id, sender_name, avatar, text, is_system)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [data.roomId, data.sender || 'anon', data.senderName, data.avatar, data.text, false]);
      }
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('ask_question', async (data) => {
    try {
      const res = await db.query(`
        INSERT INTO live_questions (room_id, asker_id, asker_name, question)
        VALUES ($1, $2, $3, $4) RETURNING *
      `, [data.roomId, data.askerId || 'anon', data.askerName, data.question]);
      
      io.to(data.roomId).emit('new_question', res.rows[0]);
    } catch (err) {
      console.error('Error saving question:', err);
    }
  });

  socket.on('emergency_alert', (data) => {
    console.log('🚨 EMERGENCY ALERT:', data);
    io.emit('admin_alert', {
      ...data,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('tour_ended', async (data) => {
    console.log(`Live Tour Ended: ${data.roomId}`);
    io.to(data.roomId).emit('tour_ended');
    // We could delete the live_stream from DB here, but keeping it for historical purposes is better
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Setup anonymous random chat signaling
setupRandomChat(io);

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  server.listen(PORT, () => {
    console.log(`🚀 ZilliGO Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
