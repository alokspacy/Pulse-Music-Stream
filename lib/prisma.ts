import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function makeClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? makeClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
