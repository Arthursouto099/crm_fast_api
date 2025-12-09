import { z } from 'zod'

export const userCreateSchema = z.object({
  name: z.string({ error: 'Nome requirido!' }).min(2),
  email: z.email({ error: 'Use um e-mail valído' }),
  role: z.enum(['ADMIN', 'GUEST', 'COLLABOR']).default('GUEST'),
  password: z.string().min(4, { error: 'Minimo de 4 caracteres' }),
})

export const signSchema = z.object({
  email: z.email(),
  passwordTry: z.string(),
})

export const userUpdateSchema = userCreateSchema.omit({ password: true, role: true }).partial()
export const userIdParamSchema = z.object({ id_user: z.uuid() })

export type UserCreateType = z.infer<typeof userCreateSchema>
export type SignType = z.infer<typeof signSchema>
export type UserUpdateType = z.infer<typeof userUpdateSchema>
export type UserIdParamType = z.infer<typeof userIdParamSchema>
