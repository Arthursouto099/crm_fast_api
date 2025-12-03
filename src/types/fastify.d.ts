import { PrismaClient } from "../../generated/client";


declare module 'fastify' {
    interface  FastifyInstance {
        prisma: PrismaClient
    }
}


