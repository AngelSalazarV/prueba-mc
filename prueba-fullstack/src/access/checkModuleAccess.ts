import type { PayloadRequest } from 'payload'

export const checkModuleAccess = async (
  req: PayloadRequest,
  moduleName: 'cobranzas' | 'ventas' | 'inventario',
  flag: 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete',
) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true

  const permissions = await req.payload.find({
    collection: 'permissions',
    where: { user: { equals: req.user.id } },
    limit: 1,
  })

  const doc = permissions.docs[0]
  return doc?.[moduleName]?.[flag] === true
}
