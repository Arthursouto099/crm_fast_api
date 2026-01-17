import { string, z } from 'zod'

export const findProductById = z.object({
  id_product: z.uuid(),
})

export const findProductsByStore = z.object({
  id_store: z.uuid(),
})

export const movementProduct = z.object({
  ...findProductById.shape,
  ...findProductsByStore.shape,
})

export const decimalString = z.union([z.string(), z.number()]).transform((v) => String(v))

export const productName = z.string().trim().min(2).max(120)

export const productDescription = z.string().trim().min(3).max(5000)

export const productBase = z
  .object({
    product_name: productName,
    product_description: productDescription,

    product_price: decimalString.refine(
      (v) => /^\d+(\.\d{1,2})?$/.test(v),
      'Preço inválido (use até 2 casas decimais, ex: 10.90)',
    ),
    sizeMl: z.number().int().positive().optional(),
    product_image: z.string().trim().url().optional(),
    stock_quantity: z.number().int().nonnegative().optional().default(0),
    low_stock_at: z.number().int().nonnegative().optional(),
    category: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // Se quiser impedir que low_stock_at seja 0 (opcional)
    if (data.low_stock_at === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['low_stock_at'],
        message: 'low_stock_at deve ser >= 1, ou então remova o campo',
      })
    }
  })

/**
 * CREATE: exige os campos essenciais e permite opcionais.
 * (Você não recebe id_store aqui se ele vier por params ou token; ajuste conforme seu fluxo.)
 */
export const createProductSchema = productBase

/**
 * UPDATE: permite atualizar parcialmente sem obrigar todos os campos.
 */
export const updateProductSchema = productBase.partial()

/**
 * Rotas de estoque: recomendo separar para não misturar com update geral.
 */

// PATCH - delta (entrada/baixa)
export const productStockDeltaSchema = z.object({
  delta: z
    .number()
    .int()
    .refine((v) => v !== 0, 'delta deve ser diferente de 0'),
})

// PUT - set (ajuste direto)
export const productStockSetSchema = z.object({
  stock_quantity: z.number().int().nonnegative(),
})

export type CreateProductBase = z.infer<typeof createProductSchema>
export type EditProductBase = z.infer<typeof updateProductSchema>
export type FindProductById = z.infer<typeof findProductById>
export type ProductStockDelta = z.infer<typeof productStockDeltaSchema>
export type FindProductsByStore = z.infer<typeof findProductsByStore>
export type MovementProductType = z.infer<typeof movementProduct>
