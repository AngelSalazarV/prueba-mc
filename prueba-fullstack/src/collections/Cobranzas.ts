import type { CollectionConfig } from 'payload'
import { checkModuleAccess } from '../access/checkModuleAccess'

const Cobranzas: CollectionConfig = {
  slug: 'cobranzas',
  admin: {
    useAsTitle: 'descripcion',
  },
  access: {
    read: ({ req }) => checkModuleAccess(req, 'cobranzas', 'canRead'),
    create: ({ req }) => checkModuleAccess(req, 'cobranzas', 'canCreate'),
    update: ({ req }) => checkModuleAccess(req, 'cobranzas', 'canUpdate'),
    delete: ({ req }) => checkModuleAccess(req, 'cobranzas', 'canDelete'),
  },
  fields: [
    {
      name: 'descripcion',
      type: 'text',
      required: true,
      label: 'Descripción',
    },
    {
      name: 'monto',
      type: 'number',
      required: true,
      label: 'Monto',
    },
    {
      name: 'cliente',
      type: 'text',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'pendiente',
      label: 'Estado',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Pagado', value: 'pagado' },
        { label: 'Vencido', value: 'vencido' },
      ],
    },
  ],
}

export default Cobranzas
