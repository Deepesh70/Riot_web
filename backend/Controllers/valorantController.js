export const getEsportsSchedule = async (req, res) => {
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
};

export const getAgents = async (req, res) => {
    try {
        const response = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
        if (!response.ok) return res.status(response.status).json({ message: 'Valorant API error' });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching agents:', error.message);
        res.status(500).json({ message: 'Error fetching agents' });
    }
};

export const getAgentById = async (req, res) => {
    try {
        const response = await fetch(`https://valorant-api.com/v1/agents/${req.params.id}`);
        if (!response.ok) return res.status(response.status).json({ message: 'Valorant API error' });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching agent:', error.message);
        res.status(500).json({ message: 'Error fetching agent' });
    }
};

export const getMaps = async (req, res) => {
    try {
        const response = await fetch('https://valorant-api.com/v1/maps');
        if (!response.ok) return res.status(response.status).json({ message: 'Valorant API error' });
        const data = await response.json();
        const standardMaps = data.data.filter(m => m.tacticalDescription && m.displayIcon);
        res.json({ status: data.status, data: standardMaps });
    } catch (error) {
        console.error('Error fetching maps:', error.message);
        res.status(500).json({ message: 'Error fetching maps' });
    }
};
