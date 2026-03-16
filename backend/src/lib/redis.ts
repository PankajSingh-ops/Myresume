import Redis from 'ioredis';
import { config } from '../config/index';

export const redis = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    }
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});
