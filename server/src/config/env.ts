/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/config/env.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Zod-validated environment variables.
 */
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  SMARTSMS_TOKEN: z.string().min(1),
  SMARTSMS_SENDER: z.string().min(1).max(11),
  CHURCH_ID: z.string().uuid(),
  SMS_RATE_NGN: z.coerce.number().int().positive(),
  QUIET_START: z.string().regex(/^\d{2}:\d{2}$/),
  QUIET_END: z.string().regex(/^\d{2}:\d{2}$/),
  TZ: z.string().default('Africa/Lagos'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;