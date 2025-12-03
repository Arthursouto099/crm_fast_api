import Fastify, { FastifyInstance } from "fastify";
import prisma from "./plugins/prisma"
import RootRouter from "./routes/router";



const fastify: FastifyInstance = Fastify({
    logger: true
})



fastify.register(prisma)
fastify.register(RootRouter, {prefix: "/api"})



fastify.listen({ port: 3001 }, (err: Error | null, address: string) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    
    
   
    
    
    fastify.log.info(`server is running in address: ${address}`)
})