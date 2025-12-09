import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../../generated/client'
import ProjectServices from '../services/project.services'
import { StatusCodes } from 'http-status-codes'
import { CreateProjectType, ProjectIdType, UpdateProjectType } from '../schemas/project.schemas'
import { PaginationArgs } from '../utils/pagination'

export default class ProjectController {
  private service: ProjectServices
  constructor(db: PrismaClient) {
    this.service = new ProjectServices(db)
  }

  public async create(req: FastifyRequest<{ Body: CreateProjectType }>, reply: FastifyReply) {
    const id_user = req.signUser?.id_user
    if (!id_user) {
      return reply.status(StatusCodes.UNAUTHORIZED).send({ error: 'Usuario não autenticado' })
    }

    const newProject = await this.service.create(req.body, { id_user })

    return reply.status(StatusCodes.CREATED).send(newProject)
  }

  public async findAll(req: FastifyRequest<{ Params: PaginationArgs }>, reply: FastifyReply) {
    const id_user = req.signUser?.id_user
    if (!id_user) {
      return reply.status(StatusCodes.UNAUTHORIZED).send({ error: 'Usuario não autenticado' })
    }

    const projects = await this.service.findAll({ id_user }, req.params)

    return reply.status(StatusCodes.OK).send({ projects })
  }

  public async update(
    req: FastifyRequest<{ Body: UpdateProjectType; Params: ProjectIdType }>,
    reply: FastifyReply,
  ) {
    const project = await this.service.update(req.body, req.params)
    return reply.status(StatusCodes.OK).send({ project })
  }

  public async find(req: FastifyRequest<{ Params: ProjectIdType }>, reply: FastifyReply) {
    const project = await this.service.find(req.params)
    return reply.status(StatusCodes.OK).send({ project})
  }

  public async delete(req: FastifyRequest<{ Params: ProjectIdType }>, reply: FastifyReply) {
    await this.service.delete(req.params)
    return reply.status(StatusCodes.NO_CONTENT).send({})
  }
}
