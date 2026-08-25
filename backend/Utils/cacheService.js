import redisClient from './redisClient.js';
import logger from './logger.js';

/**
 * In-memory fallback cache with TTL support
 */
class MemoryCache {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds = 300) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const memoryCache = new MemoryCache();

/**
 * Universal caching service (Redis with In-Memory fallback)
 */
export const cacheService = {
  /**
   * Retrieve an item from cache
   * @param {string} key
   * @returns {Promise<any>}
   */
  async get(key) {
    try {
      if (redisClient) {
        const data = await redisClient.get(key);
        if (data) {
          return typeof data === 'string' ? JSON.parse(data) : data;
        }
      }
    } catch (err) {
      logger.warn(`Redis get failed for key "${key}", checking memory cache:`, err.message);
    }
    return memoryCache.get(key);
  },

  /**
   * Set an item in cache with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds
   */
  async set(key, value, ttlSeconds = 300) {
    memoryCache.set(key, value, ttlSeconds);

    if (redisClient) {
      try {
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
        await redisClient.set(key, stringValue, { ex: ttlSeconds });
      } catch (err) {
        logger.warn(`Redis set failed for key "${key}":`, err.message);
      }
    }
  },

  /**
   * Get or compute/fetch cache value
   * @param {string} key
   * @param {Function} fetcher
   * @param {number} ttlSeconds
   * @returns {Promise<any>}
   */
  async getOrSet(key, fetcher, ttlSeconds = 300) {
    const cached = await this.get(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const freshData = await fetcher();
    if (freshData !== null && freshData !== undefined) {
      await this.set(key, freshData, ttlSeconds);
    }
    return freshData;
  },

  /**
   * Delete a key from cache
   * @param {string} key
   */
  async del(key) {
    memoryCache.delete(key);
    if (redisClient) {
      try {
        await redisClient.del(key);
      } catch (err) {
        logger.warn(`Redis del failed for key "${key}":`, err.message);
      }
    }
  },
};

export default cacheService;
