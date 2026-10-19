/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/app.ts
 * @author  Bright Da Dev
 * @phase   2 — Auth & tenancy
 * @purpose Builds the Fastify instance.
 */
import Fastify from 'fastify';
import { registerErrorHandler } from './plugins/error';
import { authPlugin } from './plugins/auth';
import { healthRoutes } from './routes/health.routes';
import { authRoutes } from './routes/auth.routes';

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
  await app.register(authPlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes);

  return app;
}