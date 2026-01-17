import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import UserError from '../errors/UserError'
import z, { ZodError } from 'zod'
import { issue } from 'zod/v4/core/util.cjs'
import { StatusCodes } from 'http-status-codes'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export default function AppErrorGlobalHandler(
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  req.log.error(error)

  if (error instanceof UserError) {
    return reply.status(error.statusCode).send({
      error: error.message,
      type: 'USER_ERROR',
    })
  }

  if (error instanceof ZodError) {
    return reply.status(StatusCodes.BAD_REQUEST).send({
      error: 'Erro de validação',
      issues: z.treeifyError(error),
    })
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return reply.status(StatusCodes.CONFLICT).send({
          error: 'Registro já existe',
        })

      case 'P2025':
        return reply.status(StatusCodes.NOT_FOUND).send({
          error: 'Registro não encontrado',
        })

      default:
        return reply.status(StatusCodes.BAD_REQUEST).send({
          error: 'Erro ao processar a requisição',
        })
    }
  }

  return reply.status(error.statusCode ?? 500).send({
    error: error.message || 'Erro interno no servidor',
  })
}
