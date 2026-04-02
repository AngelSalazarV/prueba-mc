import type { CollectionConfig } from 'payload'
import { checkModuleAccess } from '../access/checkModuleAccess'

const Ventas: CollectionConfig = {
  slug: 'ventas',
  admin: {
    useAsTitle: 'cliente',
  },
  access: {
    read: ({ req }) => checkModuleAccess(req, 'ventas', 'canRead'),
    create: ({ req }) => checkModuleAccess(req, 'ventas', 'canCreate'),
    update: ({ req }) => checkModuleAccess(req, 'ventas', 'canUpdate'),
    delete: ({ req }) => checkModuleAccess(req, 'ventas', 'canDelete'),
  },
  fields: [
    {
      name: 'cliente',
      type: 'text',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'producto',
      type: 'text',
      required: true,
      label: 'Producto',
    },
    {
      name: 'cantidad',
      type: 'number',
      required: true,
      label: 'Cantidad',
    },
    {
      name: 'monto_total',
      type: 'number',
      required: true,
      label: 'Monto Total',
    },
    {
      name: 'fecha_venta',
      type: 'date',
      required: true,
      label: 'Fecha de Venta',
    },
  ],
}

export default Ventas
