import { FastifyReply, FastifyRequest } from 'fastify'
import UserError from '../errors/UserError'
import { StatusCodes } from 'http-status-codes'

export function checkCredentialsADM(req: FastifyRequest) {
  const user = req.signUser
  if (!user) throw new UserError('Token inválido ou usuario não autenticado')
  if (user.role !== 'ADMIN') throw new UserError('Você não possui autorização para essa função')
}

export function checkAuthIdUser(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.signUser?.id_user
  if (!auth)
    return reply.status(StatusCodes.UNAUTHORIZED).send({ error: 'Usuario não autenticado' })
}
