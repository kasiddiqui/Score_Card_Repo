import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const createPrismaClient = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Ensure we have a valid URL string that isn't empty or the literal string 'undefined'
  if (!url || url === 'undefined' || url.trim() === '') {
    console.warn("Database URL is missing or invalid. Falling back to default PrismaClient.");
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
