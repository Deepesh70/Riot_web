import express from 'express';
import User from '../Models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({ email, password: hashedPassword, name });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

export default router;