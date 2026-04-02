import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acceso denegado</h2>
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a este módulo.
          <br />
          Contacta a tu administrador.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Volver al Dashboard
          </Link>
          <Link
            href="/login"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Cambiar cuenta
          </Link>
        </div>
      </div>
    </div>
  )
}
