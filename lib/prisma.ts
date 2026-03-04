/**
 * Follicia — Prisma Client Singleton
 *
 * Uses a module-level global to prevent multiple PrismaClient instances
 * during Next.js hot-reloading in development.
 *
 * On first import, the client connects lazily — the first real query
 * (or the explicit $connect() call below) will establish the TCP link
 * to NeonDB and print "✅ Database Connected" to the terminal.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ── Connection verification (runs once when the module is first loaded) ───
// We use a non-blocking promise so this never delays the startup path.
if (typeof globalThis.__prismaConnected === "undefined") {
  // Mark immediately to prevent duplicate calls across hot-reloads
  (globalThis as Record<string, unknown>).__prismaConnected = true;

  prisma
    .$connect()
    .then(() => {
      console.log("✅  Database Connected — NeonDB is reachable.");
    })
    .catch((err: unknown) => {
      console.error(
        "❌  Database Connection Failed — check DATABASE_URL in .env\n",
        err
      );
    });
}
