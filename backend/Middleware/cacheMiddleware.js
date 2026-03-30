import redisClient from '../Utils/redisClient.js';

export const cacheMiddleware = (durationInSeconds) => {
    return async (req, res, next) => {
        // Only cache GET requests, and only if Redis is available
        if (req.method !== 'GET' || !redisClient) {
            return next();
        }

        const key = req.originalUrl || req.url;

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                // Cache HIT — return instantly
                // console.log(`[CACHE HIT] ${key}`);
                return res.json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
            }

            // console.log(`[CACHE MISS] ${key}`);
        } catch (error) {
            console.error("Redis Get Error:", error.message);
            // If Redis fails, silently fall through to the real API
        }

        // Cache MISS — intercept the response to store it in Redis
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            res.json = originalJson;

            if (res.statusCode >= 200 && res.statusCode < 300 && redisClient) {
                redisClient.set(key, JSON.stringify(body), { ex: durationInSeconds })
                    .then(() => console.log(`[CACHE SET] ${key} (ttl=${durationInSeconds}s)`))
                    .catch(err => console.error("Redis Set Error:", err.message));
            }

            return originalJson(body);
        };

        next();
    };
};
