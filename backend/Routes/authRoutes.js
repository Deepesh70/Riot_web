import express from 'express';
import { signup, login, profile } from '../Controllers/authController.js';
import { protect } from '../Middleware/authMiddleware.js';
import { validateSignup, validateLogin } from '../Middleware/validator.js';
import { authLimiter } from '../Middleware/security.js';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.get('/profile', protect, profile);

export default router;
