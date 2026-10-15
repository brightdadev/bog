/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/workers/index.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts (patch: thin standalone wrapper)
 * @purpose Standalone worker entrypoint (unused in v1; revives paid worker in v1.1).
 */
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';
import { startWorkerRuntime } from './runtime';

const runtime = startWorkerRuntime();

const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Draining...`);
  runtime.stop();
  redis.disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));