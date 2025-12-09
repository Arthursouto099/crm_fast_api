import "dotenv/config"
import { PrismaClient } from "../../generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import fp from "fastify-plugin"
import { FastifyInstance } from "fastify"

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma: PrismaClient = new PrismaClient({ adapter: pool })


const prismaPlugin = fp(async (fastify: FastifyInstance) => {
  await prisma.$connect();


  fastify.decorate("db", prisma as PrismaClient);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

export default prismaPlugin;
