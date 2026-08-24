import jwt from 'jsonwebtoken';
import User from '../Models/user.js';
import logger from '../Utils/logger.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, missing or malformed token',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token missing',
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET environment variable is not configured');
      return res.status(500).json({
        status: 'error',
        message: 'Authentication service misconfiguration',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized, user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Token validation failed', { error: error.message });
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized, token invalid or expired',
    });
  }
};

export default protect;
