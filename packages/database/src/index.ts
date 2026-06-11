import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Export the Prisma Client and all generated types
export * from "@prisma/client";
import { Prisma } from "@prisma/client";
export type Decimal = Prisma.Decimal;
export type JsonValue = Prisma.JsonValue;

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Attach PrismaClient to the global object in development to prevent 
// exhausting database connections during hot module reloading.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
