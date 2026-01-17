import { User } from '../../generated/client'

export const UserSelectKeysRecords = {
  id_user: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  password: false,
  typePlan: true,
  profile_image: true,
} as const

type SelectedKeys = {
  [K in keyof typeof UserSelectKeysRecords]: (typeof UserSelectKeysRecords)[K] extends true
    ? K
    : never
}[keyof typeof UserSelectKeysRecords]

export type UserSelectedRecordsType = Pick<User, SelectedKeys>
