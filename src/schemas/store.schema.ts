import { z } from 'zod'

export const storeZodSchema = z.object({
  store_name: z
    .string({ error: 'Nome é requerido' })
    .min(1, { error: 'Nome da loja deve possuir pelo menos 1 character' }),
  store_bio: z.string().optional(),
  store_image: z.string().optional(),
  logo: z.string().optional(),
})

export const updateStoreSchema = storeZodSchema.partial()

export const findStoreByOwner = z.object({
  id_owner: z.uuid(),
})

export const findStoreByIdStore = z.object({
  id_store: z.uuid(),
})

export type StoreType = z.infer<typeof storeZodSchema>
export type FindStoreByOwner = z.infer<typeof findStoreByOwner>
export type FindStoreByIdStore = z.infer<typeof findStoreByIdStore>
export type UpdateStoreType = z.infer<typeof updateStoreSchema>
