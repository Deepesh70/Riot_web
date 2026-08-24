import express from 'express';
import authRoutes from './authRoutes.js';
import riotRoutes from './riotRoutes.js';
import newsRoutes from './newsRoutes.js';
import valRoutes from './valRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

// Mount health and readiness checks
router.use('/', healthRoutes);

// Feature routes
router.use('/users', authRoutes);
router.use('/users/riot', riotRoutes);
router.use('/news', newsRoutes);
router.use('/', valRoutes);

export default router;
