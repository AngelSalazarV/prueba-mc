import type { CollectionConfig } from 'payload'
import { checkModuleAccess } from '../access/checkModuleAccess'

const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: 'nombre',
  },
  access: {
    read: ({ req }) => checkModuleAccess(req, 'inventario', 'canRead'),
    create: ({ req }) => checkModuleAccess(req, 'inventario', 'canCreate'),
    update: ({ req }) => checkModuleAccess(req, 'inventario', 'canUpdate'),
    delete: ({ req }) => checkModuleAccess(req, 'inventario', 'canDelete'),
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre del producto',
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'SKU',
    },
    {
      name: 'precio',
      type: 'number',
      required: true,
      label: 'Precio',
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Stock',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'imagenes',
      type: 'array',
      label: 'Imágenes',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'URL de imagen',
        },
      ],
    },
  ],
}

export default InventoryItems