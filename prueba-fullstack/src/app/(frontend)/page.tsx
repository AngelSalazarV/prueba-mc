'use client'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { useSession } from './lib/useSession'

export default function DashboardPage() {
  const { user, hasPermission } = useSession()

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mb-8">Rol: {user?.role}</p>

        {/* Tarjetas de módulos según permisos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hasPermission('ventas', 'canRead') && (
            <a href="/ventas" className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-blue-700">Ventas</h2>
              <p className="text-gray-500 text-sm mt-1">Gestiona las ventas</p>
            </a>
          )}

          {hasPermission('cobranzas', 'canRead') && (
            <a href="/cobranzas" className="bg-green-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-green-700">Cobranzas</h2>
              <p className="text-gray-500 text-sm mt-1">Gestiona las cobranzas</p>
            </a>
          )}

          {hasPermission('inventario', 'canRead') && (
            <a href="/inventario" className="bg-purple-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-purple-700">Inventario</h2>
              <p className="text-gray-500 text-sm mt-1">Gestiona el inventario</p>
            </a>
          )}

          {/* Si no tiene ningún permiso */}
          {!hasPermission('ventas', 'canRead') &&
           !hasPermission('cobranzas', 'canRead') &&
           !hasPermission('inventario', 'canRead') &&
           user?.role !== 'admin' && (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No tienes permisos asignados aún. Contacta al administrador.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}