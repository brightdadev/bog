/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/plugins/error.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Centralized error handler for Fastify.
 */
import { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | ZodError | Error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: error.issues,
      });
    }

    const statusCode = (error as any).statusCode || 500;
    request.log.error(error);

    return reply.status(statusCode).send({
      error: error.name || 'Internal Server Error',
      message: error.message,
    });
  });
}