/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/lib/queue.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose BullMQ queue handles. Consumers added in later phases.
 */
import { Queue } from 'bullmq';
import { redis } from './redis';

export const sendQueue = new Queue('send', { connection: redis });
export const classifyQueue = new Queue('classify', { connection: redis });