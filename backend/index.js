import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './Routes/user.js';

dotenv.config();

const app = express();


app.use(cors());
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
        console.log(`Server running in dark-mode on port http://localhost:${PORT}`);
    });
});


app.get('/api/news', async (req, res) => {
    console.log('GET /api/news hit with query:', req.query.q);
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            console.error('NEWS_API_KEY is missing in .env');
            return res.status(500).json({ connection: false, message: 'Server configuration error' });
        }

        const query = req.query.q || 'gaming';
        console.log(`Fetching news for: ${query}`);

        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);

        if (!response.ok) {
            console.error(`NewsAPI responded with status: ${response.status}`);
            return res.status(response.status).json({ message: 'External API Error' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

app.get('/api/esports/schedule', async (req, res) => {
    try {
        const apiKey = process.env.HENRIK_DEV_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'HENRIK_DEV_API_KEY is missing in .env' });
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
        console.error('Error fetching esports schedule:', error);
        res.status(500).json({ message: 'Error fetching esports schedule' });
    }
});

app.get('/', (req, res) => {
    res.send('Riot Reimagined API is Live.');
});