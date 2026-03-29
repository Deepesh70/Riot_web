import express from 'express';
import { getEsportsSchedule, getAgents, getAgentById, getMaps } from '../Controllers/valorantController.js';
import { cacheMiddleware } from '../Middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/valorant/agents', cacheMiddleware(86400), getAgents);
router.get('/valorant/agents/:id', cacheMiddleware(86400), getAgentById);
router.get('/valorant/maps', cacheMiddleware(86400), getMaps);

router.get('/esports/schedule', cacheMiddleware(3600), getEsportsSchedule);

export default router;
