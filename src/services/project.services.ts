import { PrismaClient, Project } from '../../generated/client'
import { ProjectCreateInput, ProjectUncheckedCreateInput } from '../../generated/models'
import UserError from '../errors/UserError'
import {
  CreateProjectType,
  ProjectIdType,
  ProjectOnwerType,
  UpdateProjectType,
} from '../schemas/project.schemas'
import { initPagination, PaginationArgs } from '../utils/pagination'
import {UserSelectKeysRecords } from './types'

export default class ProjectServices {
  constructor(private db: PrismaClient) {}

  public async create(data: CreateProjectType, { id_user }: ProjectOnwerType): Promise<Project> {
    const project: Project = await this.db.project.create({
      data: {
        ...data,
        ownerId: id_user,
      },
    })
    return project
  }

  public async findAll(
    { id_user }: ProjectOnwerType,
    pag: PaginationArgs,
  ): Promise<Array<Project>> {
    const { skip, take } = initPagination(pag)
    return await this.db.project.findMany({
      skip,
      take,
      where: { ownerId: id_user },
      orderBy: { createdAt: 'desc' },
    })
  }

  public async find({
    id_project,
  }: ProjectIdType) {
    return await this.db.project.findUnique({
      where: { id_project },
      include: { owner: { select: UserSelectKeysRecords }, usersProject: true },
    })
  }

  public async update(data: UpdateProjectType, { id_project }: ProjectIdType): Promise<Project> {
    const project: Project | null = await this.find({ id_project })
    if (!project) throw new UserError('Projeto não encontrado', 404)
    return await this.db.project.update({ where: { id_project }, data })
  }

  public async delete({ id_project }: ProjectIdType): Promise<Project> {
    return await this.db.project.delete({ where: { id_project } })
  }
}
