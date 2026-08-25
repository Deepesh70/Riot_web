import cacheService from '../Utils/cacheService.js';

export const getNews = async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ connection: false, message: 'Server configuration error' });
        }

        const query = req.query.q || 'gaming';
        const cacheKey = `news:query:${query.toLowerCase()}`;

        const data = await cacheService.getOrSet(cacheKey, async () => {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);
            if (!response.ok) {
                const err = new Error(`External API Error: ${response.status}`);
                err.status = response.status;
                throw err;
            }
            return await response.json();
        }, 900); // 15 minutes cache

        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(error.status || 500).json({ message: error.message || 'Error fetching news' });
    }
};

