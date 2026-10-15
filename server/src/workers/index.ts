/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/workers/index.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Worker entrypoint: heartbeat + Redis ping + SIGTERM drain.
 */
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';

async function heartbeat() {
  try {
    const pong = await redis.ping();
    logger.info({ pong }, 'Worker heartbeat OK');
  } catch (err) {
    logger.error({ err }, 'Worker heartbeat failed');
  }
}

async function startWorker() {
  logger.info('Worker process starting...');
  
  const interval = setInterval(heartbeat, 60000);

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Draining...`);
    clearInterval(interval);
    redis.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startWorker();