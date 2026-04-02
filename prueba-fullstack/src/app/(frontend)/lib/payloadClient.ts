
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const payloadClient = {
  // Login: envía email y password, Payload devuelve el usuario y setea la cookie
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
  },

  // Logout: Payload destruye la sesión
  async logout() {
    const res = await fetch(`${API_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.json()
  },

  // Obtiene el usuario actual usando la cookie de sesión
  async getMe() {
    const res = await fetch(`${API_URL}/api/users/me`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
  },

  // Obtiene los permisos del usuario actual
  async getMyPermissions(userId: string) {
    try {
      const res = await fetch(
        `${API_URL}/api/permissions?where[user][equals]=${userId}&limit=1`,
        { credentials: 'include' }
      )
      if (!res.ok) {
        console.warn('No permissions found, returning empty defaults')
        return null
      }
      const data = await res.json()
      const perms = data.docs?.[0]
      return perms || null
    } catch (err) {
      console.error('Error fetching permissions:', err)
      return null
    }
  },

  // Obtiene items del inventario con paginación
  async getInventoryItems(page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/api/inventory-items?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    )
    return res.json()
  },

  // Obtiene ventas con paginación
  async getVentas(page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/api/ventas?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    )
    return res.json()
  },

  // Obtiene cobranzas con paginación
  async getCobranzas(page = 1, limit = 10) {
    const res = await fetch(
      `${API_URL}/api/cobranzas?page=${page}&limit=${limit}`,
      { credentials: 'include' }
    )
    return res.json()
  },

  // Crea un item de inventario
  async createInventoryItem(data: any) {
    const res = await fetch(`${API_URL}/api/inventory-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Create failed')
    return res.json()
  },

  // Actualiza un item
  async updateInventoryItem(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/inventory-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Update failed')
    return res.json()
  },

  // Elimina un item
  async deleteInventoryItem(id: string) {
    const res = await fetch(`${API_URL}/api/inventory-items/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Delete failed')
    return res.json()
  },

  // Crea una venta
  async createVenta(data: any) {
    const res = await fetch(`${API_URL}/api/ventas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Create venta failed')
    return res.json()
  },

  // Crea una cobranza
  async createCobranza(data: any) {
    const res = await fetch(`${API_URL}/api/cobranzas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Create cobranza failed')
    return res.json()
  },

  // Actualiza una venta
  async updateVenta(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/ventas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Update venta failed')
    return res.json()
  },

  // Actualiza una cobranza
  async updateCobranza(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/cobranzas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Update cobranza failed')
    return res.json()
  },

  // Elimina una venta
  async deleteVenta(id: string) {
    const res = await fetch(`${API_URL}/api/ventas/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Delete venta failed')
    return res.json()
  },

  // Elimina una cobranza
  async deleteCobranza(id: string) {
    const res = await fetch(`${API_URL}/api/cobranzas/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Delete cobranza failed')
    return res.json()
  },
}