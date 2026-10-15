/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/server.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Web entrypoint.
 */
import { buildApp } from './app';

async function start() {
  const app = await buildApp();
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = '0.0.0.0';
    await app.listen({ port, host });
    app.log.info(`Web server listening on ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();