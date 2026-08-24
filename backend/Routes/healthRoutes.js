import express from 'express';
import mongoose from 'mongoose';
import redisClient from '../Utils/redisClient.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const startTime = Date.now();

  // Check MongoDB Status
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const mongoState = mongoose.connection.readyState;
  const mongoStatus = dbStatusMap[mongoState] || 'unknown';

  // Check Redis Status
  let redisStatus = 'disabled';
  if (redisClient) {
    try {
      await redisClient.ping();
      redisStatus = 'connected';
    } catch (err) {
      redisStatus = 'error';
    }
  }

  const isHealthy = mongoState === 1;
  const responsePayload = {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: Date.now() - startTime,
    services: {
      database: {
        status: mongoStatus,
        healthy: mongoState === 1,
      },
      cache: {
        status: redisStatus,
        healthy: redisStatus === 'connected' || redisStatus === 'disabled',
      },
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  };

  res.status(isHealthy ? 200 : 503).json(responsePayload);
});

router.get('/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: 'ready' });
  }
  return res.status(503).json({ status: 'not ready', message: 'Database not connected' });
});

export default router;
