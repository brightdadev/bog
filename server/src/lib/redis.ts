/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/lib/redis.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose ioredis client for Upstash (TLS).
 */
import Redis from 'ioredis';
import { env } from '../config/env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});