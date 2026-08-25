import logger from '../Utils/logger.js';

/**
 * Centralized API Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error('Unhandled server error', {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      statusCode,
      error: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });
  } else {
    logger.warn('Client request error', {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      error: err.message,
    });
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: statusCode === 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected server error occurred.' 
      : message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && statusCode >= 500 && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
