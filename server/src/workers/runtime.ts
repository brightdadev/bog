/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/workers/runtime.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts (patch: in-process worker)
 * @purpose Worker runtime: heartbeat now; Stage 5 attaches BullMQ consumers here.
 *          Shared by in-process (web) and standalone (v1.1 paid worker) entrypoints.
 */
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';

export interface WorkerRuntime {
  stop: () => void;
}

export function startWorkerRuntime(): WorkerRuntime {
  logger.info('Worker runtime starting...');

  const heartbeat = async () => {
    try {
      const pong = await redis.ping();
      logger.info({ pong }, 'Worker heartbeat OK');
    } catch (err) {
      logger.error({ err }, 'Worker heartbeat failed');
    }
  };

  void heartbeat();
  const interval = setInterval(() => void heartbeat(), 60000);

  // Stage 5: attach sendQueue / classifyQueue consumers here.

  return {
    stop: () => {
      clearInterval(interval);
      logger.info('Worker runtime stopped.');
    },
  };
}