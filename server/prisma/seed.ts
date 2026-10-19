/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    prisma/seed.ts
 * @author  Bright Da Dev
 * @phase   2 — Auth & tenancy
 * @purpose Idempotent seed: church + admin (real hash) + All Members group.
 *          Requires ADMIN_PASSWORD env (local temp .env only, never on Render).
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD env is required to seed admin credentials.');
  }
  const churchId = process.env.CHURCH_ID || '00000000-0000-0000-0000-000000000001';

  const church = await prisma.church.upsert({
    where: { id: churchId },
    update: {},
    create: { id: churchId, name: "God's Banner of Grace Ministries", credits: 10000 },
  });

  const passHash = await hashPassword(adminPassword);
  await prisma.user.upsert({
    where: { email: 'admin@bog.local' },
    update: { passHash },
    create: { churchId: church.id, email: 'admin@bog.local', name: 'Church Admin', passHash },
  });

  await prisma.group.upsert({
    where: { churchId_name: { churchId: church.id, name: 'All Members' } },
    update: {},
    create: { churchId: church.id, name: 'All Members' },
  });

  console.log('Seed applied. Login email: admin@bog.local');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });