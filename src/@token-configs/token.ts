import { JwtPayload } from 'jsonwebtoken'
import { Roles } from '../../generated/enums'
import { SafeUser } from '../types/types'

export type Payload = {
  name: string
  id_user: string
  role: Roles
  email: string
  currentLog: Date
}

export const generatePayload = (safe: SafeUser): JwtPayload => ({
  id_user: safe.id_user,
  name: safe.name,
  email: safe.email.toLocaleLowerCase().trim(),
  role: safe.role,
  currentLog: Date.now(),
})
