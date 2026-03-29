export const getNews = async (req, res) => {
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
};
