/**
 * BOG — God's Banner of Grace Ministries · Bulk SMS Broadcast Tool
 * @file    src/lib/db.ts
 * @author  Bright Da Dev
 * @phase   1 — Skeleton & contracts
 * @purpose PrismaClient singleton.
 */
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();