import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import mainRoutes from './Routes/index.js';

dotenv.config({ path: new URL('./.env', import.meta.url) });

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://riot-web-ten.vercel.app'
];

if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
    allowedOrigins.push(...envOrigins);
}

const isAllowedOrigin = (origin) => {
    if (!origin) return true;

    try {
        const { hostname } = new URL(origin);

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return true;
        }
    } catch (error) {
        return false;
    }

    return origin.includes('vercel.app') || allowedOrigins.includes(origin);
};

app.use(cors({
    origin: function (origin, callback) {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        const msg = `CORS blocked for origin: ${origin}`;
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', mainRoutes);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});



app.get('/', (req, res) => {
    res.send('Riot Reimagined API is Live.');
});

export default app;
