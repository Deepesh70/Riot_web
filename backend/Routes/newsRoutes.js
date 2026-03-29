import express from 'express';
import { getNews } from '../Controllers/newsController.js';
import { cacheMiddleware } from '../Middleware/cacheMiddleware.js';

const router = express.Router();

// Cache news for 30 minutes
router.get('/', cacheMiddleware(1800), getNews);

export default router;
