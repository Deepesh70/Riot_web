import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import logger from '../Utils/logger.js';

/**
 * Configure Helmet with secure headers
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.henrikdev.xyz", "https://*.api.riotgames.com", "https://valorant-api.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Rate Limiter for standard API endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
});

/**
 * Strict Rate Limiter for sensitive Auth endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

/**
 * Production-ready CORS configuration
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://riot-web-ten.vercel.app'
];

if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  allowedOrigins.push(...envOrigins);
}

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow mobile apps / curl / same-origin

  try {
    const parsed = new URL(origin);
    // Allow localhost / loopback
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return true;
    }
    // Strict exact matching or verified vercel preview deployments
    if (allowedOrigins.includes(origin)) {
      return true;
    }
    // Only allow verified *.vercel.app domain suffix strictly
    if (parsed.hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch (err) {
    logger.warn('Failed to parse origin header', { origin, error: err.message });
    return false;
  }
  return false;
};

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    logger.warn('CORS blocked request', { origin });
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
