/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/server.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts (patch: web + in-process worker)
 * @purpose Web entrypoint; owns process lifecycle (listen, runtime, shutdown).
 */
import { buildApp } from './app';
import { startWorkerRuntime } from './workers/runtime';

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

  const runtime = startWorkerRuntime();

  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}. Closing...`);
    runtime.stop();
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

void start();