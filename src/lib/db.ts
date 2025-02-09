import { prismaClient } from 'prisma-client';


declare global {
    var prisma: typeof prismaClient | undefined;
}

export const prisma = globalThis.prisma || new prismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;