import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './Routes/user.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);

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

app.get('/api/news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ connection: false, message: 'Server configuration error' });
        }

        const query = req.query.q || 'gaming';
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);

        if (!response.ok) {
            return res.status(response.status).json({ message: 'External API Error' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

app.get('/api/esports/schedule', async (req, res) => {
    try {
        const apiKey = process.env.HENRIK_DEV_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'HENRIK_DEV_API_KEY is missing' });
        }

        let url = 'https://api.henrikdev.xyz/valorant/v1/esports/schedule';
        const params = new URLSearchParams();
        if (req.query.region) params.append('region', req.query.region);
        if (req.query.league) params.append('league', req.query.league);
        const qs = params.toString();
        if (qs) url += `?${qs}`;

        const response = await fetch(url, {
            headers: { 'Authorization': apiKey }
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: `HenrikDev API error: ${response.status}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching esports schedule:', error.message);
        res.status(500).json({ message: 'Error fetching esports schedule' });
    }
});

app.get('/', (req, res) => {
    res.send('Riot Reimagined API is Live.');
});

export default app;