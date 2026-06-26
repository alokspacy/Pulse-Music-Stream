import { PrismaClient } from './generated/prisma/client';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

function makeClient(): PrismaClient {
  return new PrismaClient();
}

export const prisma: PrismaClient = globalThis.__prismaClient ?? makeClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
