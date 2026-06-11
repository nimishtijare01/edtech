import { PrismaClient } from "@prisma/client";

// Export the Prisma Client and all generated types
export * from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
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
