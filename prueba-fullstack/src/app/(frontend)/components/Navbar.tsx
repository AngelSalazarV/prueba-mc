'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '../lib/useSession'

export default function Navbar() {
  const { user, hasPermission, logout } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <span className="font-bold text-lg">Mi App</span>

      {/* Menú dinámico según permisos */}
      <div className="flex items-center gap-6">
        {/* Dashboard siempre visible si hay sesión */}
        <Link href="/" className="hover:text-blue-400 transition">
          Dashboard
        </Link>

        {/* Ventas: visible solo si tiene canRead en ventas */}
        {hasPermission('ventas', 'canRead') && (
          <Link href="/ventas" className="hover:text-blue-400 transition">
            Ventas
          </Link>
        )}

        {/* Cobranzas: visible solo si tiene canRead en cobranzas */}
        {hasPermission('cobranzas', 'canRead') && (
          <Link href="/cobranzas" className="hover:text-blue-400 transition">
            Cobranzas
          </Link>
        )}

        {/* Inventario: visible solo si tiene canRead en inventario */}
        {hasPermission('inventario', 'canRead') && (
          <Link href="/inventario" className="hover:text-blue-400 transition">
            Inventario
          </Link>
        )}

        {/* Si es admin, link directo al panel de Payload */}
        {user?.role === 'admin' && (
          <a
            href="/admin"
            target="_blank"
            className="hover:text-yellow-400 transition"
          >
            Panel Admin
          </a>
        )}
      </div>

      {/* Info del usuario + logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.name} · {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}