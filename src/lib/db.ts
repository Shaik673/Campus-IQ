import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

function getDatabaseUrl(): string | undefined {
  if (process.env.VERCEL) {
    try {
      const dbDir = path.join("/tmp", "prisma");
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const tmpDbPath = path.join(dbDir, "dev.db");
      const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");

      if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
      return `file:${tmpDbPath}`;
    } catch (e) {
      console.error("Error setting up /tmp SQLite DB on Vercel:", e);
    }
  }
  return undefined;
}

const customUrl = getDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: customUrl
      ? {
          db: {
            url: customUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
