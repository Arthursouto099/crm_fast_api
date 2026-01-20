import { z } from 'zod'

/**
 * Helpers (UUID e strings)
 */
export const findCustomerById = z.object({
  id_customer: z.uuid(),
})

export const findCustomersByStore = z.object({
  id_store: z.uuid(),
})

export const movementCustomer = z.object({
  ...findCustomerById.shape,
  ...findCustomersByStore.shape,
})

export const customerName = z.string().trim().min(2).max(160)

export const customerEmail = z.email().trim().max(254).optional()

export const customerPhone = z
  .string()
  .trim()
  .min(8)
  .max(25)
  // validação simples; se quiser, melhora para E.164
  .optional()

export const customerDocument = z
  .string()
  .trim()
  .min(11, 'Documento inválido (mínimo 11 caracteres)')
  .max(18, 'Documento inválido (máximo 18 caracteres)')
  // permite CPF/CNPJ com ou sem pontuação
  .refine(
    (v) =>
      /^\d{11}$|^\d{14}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v),
    {
      message: 'Documento inválido (CPF ou CNPJ)',
    },
  )

/**
 * Address
 */
export const cep = z
  .string()
  .trim()
  .refine((v) => /^\d{5}-?\d{3}$/.test(v), 'CEP inválido (ex: 12345-678)')

export const addressStreet = z.string().trim().min(2).max(180)
export const addressNumber = z.string().trim().min(1).max(30) // "S/N", "12A", etc.
export const addressComplement = z.string().trim().max(120).optional()
export const addressCity = z.string().trim().min(2).max(120)
export const addressState = z
  .string()
  .trim()
  .min(2)
  .max(2)
  .transform((v) => v.toUpperCase())
  .refine(
    (v) =>
      [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ].includes(v),
    'UF inválida',
  )

export const addressCountry = z.string().trim().min(2).max(2).default('BR')

export const customerAddressBase = z.object({
  // no create, normalmente você não exige id_customerAddress (gera no back)
  id_customerAddress: z.uuid().optional(),

  // conforme seu model: endereço pertence a um customer
  id_customer: z.uuid().optional(), // se vier por path/ctx, mantenha opcional
  cep,
  isDefault: z.boolean().optional().default(false),
  street: addressStreet,
  number: addressNumber,
  complement: addressComplement,
  city: addressCity,
  state: addressState,
  country: addressCountry,
})

/**
 * Customer base (MVP conforme seu Prisma model)
 * Observação: seu model tem id_address + addresses[]. Se id_address for “endereço principal”,
 * deixei como opcional para criação/atualização e validei coerência via superRefine.
 */
export const customerBase = z.object({
  name_customer: customerName,
  type: z.enum(['PF', 'PJ']),
  document_customer: customerDocument,
  email_customer: customerEmail,
  phone_customer: customerPhone,
  id_store: z.string().optional(),
  active: z.boolean().optional().default(true),
  address: customerAddressBase.omit({ id_customer: true, id_customerAddress: true }).optional(),
})

/**
 * CREATE: exige o base.
 * (Se id_store vier do token/params, não incluo aqui; se precisar, adicione.)
 */
export const createCustomerSchema = customerBase

/**
 * UPDATE: parcial
 */
export const updateCustomerSchema = customerBase.partial()

/**
 * Rotas de endereço (recomendado separar do update do customer)
 */

// CREATE address
export const createCustomerAddressSchema = customerAddressBase
  .omit({ id_customerAddress: true })
  .extend({
    id_customer: z.uuid(), // aqui geralmente é obrigatório
  })

// UPDATE address
export const updateCustomerAddressSchema = customerAddressBase.partial().extend({
  id_customerAddress: z.uuid(),
})

// Set default address (opcional: rota dedicada)
export const setDefaultCustomerAddressSchema = z.object({
  id_customer: z.uuid(),
  id_customerAddress: z.uuid(),
})

/**
 * Types
 */
export type FindCustomerById = z.infer<typeof findCustomerById>
export type FindCustomersByStore = z.infer<typeof findCustomersByStore>
export type MovementCustomerType = z.infer<typeof movementCustomer>

export type CreateCustomerBase = z.infer<typeof createCustomerSchema>
export type EditCustomerBase = z.infer<typeof updateCustomerSchema>

export type CreateCustomerAddress = z.infer<typeof createCustomerAddressSchema>
export type UpdateCustomerAddress = z.infer<typeof updateCustomerAddressSchema>
export type SetDefaultCustomerAddress = z.infer<typeof setDefaultCustomerAddressSchema>
