'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import { payloadClient } from '../lib/payloadClient'
import CobranzaModal from './CobranzaModal'

interface Cobranza {
  id: string
  descripcion: string
  monto: number
  cliente: string
  estado: 'pendiente' | 'pagado' | 'vencido'
}

import { usePermission } from '../lib/useSession'

export default function CobranzasPage() {
  const [cobranzas, setCobranzas] = useState<Cobranza[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingCobranza, setEditingCobranza] = useState<Cobranza | null>(null)
  const limit = 10
  const canCreate = usePermission('cobranzas', 'canCreate')
  const canUpdate = usePermission('cobranzas', 'canUpdate')
  const canDelete = usePermission('cobranzas', 'canDelete')

  const fetchCobranzas = async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await payloadClient.getCobranzas(pageNum, limit)
      setCobranzas(data.docs)
      setTotalPages(data.totalPages)
      setPage(pageNum)
    } catch (err) {
      console.error('Error al cargar cobranzas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCobranza = async (data: any) => {
    try {
      if (editingCobranza) {
        await payloadClient.updateCobranza(editingCobranza.id, data)
      } else {
        await payloadClient.createCobranza(data)
      }
      setShowModal(false)
      setEditingCobranza(null)
      fetchCobranzas(page)
    } catch (err: any) {
      throw new Error(err.message || 'Error guardando cobranza')
    }
  }

  const handleEditCobranza = (cobranza: Cobranza) => {
    setEditingCobranza(cobranza)
    setShowModal(true)
  }

  const handleDeleteCobranza = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta cobranza?')) return
    try {
      await payloadClient.deleteCobranza(id)
      fetchCobranzas(page)
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCobranza(null)
  }

  useEffect(() => {
    fetchCobranzas(1)
  }, [])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return 'bg-green-100 text-green-700'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700'
      case 'vencido':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <ProtectedRoute module="cobranzas">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Cobranzas</h1>
          {canCreate && (
            <button
              onClick={() => {
                setEditingCobranza(null)
                setShowModal(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Nueva Cobranza
            </button>
          )}
        </div>

        {/* Tabla de cobranzas */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Descripción</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Monto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                {(canUpdate || canDelete) && <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={(canUpdate || canDelete) ? 5 : 4} className="px-4 py-6 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : cobranzas.length === 0 ? (
                <tr>
                  <td colSpan={(canUpdate || canDelete) ? 5 : 4} className="px-4 py-6 text-center text-gray-500">
                    No hay cobranzas registradas
                  </td>
                </tr>
              ) : (
                cobranzas.map(cobranza => (
                  <tr key={cobranza.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{cobranza.descripcion}</td>
                    <td className="px-4 py-3 text-gray-600">{cobranza.cliente}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">${cobranza.monto}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(cobranza.estado)}`}>
                        {cobranza.estado}
                      </span>
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="px-4 py-3 text-sm flex gap-2">
                        {canUpdate && (
                          <button
                            onClick={() => handleEditCobranza(cobranza)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                          >
                            ✏️ Editar
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteCobranza(cobranza.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => fetchCobranzas(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-gray-600 text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => fetchCobranzas(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-gray-600">
          {canCreate ? (
            '✏️ Puedes crear y editar cobranzas.'
          ) : (
            '🔒 No tienes permisos de crear/editar en este módulo. Contacta al administrador.'
          )}
        </div>

        {showModal && <CobranzaModal cobranza={editingCobranza} onSave={handleSaveCobranza} onClose={handleCloseModal} />}
      </div>
    </ProtectedRoute>
  )
}
