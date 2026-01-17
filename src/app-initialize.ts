import { FastifyInstance } from 'fastify'
import prismaPlugin from './plugins/prisma'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import routes from './routes/routes'
import fastifyJwt from '@fastify/jwt'
import AppErrorGlobalHandler from './handlers/AppErrorGlobalHandler'
import type { CookieSerializeOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'

const initializeApp = async (app: FastifyInstance) => {
  app.register(prismaPlugin)
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
    sign: { expiresIn: '1h' },
  })

  app.setErrorHandler(AppErrorGlobalHandler)
  app.register(cookie)
  app.register(routes, { prefix: '/api' })
}

export { initializeApp }
