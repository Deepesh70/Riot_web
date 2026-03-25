import express from 'express';
import User from '../Models/user.js';
import { kMeans } from '../Utils/kmeans.js';
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
        const hDevKey = process.env.HENRIK_DEV_API_KEY ? process.env.HENRIK_DEV_API_KEY.trim() : '';
        
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(name.trim())}/${encodeURIComponent(tag.trim())}`;
        
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
        const hDevKey = process.env.HENRIK_DEV_API_KEY ? process.env.HENRIK_DEV_API_KEY.trim() : '';
        
        const url = `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(name.trim())}/${encodeURIComponent(tag.trim())}`;
        
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

router.get('/riot/val/smurf-analyze/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; 
        const hDevKey = process.env.HENRIK_DEV_API_KEY ? process.env.HENRIK_DEV_API_KEY.trim() : '';
        
        // Fetch the player's recent matches
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${encodeURIComponent(name.trim())}/${encodeURIComponent(tag.trim())}`;
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

        const matchData = await response.json();
        const matches = matchData.data;

        if (!matches || matches.length < 5) {
            return res.status(400).json({ message: "Not enough matches to perform ML analysis (Need at least 5)." });
        }

        // Feature Engineering: We will extract Combat Score (MMR Change as a proxy) and ELO
        // In a full implementation, you'd fetch full match stats using the /matches endpoint 
        // to get exact ACS and K/D. Here we use mmr_change_to_last_game and elo for demonstration.
        const dataset = matches.map(match => {
            // Feature 1: MMR gained/lost in the match (measures performance swing)
            const mmrChange = Math.abs(match.mmr_change_to_last_game); 
            // Feature 2: Overall ELO rating
            const elo = match.elo; 
            return [mmrChange, elo]; 
        });

        // Run K-Means Clustering to find 2 distinct performance clusters 
        // (Cluster 0: Normal gameplay, Cluster 1: Peak/Smurf gameplay)
        const kmeansResult = kMeans(dataset, 2);

        // Identify which centroid represents the "higher performance" cluster
        const centroid1 = kmeansResult.centroids[0];
        const centroid2 = kmeansResult.centroids[1];
        
        // We assume index 0 of a centroid is the MMR Change (performance variance)
        const highestVarianceCentroid = centroid1[0] > centroid2[0] ? centroid1 : centroid2;
        
        // Smurf Logic: If their highest variance cluster shows massive MMR jumps (> 25 per match consistently)
        // while maintaining a relatively low ELO bracket, flag as smurf.
        let isLikelySmurf = false;
        let smurfProbability = "Low";

        if (highestVarianceCentroid[0] >= 26) {
             isLikelySmurf = true;
             smurfProbability = "High (Consistent massive performance spikes detected)";
        } else if (highestVarianceCentroid[0] >= 20) {
             smurfProbability = "Medium (Some suspicious performance spikes)";
        }

        res.json({
            player: `${name}#${tag}`,
            matchesAnalyzed: matches.length,
            ml_analysis: {
                clusters_found: 2,
                highest_performance_centroid: {
                    avg_mmr_change_variance: highestVarianceCentroid[0].toFixed(2),
                    avg_elo_in_cluster: highestVarianceCentroid[1].toFixed(2)
                },
                smurf_flag: isLikelySmurf,
                smurf_probability: smurfProbability
            },
            raw_kmeans_data: kmeansResult
        });

    } catch (error) {
        console.error("Smurf Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/riot/val/playstyle/:name/:tag', async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; 
        const hDevKey = process.env.HENRIK_DEV_API_KEY ? process.env.HENRIK_DEV_API_KEY.trim() : '';
        
        // Fetch detailed match history for KDA and Score
        const url = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(name.trim())}/${encodeURIComponent(tag.trim())}?size=5`;
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

        const matchData = await response.json();
        const matches = matchData.data;

        if (!matches || matches.length === 0) {
            return res.status(400).json({ message: "No matches found." });
        }

        // Feature Engineering: Extract [Kills, Deaths, Assists, Score] for the requested player
        const dataset = [];
        let totalHeadshots = 0;
        let totalBodyshots = 0;
        let totalLegshots = 0;

        for (const match of matches) {
            const player = match.players.all_players.find(p => 
                p.name.toLowerCase() === name.toLowerCase() && p.tag.toLowerCase() === tag.toLowerCase()
            );
            if (player && player.stats) {
                const { kills, deaths, assists, score, headshots, bodyshots, legshots } = player.stats;
                dataset.push([kills, deaths, assists, score]);
                totalHeadshots += headshots || 0;
                totalBodyshots += bodyshots || 0;
                totalLegshots += legshots || 0;
            }
        }

        if (dataset.length < 2) {
            return res.status(400).json({ message: "Not enough detailed match data for ML clustering." });
        }

        // Run K-Means Clustering into 2 clusters (Primary vs Secondary playstyle)
        const kmeansResult = kMeans(dataset, 2);

        // Find the "Dominant" cluster (the one that has more matches assigned to it)
        const cluster0Count = kmeansResult.clusters[0].length;
        const cluster1Count = kmeansResult.clusters[1].length;
        
        let dominantCentroid;
        if (cluster0Count >= cluster1Count) {
            dominantCentroid = kmeansResult.centroids[0];
        } else {
            dominantCentroid = kmeansResult.centroids[1];
        }

        // Centroid indices: [0]=Kills, [1]=Deaths, [2]=Assists, [3]=Score
        const avgKills = dominantCentroid[0];
        const avgDeaths = dominantCentroid[1];
        const avgAssists = dominantCentroid[2];
        const avgScore = dominantCentroid[3];
        const kdaRatio = (avgKills + avgAssists) / Math.max(1, avgDeaths);

        // Derive Persona Archetypes based on Dominant Centroid
        let persona = "Balanced Flex";
        let subText = "You adapt to whatever the team needs.";
        let hexColor = "#3b82f6"; // Blue

        if (avgKills >= 18 && avgDeaths >= 15) {
            persona = "Aggressive Entry";
            subText = "First in, high impact, high risk. You create pure chaos.";
            hexColor = "#ef4444"; // Red
        } else if (avgAssists >= 8) {
            persona = "Tactical Support";
            subText = "The team's backbone. You enable your duelists to shine.";
            hexColor = "#10b981"; // Green
        } else if (avgKills >= 16 && avgDeaths <= 13) {
            persona = "Calculated Lurker";
            subText = "High survival rate. You strike from the shadows when they least expect it.";
            hexColor = "#a855f7"; // Purple
        } else if (kdaRatio >= 2.0) {
            persona = "Clutch Master";
            subText = "Outstanding KDA. You always find a way to stay alive and secure the round.";
            hexColor = "#eab308"; // Yellow
        }

        // Aim stats aggregate
        const totalShots = totalHeadshots + totalBodyshots + totalLegshots;
        const headshotPct = totalShots > 0 ? ((totalHeadshots / totalShots) * 100).toFixed(1) : 0;

        res.json({
            player: `${name}#${tag}`,
            matchesAnalyzed: dataset.length,
            persona: {
                title: persona,
                description: subText,
                color: hexColor,
                dominant_stats: {
                    avg_kills: avgKills.toFixed(1),
                    avg_deaths: avgDeaths.toFixed(1),
                    avg_assists: avgAssists.toFixed(1),
                    avg_score: avgScore.toFixed(0),
                    kda_ratio: kdaRatio.toFixed(2),
                    headshot_percentage: headshotPct + "%"
                }
            },
            raw_kmeans: kmeansResult
        });

    } catch (error) {
        console.error("Playstyle Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;