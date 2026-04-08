import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const createPrismaClient = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // If we're building and the URL is missing, return a dummy client to avoid build crashes.
  // The 'lib/db.ts' is often imported during Next.js build-time page collection.
  if (!url || url === 'undefined') {
    return new PrismaClient();
  }

  const libsql = createClient({
    url: url,
    authToken: authToken,
  });

  const adapter = new PrismaLibSql(libsql as any);
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
