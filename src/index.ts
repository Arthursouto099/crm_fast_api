import Fastify from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifyCors from '@fastify/cors'
import { PrismaClient } from '../generated/client'
import { initializeApp } from './app-initialize'
import { Payload } from './@token-configs/token'

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
  }
  interface FastifyRequest {
    signUser?: Payload
  }
}

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: true,
  credentials: true,
  allowedHeaders: ['content-type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
})

initializeApp(app).then(() => {
  app.listen({ port: 3001 }, (err: Error | null, address: string) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }

    app.log.info(`server is running in address: ${address}`)
  })
})
