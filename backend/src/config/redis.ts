import Redis from 'ioredis';
import { config } from './index';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableReadyCheck: true,
  enableOfflineQueue: true,
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export async function cacheService<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = config.cache.ttl
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  const result = await fn();
  await redis.setex(key, ttl, JSON.stringify(result));
  return result;
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
