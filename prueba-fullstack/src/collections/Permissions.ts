import type { CollectionConfig } from 'payload'

const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'user',
    // Solo admins ven esta colección en el panel
    hidden: ({ user }) => user?.role !== 'admin',
  },
  // Acceso: admins tienen control total, usuarios pueden leer sus propios permisos
  access: {
    read: ({ req }) => {
      // Admins ven todo, users solo ven los suyos
      if (req.user?.role === 'admin') return true
      return { user: { equals: req.user?.id } }
    },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      label: 'Usuario',
    },
    // --- Módulo Cobranzas ---
    {
      name: 'cobranzas',
      type: 'group',
      label: 'Cobranzas',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false, label: 'Ver' },
        { name: 'canCreate', type: 'checkbox', defaultValue: false, label: 'Crear' },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false, label: 'Editar' },
        { name: 'canDelete', type: 'checkbox', defaultValue: false, label: 'Eliminar' },
      ],
    },
    // --- Módulo Ventas ---
    {
      name: 'ventas',
      type: 'group',
      label: 'Ventas',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false, label: 'Ver' },
        { name: 'canCreate', type: 'checkbox', defaultValue: false, label: 'Crear' },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false, label: 'Editar' },
        { name: 'canDelete', type: 'checkbox', defaultValue: false, label: 'Eliminar' },
      ],
    },
    // --- Módulo Inventario ---
    {
      name: 'inventario',
      type: 'group',
      label: 'Inventario',
      fields: [
        { name: 'canRead', type: 'checkbox', defaultValue: false, label: 'Ver' },
        { name: 'canCreate', type: 'checkbox', defaultValue: false, label: 'Crear' },
        { name: 'canUpdate', type: 'checkbox', defaultValue: false, label: 'Editar' },
        { name: 'canDelete', type: 'checkbox', defaultValue: false, label: 'Eliminar' },
      ],
    },
  ],
}

export default Permissions