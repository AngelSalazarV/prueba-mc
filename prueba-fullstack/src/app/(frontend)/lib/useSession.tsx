'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { payloadClient } from './payloadClient'

// Definimos los tipos de datos que vamos a manejar
type Permission = {
  canRead: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}

type Permissions = {
  cobranzas: Permission
  ventas: Permission
  inventario: Permission
}

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

type SessionContextType = {
  user: User | null
  permissions: Permissions | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  // Helper para saber si el user tiene permiso en un módulo
  hasPermission: (module: keyof Permissions, action: keyof Permission) => boolean
}

// Creamos el contexto — esto es lo que comparte el estado global
const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<Permissions | null>(null)
  const [loading, setLoading] = useState(true)

  // Al cargar la app, verificamos si ya hay sesión activa
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const data = await payloadClient.getMe()
      if (data.user) {
        setUser(data.user)
        // Si es user (no admin), cargamos sus permisos
        if (data.user.role !== 'admin') {
          const perms = await payloadClient.getMyPermissions(data.user.id)
          setPermissions(perms)
        }
      }
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const data = await payloadClient.login(email, password)
    if (data.user) {
      setUser(data.user)
      if (data.user.role !== 'admin') {
        const perms = await payloadClient.getMyPermissions(data.user.id)
        setPermissions(perms)
      }
    } else {
      throw new Error(data.errors?.[0]?.message || 'Credenciales inválidas')
    }
  }

  const logout = async () => {
    await payloadClient.logout()
    setUser(null)
    setPermissions(null)
  }

  // Si es admin, siempre tiene permiso
  // Si es user, verifica en su documento de permisos
  const hasPermission = (module: keyof Permissions, action: keyof Permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return permissions?.[module]?.[action] === true
  }

  return (
    <SessionContext.Provider value={{ user, permissions, loading, login, logout, hasPermission }}>
      {children}
    </SessionContext.Provider>
  )
}

// Hook para usar el contexto desde cualquier componente
export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession debe usarse dentro de SessionProvider')
  return context
}

// Hook para verificar permisos de forma más simple
export function usePermission(module: keyof Permissions, action: keyof Permission) {
  const { hasPermission } = useSession()
  return hasPermission(module, action)
}