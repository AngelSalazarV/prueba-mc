'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import { payloadClient } from '../lib/payloadClient'
import VentaModal from './VentaModal'

interface Venta {
  id: string
  cliente: string
  producto: string
  cantidad: number
  monto_total: number
  fecha_venta: string
}

import { usePermission } from '../lib/useSession'

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null)
  const limit = 10
  const canCreate = usePermission('ventas', 'canCreate')
  const canUpdate = usePermission('ventas', 'canUpdate')
  const canDelete = usePermission('ventas', 'canDelete')

  const fetchVentas = async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await payloadClient.getVentas(pageNum, limit)
      setVentas(data.docs)
      setTotalPages(data.totalPages)
      setPage(pageNum)
    } catch (err) {
      console.error('Error al cargar ventas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVenta = async (data: any) => {
    try {
      if (editingVenta) {
        await payloadClient.updateVenta(editingVenta.id, data)
      } else {
        await payloadClient.createVenta(data)
      }
      setShowModal(false)
      setEditingVenta(null)
      fetchVentas(page)
    } catch (err: any) {
      throw new Error(err.message || 'Error guardando venta')
    }
  }

  const handleEditVenta = (venta: Venta) => {
    setEditingVenta(venta)
    setShowModal(true)
  }

  const handleDeleteVenta = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) return
    try {
      await payloadClient.deleteVenta(id)
      fetchVentas(page)
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVenta(null)
  }

  useEffect(() => {
    fetchVentas(1)
  }, [])

  return (
    <ProtectedRoute module="ventas">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
          {canCreate && (
            <button
              onClick={() => {
                setEditingVenta(null)
                setShowModal(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Nueva Venta
            </button>
          )}
        </div>

        {/* Tabla de ventas */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Producto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cantidad</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Monto Total</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                {(canUpdate || canDelete) && <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={(canUpdate || canDelete) ? 6 : 5} className="px-4 py-6 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : ventas.length === 0 ? (
                <tr>
                  <td colSpan={(canUpdate || canDelete) ? 6 : 5} className="px-4 py-6 text-center text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                ventas.map(venta => (
                  <tr key={venta.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{venta.cliente}</td>
                    <td className="px-4 py-3 text-gray-600">{venta.producto}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{venta.cantidad}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">${venta.monto_total}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(venta.fecha_venta).toLocaleDateString()}
                    </td>
                    {(canUpdate || canDelete) && (
                      <td className="px-4 py-3 text-sm flex gap-2">
                        {canUpdate && (
                          <button
                            onClick={() => handleEditVenta(venta)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                          >
                            ✏️ Editar
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteVenta(venta.id)}
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
              onClick={() => fetchVentas(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-gray-600 text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => fetchVentas(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-600">
          {canCreate ? (
            '✏️ Puedes crear y editar ventas.'
          ) : (
            '📖 Este módulo es de solo lectura. Si necesitas crear/editar ventas, contacta al administrador.'
          )}
        </div>

        {showModal && <VentaModal venta={editingVenta} onSave={handleSaveVenta} onClose={handleCloseModal} />}
      </div>
    </ProtectedRoute >
  )
}
