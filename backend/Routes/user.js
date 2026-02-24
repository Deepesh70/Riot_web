import express from 'express';
import User from '../Models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, riotGameName, riotTagLine } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({ email, password: hashedPassword, name, riotGameName, riotTagLine });
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

        res.json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                riotGameName: user.riotGameName,
                riotTagLine: user.riotTagLine
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

router.get('/riot/account/:gameName/:tagLine', async (req, res) => {
    try {
        const { gameName, tagLine } = req.params;
        const apiKey = process.env.RIOT_API_KEY; 
        const region = 'asia'; 
        const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;

        const response = await fetch(url, {
            headers: {
                'X-Riot-Token': apiKey
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Error fetching data from Riot API' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Riot API Error:", error);
        // Don't leak internal API key errors, but provide a useful message
        res.status(500).json({ error: "Failed to fetch Riot Account data. API Key may be invalid." });
    }
});

router.get('/riot/matches/lol/:puuid', async (req, res) => {
    try {
        const { puuid } = req.params;
        const apiKey = process.env.RIOT_API_KEY;
        const region = 'asia';
        
        const matchesUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5`;
        
        const matchesResponse = await fetch(matchesUrl, { headers: { 'X-Riot-Token': apiKey } });
        if (!matchesResponse.ok) throw new Error('Failed to fetch match list');
        
        const matchIds = await matchesResponse.json();
        const matchDetailsPromises = matchIds.map(matchId => 
            fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
                headers: { 'X-Riot-Token': apiKey }
            }).then(res => res.json())
        );

        const matchesData = await Promise.all(matchDetailsPromises);
        return res.json(matchesData);
    } catch (error) {
        console.error("Riot LoL Matches Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/riot/matches/val/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; // Defaulting to AP
        const hDevKey = process.env.HENRIK_DEV_API_KEY;
        
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${name}/${tag}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': hDevKey,
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Val API Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        // The API returns { status, data: [...] }. We return the data array.
        return res.json(data.data);
    } catch (error) {
        console.error("Riot Val Matches Error:", error);
        res.status(500).json({ error: error.message });
    }
}); 

router.get('/riot/val/account/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;
        const hDevKey = process.env.HENRIK_DEV_API_KEY;
        
        const url = `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': hDevKey,
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Val Account Error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        res.json(data.data); // result usually in data.data
    } catch (error) {
        console.error("Riot Val Account Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;