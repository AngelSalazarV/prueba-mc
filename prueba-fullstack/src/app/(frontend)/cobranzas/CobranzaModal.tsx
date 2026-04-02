'use client'

import { useState, useEffect } from 'react'

interface CobranzaModalProps {
  cobranza?: any
  onSave: (data: any) => Promise<void>
  onClose: () => void
}

export default function CobranzaModal({ cobranza, onSave, onClose }: CobranzaModalProps) {
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    cliente: '',
    estado: 'pendiente',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cobranza) {
      setFormData({
        descripcion: cobranza.descripcion || '',
        monto: cobranza.monto || '',
        cliente: cobranza.cliente || '',
        estado: cobranza.estado || 'pendiente',
      })
    }
  }, [cobranza])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monto' ? Number(value) || '' : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!cobranza

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {isEditing ? 'Editar Cobranza' : 'Nueva Cobranza'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
            <input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
            <input
              type="number"
              name="monto"
              step="0.01"
              value={formData.monto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
