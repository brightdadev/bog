/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    prisma/seed.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose Idempotent seed: 1 church, 1 admin, 1 group.
 */
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const churchId = process.env.CHURCH_ID || '00000000-0000-0000-0000-000000000001';
  
  const church = await prisma.church.upsert({
    where: { id: churchId },
    update: {},
    create: {
      id: churchId,
      name: "God's Banner of Grace Ministries",
      credits: 10000,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@bog.local' },
    update: {},
    create: {
      churchId: church.id,
      email: 'admin@bog.local',
      name: 'Church Admin',
      passHash: crypto.randomBytes(32).toString('hex'),
    },
  });

  await prisma.group.upsert({
    where: { churchId_name: { churchId: church.id, name: 'All Members' } },
    update: {},
    create: {
      churchId: church.id,
      name: 'All Members',
    },
  });

  console.log('Seed applied.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });