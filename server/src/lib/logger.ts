/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/lib/logger.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Pino logger with redaction for secrets.
 */
import pino from 'pino';

export const logger = pino({
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
});