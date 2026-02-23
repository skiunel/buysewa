import { createClient } from 'redis';

let redis;

// Use in-memory fallback if Redis is not available
const memoryStore = new Map();

const redisClient = {
  get: async (key) => {
    if (redis && redis.isReady) {
      return await redis.get(key);
    }
    return memoryStore.get(key) || null;
  },
  set: async (key, value, options) => {
    if (redis && redis.isReady) {
      if (options && options.EX) {
        return await redis.setEx(key, options.EX, value);
      }
      return await redis.set(key, value);
    }
    memoryStore.set(key, value);
    if (options && options.EX) {
      setTimeout(() => memoryStore.delete(key), options.EX * 1000);
    }
    return 'OK';
  },
  del: async (key) => {
    if (redis && redis.isReady) {
      return await redis.del(key);
    }
    memoryStore.delete(key);
    return 1;
  },
};

// Try to connect to Redis
try {
  redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  redis.on('error', (err) => {
    console.warn('Redis not available, using in-memory store:', err.message);
  });

  redis.connect().catch(() => {
    console.warn('Could not connect to Redis, using in-memory token store');
  });
} catch (e) {
  console.warn('Redis client initialization failed, using in-memory store');
}

export default redisClient;
