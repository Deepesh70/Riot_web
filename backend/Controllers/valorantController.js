import cacheService from '../Utils/cacheService.js';

export const getEsportsSchedule = async (req, res) => {
    try {
        const apiKey = process.env.HENRIK_DEV_API_KEY;
        if (!apiKey) {
            return res.status(503).json({ message: 'HENRIK_DEV_API_KEY is not configured on the server' });
        }

        const region = req.query.region || '';
        const league = req.query.league || '';
        const cacheKey = `valorant:esports:${region}:${league}`;

        const data = await cacheService.getOrSet(cacheKey, async () => {
            let url = 'https://api.henrikdev.xyz/valorant/v1/esports/schedule';
            const params = new URLSearchParams();
            if (region) params.append('region', region);
            if (league) params.append('league', league);
            const qs = params.toString();
            if (qs) url += `?${qs}`;

            const response = await fetch(url, {
                headers: { 'Authorization': apiKey }
            });

            if (!response.ok) {
                const err = new Error(`HenrikDev API error: ${response.status}`);
                err.status = response.status;
                throw err;
            }

            return await response.json();
        }, 600); // 10 minutes cache

        res.json(data);
    } catch (error) {
        console.error('Error fetching esports schedule:', error.message);
        res.status(error.status || 500).json({ message: error.message || 'Error fetching esports schedule' });
    }
};

export const getAgents = async (req, res) => {
    try {
        const data = await cacheService.getOrSet('valorant:agents:all', async () => {
            const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
            if (!response.ok) throw new Error('Valorant API error');
            return await response.json();
        }, 86400); // 24 hours cache

        res.json(data);
    } catch (error) {
        console.error('Error fetching agents:', error.message);
        res.status(500).json({ message: 'Error fetching agents' });
    }
};

export const getAgentById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await cacheService.getOrSet(`valorant:agent:${id}`, async () => {
            const response = await fetch(`https://valorant-api.com/v1/agents/${id}`);
            if (!response.ok) throw new Error('Valorant API error');
            return await response.json();
        }, 86400); // 24 hours cache

        res.json(data);
    } catch (error) {
        console.error('Error fetching agent:', error.message);
        res.status(500).json({ message: 'Error fetching agent' });
    }
};

export const getMaps = async (req, res) => {
    try {
        const data = await cacheService.getOrSet('valorant:maps:standard', async () => {
            const response = await fetch('https://valorant-api.com/v1/maps');
            if (!response.ok) throw new Error('Valorant API error');
            const json = await response.json();
            const standardMaps = json.data.filter(m => m.tacticalDescription && m.displayIcon);
            return { status: json.status, data: standardMaps };
        }, 86400); // 24 hours cache

        res.json(data);
    } catch (error) {
        console.error('Error fetching maps:', error.message);
        res.status(500).json({ message: 'Error fetching maps' });
    }
};

