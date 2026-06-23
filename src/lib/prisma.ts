import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (typeof window === "undefined") {
  // Only import and initialize adapter on server side
  if (process.env.NODE_ENV === "production") {
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || "file:./dev.db",
    });
    prisma = new PrismaClient({ adapter });
  } else {
    if (!globalForPrisma.prisma) {
      const adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL || "file:./dev.db",
      });
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  }
} else {
  // Client side fallback (should not be used directly, but prevents crash on import)
  prisma = {} as PrismaClient;
}

export { prisma };
export default prisma;
