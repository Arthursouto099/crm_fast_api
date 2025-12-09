import { SafeUser } from '../types/types'
import { PrismaClient } from '../../generated/client'
import { initPagination, PaginationArgs } from '../utils/pagination'
import bcrypt from 'bcrypt'
import { toSafeUser } from '../utils/normalizes'
import {UserSelectKeysRecords } from './types'
import UserError from '../errors/UserError'
import { SignType, UserCreateType, UserIdParamType, UserUpdateType } from '../schemas/user.schemas'

export default class UserService {
  constructor(private db: PrismaClient) {}

  public async findById({ id_user }: UserIdParamType): Promise<SafeUser | null> {
    return await this.db.user.findUnique({ where: { id_user }, select: UserSelectKeysRecords })
  }

  public async create(data: UserCreateType): Promise<SafeUser> {
    const user = await this.db.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    })

    return toSafeUser(user)
  }

  public async findAll(pag: PaginationArgs): Promise<Array<SafeUser>> {
    const { skip, take } = initPagination(pag)
    return await this.db.user.findMany({
      take,
      skip,
      select: UserSelectKeysRecords,
    })
  }

  public async login({ email, passwordTry }: SignType): Promise<SafeUser> {
    const user = await this.db.user.findUnique({ where: { email } })
    if (!user)
      throw new UserError('Não existe nenhum usuario correspondente a esse endereço de e-mail', 400)
    if (!(await bcrypt.compare(passwordTry, user.password)))
      throw new UserError('Credencias inválidas', 401)
    return toSafeUser(user)
  }

  public async update(data: UserUpdateType, { id_user }: UserIdParamType): Promise<SafeUser> {
    const user = await this.findById({ id_user })
    if (!user) throw new UserError('Identificador não encontrado', 400)
    const newUser = await this.db.user.update({ where: { id_user }, data })
    return toSafeUser(newUser)
  }

  public async delete({ id_user }: UserIdParamType) {
    const user = await this.db.user.delete({ where: { id_user } })
    return toSafeUser(user)
  }
}
