import { Redis } from '@upstash/redis';

let redisClient = null;

// Only initialize Redis if both required environment variables are present.
// This prevents the server from crashing in environments where Redis isn't configured.
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
        redisClient = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        console.log('Redis (Upstash) client initialized.');
    } catch (err) {
        console.warn('Redis initialization failed, caching will be disabled:', err.message);
        redisClient = null;
    }
} else {
    console.warn('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — Redis caching disabled.');
}

export default redisClient;