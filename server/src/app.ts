/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/app.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Builds the Fastify instance.
 */
import Fastify from 'fastify';
import { logger } from './lib/logger';
import { registerErrorHandler } from './plugins/error';
import { healthRoutes } from './routes/health.routes';

export async function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
  });

  registerErrorHandler(app);
  await app.register(healthRoutes);

  return app;
}