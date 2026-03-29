import express from 'express';
import authRoutes from './authRoutes.js';
import riotRoutes from './riotRoutes.js';
import newsRoutes from './newsRoutes.js';
import valRoutes from './valRoutes.js';

const router = express.Router();

router.use('/users', authRoutes);
router.use('/users/riot', riotRoutes); // note: user module used to be /api/users, so it would hit /api/users/riot/... Wait.
// Actually, earlier in original index.js: app.use('/api/users', userRoutes);
// So in user.js: router.get('/riot/account/:gameName/:tagLine', ...) -> /api/users/riot/account...
// So this is correct!

router.use('/news', newsRoutes); // earlier app.get('/api/news') -> now hits /api/news
router.use('/', valRoutes); // earlier app.get('/api/esports/schedule') -> hits /api/esports/schedule

export default router;
