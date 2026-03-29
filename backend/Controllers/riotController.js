import { kMeans } from '../Utils/kmeans.js';

export const getRiotAccount = async (req, res) => {
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
        res.status(500).json({ error: "Failed to fetch Riot Account data. API Key may be invalid." });
    }
};

export const getLolMatches = async (req, res) => {
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
};

export const getValMatches = async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; 
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
        return res.json(data.data);
    } catch (error) {
        console.error("Riot Val Matches Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getValAccount = async (req, res) => {
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
        res.json(data.data); 
    } catch (error) {
        console.error("Riot Val Account Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const analyzeSmurf = async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; 
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

        const matchData = await response.json();
        const matches = matchData.data;

        if (!matches || matches.length < 5) {
            return res.status(400).json({ message: "Not enough matches to perform ML analysis (Need at least 5)." });
        }

        const dataset = matches.map(match => {
            const mmrChange = Math.abs(match.mmr_change_to_last_game); 
            const elo = match.elo; 
            return [mmrChange, elo]; 
        });

        const kmeansResult = kMeans(dataset, 2);

        const centroid1 = kmeansResult.centroids[0];
        const centroid2 = kmeansResult.centroids[1];
        
        const highestVarianceCentroid = centroid1[0] > centroid2[0] ? centroid1 : centroid2;
        
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
};

export const analyzePlaystyle = async (req, res) => {
    try {
        const { name, tag } = req.params;
        const region = 'ap'; 
        const hDevKey = process.env.HENRIK_DEV_API_KEY ? process.env.HENRIK_DEV_API_KEY.trim() : '';
        
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

        const kmeansResult = kMeans(dataset, 2);

        const cluster0Count = kmeansResult.clusters[0].length;
        const cluster1Count = kmeansResult.clusters[1].length;
        
        let dominantCentroid;
        if (cluster0Count >= cluster1Count) {
            dominantCentroid = kmeansResult.centroids[0];
        } else {
            dominantCentroid = kmeansResult.centroids[1];
        }

        const avgKills = dominantCentroid[0];
        const avgDeaths = dominantCentroid[1];
        const avgAssists = dominantCentroid[2];
        const avgScore = dominantCentroid[3];
        const kdaRatio = (avgKills + avgAssists) / Math.max(1, avgDeaths);

        let persona = "Balanced Flex";
        let subText = "You adapt to whatever the team needs.";
        let hexColor = "#3b82f6"; 

        if (avgKills >= 18 && avgDeaths >= 15) {
            persona = "Aggressive Entry";
            subText = "First in, high impact, high risk. You create pure chaos.";
            hexColor = "#ef4444"; 
        } else if (avgAssists >= 8) {
            persona = "Tactical Support";
            subText = "The team's backbone. You enable your duelists to shine.";
            hexColor = "#10b981"; 
        } else if (avgKills >= 16 && avgDeaths <= 13) {
            persona = "Calculated Lurker";
            subText = "High survival rate. You strike from the shadows when they least expect it.";
            hexColor = "#a855f7"; 
        } else if (kdaRatio >= 2.0) {
            persona = "Clutch Master";
            subText = "Outstanding KDA. You always find a way to stay alive and secure the round.";
            hexColor = "#eab308"; 
        }

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
};
