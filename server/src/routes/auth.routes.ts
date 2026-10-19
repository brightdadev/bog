/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/routes/auth.routes.ts
 * @author  Bright Da Dev
 * @phase   2 — Auth & tenancy
 * @purpose POST /auth/login · GET /auth/me · POST /auth/change-password
 */
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db';
import { hashPassword, verifyPassword } from '../lib/password';
import { env } from '../config/env';
import { requireAuth, churchOf, AuthUser } from '../plugins/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const changeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await db.user.findUnique({ where: { email: body.email.toLowerCase().trim() } });
    const ok = user ? await verifyPassword(body.password, user.passHash) : false;
    if (!user || !ok) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Invalid credentials.' });
    }
    if (user.churchId !== env.CHURCH_ID) {
      return reply.code(403).send({ error: 'Forbidden', message: 'This deployment does not serve your organization.' });
    }
    const payload: AuthUser = { id: user.id, churchId: user.churchId, email: user.email, name: user.name };
    const token = app.jwt.sign(payload, { expiresIn: '7d' });
    await db.audit.create({
      data: { churchId: user.churchId, actorId: user.id, action: 'auth.login', entity: 'user', entityId: user.id },
    });
    return reply.send({ token, user: payload });
  });

  app.get('/auth/me', { preHandler: requireAuth }, async (request, reply) => {
    const user = await db.user.findFirst({ where: { id: request.user.id, churchId: churchOf(request) } });
    if (!user) {
      return reply.code(404).send({ error: 'NotFound', message: 'User no longer exists.' });
    }
    return reply.send({ id: user.id, email: user.email, name: user.name, churchId: user.churchId });
  });

  app.post('/auth/change-password', { preHandler: requireAuth }, async (request, reply) => {
    const body = changeSchema.parse(request.body);
    const user = await db.user.findFirst({ where: { id: request.user.id, churchId: churchOf(request) } });
    if (!user) {
      return reply.code(404).send({ error: 'NotFound', message: 'User no longer exists.' });
    }
    const ok = await verifyPassword(body.currentPassword, user.passHash);
    if (!ok) {
      return reply.code(401).send({ error: 'Unauthorized', message: 'Current password is incorrect.' });
    }
    const passHash = await hashPassword(body.newPassword);
    await db.user.update({ where: { id: user.id }, data: { passHash } });
    await db.audit.create({
      data: { churchId: user.churchId, actorId: user.id, action: 'auth.change_password', entity: 'user', entityId: user.id },
    });
    return reply.send({ ok: true });
  });
}