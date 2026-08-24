import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import mainRoutes from './Routes/index.js';
import logger from './Utils/logger.js';
import { helmetMiddleware, corsMiddleware, apiLimiter } from './Middleware/security.js';
import { errorHandler, notFoundHandler } from './Middleware/errorHandler.js';

const app = express();

// Trust reverse proxy (e.g., Vercel / Nginx) for rate-limiting & secure headers
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(apiLimiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
    });
  });
  next();
});

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Riot ReImagined API',
    version: '1.0.0',
    status: 'online',
    health: '/api/health',
  });
});

// API Routes
app.use('/api', mainRoutes);

// Error Handling Stack
app.use(notFoundHandler);
app.use(errorHandler);

// Database Connection & Server Startup
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn('MONGO_URI is not set. Database features will be unavailable.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected successfully', { host: conn.connection.host });
  } catch (error) {
    logger.error('MongoDB Connection Error', { error: error.message });
    // In production we avoid hard exit on cold starts so health checks can still report degradation
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Continuing execution in degraded state.');
    } else {
      process.exit(1);
    }
  }
};

const PORT = process.env.PORT || 5000;
let server;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, { env: process.env.NODE_ENV || 'development' });
    });
  });
}

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await mongoose.connection.close(false);
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
