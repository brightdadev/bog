/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/plugins/auth.ts
 * @author  Bright Da Dev
 * @phase   2 — Auth & tenancy
 * @purpose JWT plugin, requireAuth preHandler, single-tenant gate, churchOf helper.
 */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env';

export interface AuthUser {
  id: string;
  churchId: string;
  email: string;
  name: string;
}

// Supported augmentation point: telling @fastify/jwt what OUR token user
// looks like re-types request.user app-wide. (Augmenting FastifyRequest.user
// directly collides with the plugin's own declaration -> TS2717.)
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: AuthUser;
  }
}

export async function authPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyJwt, { secret: env.JWT_SECRET });
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  let payload: AuthUser;
  try {
    payload = await request.jwtVerify<AuthUser>();
  } catch {
    return reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or missing token.' });
  }
  if (!payload || payload.churchId !== env.CHURCH_ID) {
    return reply.code(403).send({ error: 'Forbidden', message: 'This deployment does not serve your organization.' });
  }
  request.user = { id: payload.id, churchId: payload.churchId, email: payload.email, name: payload.name };
}

export function churchOf(request: FastifyRequest): string {
  if (!request.user || !request.user.churchId) {
    throw new Error('churchOf called on an unauthenticated request');
  }
  return request.user.churchId;
}