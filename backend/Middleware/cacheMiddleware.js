// In-memory cache object (poor man's Redis, great for serverless if warm, excellent for VMs)
const cacheParams = new Map();

/**
 * Cache middleware generator.
 * @param {number} durationInSeconds How long the response should be cached for in seconds
 */
export const cacheMiddleware = (durationInSeconds) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = req.originalUrl || req.url;
        const cachedResponse = cacheParams.get(key);

        if (cachedResponse) {
            const now = new Date().getTime();
            // Check if expired
            if (now < cachedResponse.expiry) {
                // Return cached standard JSON response
                return res.json(cachedResponse.data);
            } else {
                // Expired, delete from map
                cacheParams.delete(key);
            }
        }

        // We need to intercept the response being sent to save it in cache
        const originalSend = res.json;
        res.json = (body) => {
            // Re-assign back to original to avoid infinite loop on next calls
            res.json = originalSend;

            // Only cache successful 200 responses
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cacheParams.set(key, {
                    data: body,
                    expiry: new Date().getTime() + durationInSeconds * 1000
                });
            }

            return res.json(body);
        };

        next();
    };
};
