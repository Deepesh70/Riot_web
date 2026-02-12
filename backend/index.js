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
    try {
        const apiKey = 'a90297fb0e554032ac48ff512ced53e7';
        const query = req.query.q || 'gaming';
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});


app.get('/', (req, res) => {
    res.send('Riot Reimagined API is Live.');
});