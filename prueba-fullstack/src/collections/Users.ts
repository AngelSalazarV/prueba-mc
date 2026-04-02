import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Cuando se crea un usuario, crear documento vacío de permisos
        if (operation !== 'create' || doc.role !== 'user') return
        await req.payload.create({
          collection: 'permissions',
          data: { user: doc.id },
        })
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre completo',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      label: 'Rol',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuario', value: 'user' },
      ],
    },
  ],
}
