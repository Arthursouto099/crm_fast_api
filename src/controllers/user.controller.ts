import { FastifyReply, FastifyRequest } from 'fastify'
import UserService from '../services/user.services'
import { UserCreateInput } from '../../generated/models'
import { PrismaClient } from '../../generated/client'
import { SafeUser } from '../types/types'
import { generatePayload } from '../@token-configs/token'
import { StatusCodes } from 'http-status-codes'
import EmailService from '../services/emails/mailgun.service'
import { PaginationArgs } from '../utils/pagination'
import { checkCredentialsADM } from '../utils/auth-utils'
import {
  SignType,
  UserCreateType,
  UserIdParamType,
  UserUpdateType,
  UserWithStoreType,
} from '../schemas/user.schemas'

export default class UserController {
  private service: UserService
  private emailService: EmailService

  constructor(db: PrismaClient) {
    this.service = new UserService(db)
    this.emailService = new EmailService()
  }

  public async signup(
    req: FastifyRequest<{ Body: UserWithStoreType }>,
    reply: FastifyReply,
  ): Promise<void> {
    const data = await this.service.create(req.body)
    const token: string = await reply.jwtSign(generatePayload(data.user))

    try {
      await this.emailService.sendEmail({
        to: data.user.email,
        subject: `Bem-vindo ao TEAM CODE`,
        text: `Olá, ${data.user.email}, seu cadastro na plataforma foi um sucesso.`,
        html: `<h1>Olá, ${data.user.name}!</h1><p>Seu cadastro foi realizado com sucesso.</p>`,
      })
    } catch (e: any) {
      console.log(e)
    }

    // const isProd = process.env.NODE_ENV === 'production'

    reply.cookie('access_token', token, {
      httpOnly: true,
      // secure: isProd,
      // sameSite: isProd ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    })

    return reply.status(StatusCodes.CREATED).send({ user: data.user, store: data.store })
  }

  public async login(req: FastifyRequest<{ Body: SignType }>, reply: FastifyReply) {
    const user: SafeUser = await this.service.login(req.body)
    const token: string = await reply.jwtSign(generatePayload(user))

    const isProd = process.env.NODE_ENV === 'production'

    reply.cookie('access_token', token, {
      httpOnly: true,
      // secure: isProd,
      // sameSite: isProd ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    })

    return reply.status(StatusCodes.OK).send({ user })
  }

  public async find(req: FastifyRequest, reply: FastifyReply) {
    checkCredentialsADM(req)
    return await reply
      .status(StatusCodes.OK)
      .send({ user: await this.service.findById({ id_user: req.signUser?.id_user! }) })
  }

  public async findAll(req: FastifyRequest<{ Querystring: PaginationArgs }>, reply: FastifyReply) {
    checkCredentialsADM(req)
    return await reply
      .status(StatusCodes.OK)
      .send({ collaborators: await this.service.findAll(req.query) })
  }

  public async update(
    req: FastifyRequest<{
      Body: UserUpdateType
    }>,
    reply: FastifyReply,
  ) {
    const user: SafeUser = await this.service.update(req.body, { id_user: req.signUser?.id_user! })
    return reply.status(StatusCodes.OK).send({ user })
  }

  public async delete(
    req: FastifyRequest<{
      Params: UserIdParamType
    }>,
    reply: FastifyReply,
  ) {
    await this.service.delete({ id_user: req.params.id_user })
    return reply.status(StatusCodes.OK)
  }
}
