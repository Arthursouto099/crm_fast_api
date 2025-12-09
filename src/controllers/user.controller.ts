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
import { SignType, UserCreateType, UserIdParamType, UserUpdateType } from '../schemas/user.schemas'

export default class UserController {
  private service: UserService
  private emailService: EmailService

  constructor(db: PrismaClient) {
    this.service = new UserService(db)
    this.emailService = new EmailService()
  }

  public async signup(
    req: FastifyRequest<{ Body: UserCreateType }>,
    reply: FastifyReply,
  ): Promise<void> {
    const user: SafeUser = await this.service.create(req.body)
    const token: string = await reply.jwtSign(generatePayload(user))
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: `Bem-vindo ao TEAM CODE`,
        text: `Olá, ${user.email}, seu cadastro na plataforma foi um sucesso.`,
        html: `<h1>Olá, ${user.name}!</h1><p>Seu cadastro foi realizado com sucesso.</p>`,
      })
    } catch (e: any) {
      console.log(e)
    }
    return reply.status(StatusCodes.CREATED).send({ token, user })
  }

  public async login(req: FastifyRequest<{ Body: SignType }>, reply: FastifyReply) {
    const user: SafeUser = await this.service.login(req.body)
    const token: string = await reply.jwtSign(generatePayload(user))
    return reply.status(StatusCodes.OK).send({ token })
  }

  public async find(req: FastifyRequest<{ Params: UserIdParamType }>, reply: FastifyReply) {
    checkCredentialsADM(req)
    return await reply
      .status(StatusCodes.OK)
      .send({ user: await this.service.findById({ id_user: req.params.id_user }) })
  }

  public async findAll(req: FastifyRequest<{ Params: PaginationArgs }>, reply: FastifyReply) {
    checkCredentialsADM(req)
    return await reply
      .status(StatusCodes.OK)
      .send({ collaborators: await this.service.findAll(req.params) })
  }

  public async update(
    req: FastifyRequest<{
      Body: UserUpdateType
      Params: UserIdParamType
    }>,
    reply: FastifyReply,
  ) {
    const user: SafeUser = await this.service.update(req.body, req.params)
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
