/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/app.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Builds the Fastify instance.
 */
import Fastify from 'fastify';
import { registerErrorHandler } from './plugins/error';
import { healthRoutes } from './routes/health.routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
      redact: {
        paths: [
          'req.headers.authorization',
          'req.query.token',
          '*.token',
          '*.SMARTSMS_TOKEN',
          '*.JWT_SECRET',
          '*.DATABASE_URL',
          '*.REDIS_URL'
        ],
        censor: '[REDACTED]',
      },
    },
  });

  registerErrorHandler(app);
  await app.register(healthRoutes);

  return app;
}