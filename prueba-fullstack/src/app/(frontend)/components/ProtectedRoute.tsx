'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '../lib/useSession'

type Permission = 'canRead' | 'canCreate' | 'canUpdate' | 'canDelete'
type Module = 'cobranzas' | 'ventas' | 'inventario'

type ProtectedRouteProps = {
  children: React.ReactNode
  module?: Module         // si se pasa, verifica permisos de ese módulo
  permission?: Permission // qué permiso específico se requiere
}

export default function ProtectedRoute({
  children,
  module,
  permission = 'canRead',
}: ProtectedRouteProps) {
  const { user, loading, hasPermission } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Si no hay sesión → al login
    if (!user) {
      router.replace('/login')
      return
    }

    // Si se especificó módulo, verificar permiso
    if (module && !hasPermission(module, permission)) {
      router.replace('/unauthorized')
    }
  }, [user, loading, module, permission])

  // Mientras carga, mostramos spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  // Si no hay usuario, no renderizamos nada (está redirigiendo)
  if (!user) return null

  // Si hay módulo y no tiene permiso, no renderizamos nada
  if (module && !hasPermission(module, permission)) return null

  // Todo ok, renderizamos el contenido
  return <>{children}</>
}