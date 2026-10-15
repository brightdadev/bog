/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/routes/health.routes.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose GET /health -> pings DB and Redis.
 */
import { FastifyInstance } from 'fastify';
import { db } from '../lib/db';
import { redis } from '../lib/redis';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    let dbStatus = 'down';
    let redisStatus = 'down';

    try {
      await db.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch (err) {
      request.log.error({ err }, 'DB health check failed');
    }

    try {
      await redis.ping();
      redisStatus = 'up';
    } catch (err) {
      request.log.error({ err }, 'Redis health check failed');
    }

    const isHealthy = dbStatus === 'up' && redisStatus === 'up';

    return reply.status(isHealthy ? 200 : 503).send({
      status: isHealthy ? 'ok' : 'degraded',
      db: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString(),
    });
  });
}