import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import UserError from '../errors/UserError'
import z, { ZodError } from 'zod'
import { issue } from 'zod/v4/core/util.cjs'
import { StatusCodes } from 'http-status-codes'

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

  return reply.status(error.statusCode ?? 500).send({
    error: error.message || 'Erro interno no servidor',
  })
}
