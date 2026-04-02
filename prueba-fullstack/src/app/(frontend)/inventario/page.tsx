'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import { useSession } from '../lib/useSession'
import { payloadClient } from '../lib/payloadClient'
import InventoryModal from './InventoryModal'

interface Item {
  id: string
  nombre: string
  sku: string
  precio: number
  stock: number
  descripcion: string
}

interface PaginatedResponse {
  docs: Item[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export default function InventarioPage() {
  const { hasPermission } = useSession()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [error, setError] = useState('')
  const limit = 10

  const fetchItems = async (pageNum: number) => {
    setLoading(true)
    setError('')
    try {
      const data = await payloadClient.getInventoryItems(pageNum, limit)
      setItems(data.docs)
      setTotalPages(data.totalPages)
      setPage(pageNum)
    } catch (err: any) {
      setError(err.message || 'Error al cargar inventario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(1)
  }, [])

  const handleCreate = async (formData: any) => {
    try {
      await payloadClient.createInventoryItem(formData)
      setShowModal(false)
      fetchItems(page)
    } catch (err: any) {
      setError(err.message || 'Error al crear')
    }
  }

  const handleUpdate = async (formData: any) => {
    if (!editingItem) return
    try {
      await payloadClient.updateInventoryItem(editingItem.id, formData)
      setEditingItem(null)
      setShowModal(false)
      fetchItems(page)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este item?')) return
    try {
      await payloadClient.deleteInventoryItem(id)
      fetchItems(page)
    } catch (err: any) {
      setError(err.message || 'Error al eliminar')
    }
  }

  const openNewModal = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const openEditModal = (item: Item) => {
    setEditingItem(item)
    setShowModal(true)
  }

  return (
    <ProtectedRoute module="inventario">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Inventario</h1>
          {hasPermission('inventario', 'canCreate') && (
            <button
              onClick={openNewModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Nuevo item
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Tabla */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Precio</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Descripción</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No hay items
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{item.nombre}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{item.sku}</td>
                    <td className="px-4 py-3 text-gray-800 font-semibold">${item.precio}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${item.stock > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm truncate max-w-xs">
                      {item.descripcion || '-'}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      {hasPermission('inventario', 'canUpdate') && (
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                      )}
                      {hasPermission('inventario', 'canDelete') && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
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
              onClick={() => fetchItems(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Anterior
            </button>
            <span className="text-gray-600 text-sm">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => fetchItems(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <InventoryModal
          item={editingItem}
          onSave={editingItem ? handleUpdate : handleCreate}
          onClose={() => {
            setShowModal(false)
            setEditingItem(null)
          }}
        />
      )}
    </ProtectedRoute>
  )
}
