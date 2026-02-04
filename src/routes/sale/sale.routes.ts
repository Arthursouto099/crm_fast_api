import { SaleCreateInput } from '../../../generated/models'
import SaleController from '../../controllers/sale/sale.controller'
import { FastifyInstanceTyped } from '../../types/types'

export default function SaleRoutes(app: FastifyInstanceTyped) {
  const controller = new SaleController(app.db)

  app.post<{
    Body: Omit<SaleCreateInput, 'store' | 'items' | 'customer' | 'totalAmount' | 'finalAmount'> & {
      products: { id_product: string; quantity: number }[]
    }
    Params: { id_customer: string; id_store: string }
  }>('/:id_customer/:id_store/generate', (req, reply) => {
    return controller.create(req, reply)
  })
}
