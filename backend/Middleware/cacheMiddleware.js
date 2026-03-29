import redisClient from '../Utils/redisClient.js';

export const cacheMiddleware = (durationInSeconds) => {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = req.originalUrl || req.url;

        try {
            // 1. Ask Redis if it has data for this URL pattern
            // (Note: everything in Redis is a string, so data comes back stringified)
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                // We got a HIT! Parse it back to JSON and send it instantly.
                return res.json(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error("Redis Get Error:", error);
            // If Redis fails, we just silently continue to the normal API fetch
        }

        // 2. We got a MISS. Data isn't in Redis yet. 
        // We need to intercept the final response the controller makes so we can save it.
        const originalSend = res.json;
        res.json = (body) => {
            res.json = originalSend;

            if (res.statusCode >= 200 && res.statusCode < 300) {
                // 3. Save the successfully fetched data into Redis
                // 'EX' sets an expiration timer (in seconds)
                // We stringify the JSON body because Redis stores text.
                redisClient.set(key, JSON.stringify(body), {
                    EX: durationInSeconds
                }).catch(err => console.error("Redis Set Error:", err));
            }

            return res.json(body);
        };

        next();
    };
};
