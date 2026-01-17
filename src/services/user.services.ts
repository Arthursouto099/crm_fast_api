import { SafeUser } from '../types/types'
import { PrismaClient } from '../../generated/client'
import { initPagination, PaginationArgs } from '../utils/pagination'
import bcrypt from 'bcrypt'
import { toSafeUser } from '../utils/normalizes'
import { UserSelectKeysRecords } from './types'
import UserError from '../errors/UserError'
import {
  SignType,
  UserIdParamType,
  UserUpdateType,
  UserWithStoreType,
} from '../schemas/user.schemas'

export default class UserService {
  constructor(private db: PrismaClient) {}

  public async findById({ id_user }: UserIdParamType): Promise<SafeUser | null> {
    return await this.db.user.findUnique({ where: { id_user }, select: UserSelectKeysRecords })
  }

  public async create(data: UserWithStoreType) {
    const { store_name, store_bio, store_image, ...userData } = data

    const createStore = await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash(data.password, 10),
        },
      })

      const store = await tx.store.create({
        data: {
          id_owner: user.id_user,
          store_name,
          store_bio,
          store_image,
        },
      })

      return { user, store }
    })

    return {
      user: toSafeUser(createStore.user),
      store: createStore.store,
    }
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
    const newUser = await this.db.user.update({ where: { id_user }, data })
    return toSafeUser(newUser)
  }

  public async delete({ id_user }: UserIdParamType) {
    const user = await this.db.user.delete({ where: { id_user } })
    return toSafeUser(user)
  }
}
