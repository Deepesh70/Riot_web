import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './Routes/user.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// User Routes
app.use('/api/users', userRoutes);

// Database Connection Logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in dark-mode on port http://localhost:${PORT}`);
    });
});

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Riot Reimagined API is Live.');
});