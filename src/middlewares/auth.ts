import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { Payload } from '../@token-configs/token'
import { StatusCodes } from 'http-status-codes'

export default async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    const isPublic = req.url.split('/')

    if (isPublic.includes('auth')) return

    const token_ = req.cookies['access_token']

    if (!token_) {
      return reply.status(StatusCodes.FORBIDDEN).send()
    }

    const decoded = jwt.verify(token_, process.env.JWT_SECRET ?? 'default_key') as Payload
    if (!decoded) {
      return reply.status(StatusCodes.UNAUTHORIZED).send({ warning: 'Token inválido' })
    }

    req.signUser = decoded
  } catch (err: any) {
    console.log(err)
    reply.status(StatusCodes.UNAUTHORIZED).send({ error: 'Não autorizado', message: err.message })
  }
}
