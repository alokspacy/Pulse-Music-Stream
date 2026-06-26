import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function makeClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? makeClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
