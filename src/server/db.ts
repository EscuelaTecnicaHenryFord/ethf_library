import { type Client, createClient } from "@libsql/client/web";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  ethf: Client
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const ethf = createClient({
  url: env.ETHF_MASTER_DATABASE_URL,
  authToken: env.ETHF_MASTER_DATABASE_TOKEN,
})