import { User } from '../../generated/client'
import { SafeUser } from '../types/types'

export const toSafeUser = (user: User): SafeUser => {
  const { password, ...rest } = user
  return rest
}
