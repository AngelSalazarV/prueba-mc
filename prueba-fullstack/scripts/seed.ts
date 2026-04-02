import type { Payload } from 'payload'
import { seedData } from './data'

export const seed = async (payload: Payload): Promise<void> => {
  console.log('🌱 Iniciando seeding...')

  try {
    // 1. Buscar o crear usuario admin
    console.log('👤 Buscando/creando usuario admin...')
    let adminDocs = await payload.find({
      collection: 'users',
      where: { email: { equals: 'admin@test.com' } },
      limit: 1,
    })

    let admin
    if (adminDocs.docs.length === 0) {
      admin = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@test.com',
          password: 'admin1234',
          name: 'Administrador',
          role: 'admin',
        },
      })
      console.log(`✅ Admin creado: admin@test.com`)
    } else {
      admin = adminDocs.docs[0]
      console.log(`✅ Admin ya existe: admin@test.com`)
    }

    // 2. Buscar o crear usuario regular
    console.log('👤 Buscando/creando usuario regular...')
    let userDocs = await payload.find({
      collection: 'users',
      where: { email: { equals: 'usuario@test.com' } },
      limit: 1,
    })

    let user
    if (userDocs.docs.length === 0) {
      user = await payload.create({
        collection: 'users',
        data: {
          email: 'usuario@test.com',
          password: 'usuario1234',
          name: 'Usuario Test',
          role: 'user',
        },
      })
      console.log(`✅ Usuario creado: usuario@test.com`)
    } else {
      user = userDocs.docs[0]
      console.log(`✅ Usuario ya existe: usuario@test.com`)
    }

    // 3. Crear permisos para admin
    console.log('🔐 Creando o actualizando permisos para admin...')
    const adminPerms = await payload.find({
      collection: 'permissions',
      where: { user: { equals: admin.id } },
      limit: 1,
    })

    if (adminPerms.docs.length > 0) {
      // Ya existe, actualizar
      await payload.update({
        collection: 'permissions',
        id: adminPerms.docs[0].id,
        data: {
          cobranzas: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
          ventas: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
          inventario: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
        },
      })
    } else {
      // No existe, crear
      await payload.create({
        collection: 'permissions',
        data: {
          user: admin.id,
          cobranzas: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
          ventas: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
          inventario: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
          },
        },
      })
    }
    console.log('✅ Permisos admin creados/actualizados')

    // 4. Crear permisos para usuario regular
    console.log('🔐 Creando o actualizando permisos para usuario...')
    const userPerms = await payload.find({
      collection: 'permissions',
      where: { user: { equals: user.id } },
      limit: 1,
    })

    if (userPerms.docs.length > 0) {
      // Ya existe, actualizar
      await payload.update({
        collection: 'permissions',
        id: userPerms.docs[0].id,
        data: {
          cobranzas: {
            canRead: false,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          },
          ventas: {
            canRead: true,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          },
          inventario: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: false,
          },
        },
      })
    } else {
      // No existe, crear
      await payload.create({
        collection: 'permissions',
        data: {
          user: user.id,
          cobranzas: {
            canRead: false,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          },
          ventas: {
            canRead: true,
            canCreate: false,
            canUpdate: false,
            canDelete: false,
          },
          inventario: {
            canRead: true,
            canCreate: true,
            canUpdate: true,
            canDelete: false,
          },
        },
      })
    }
    console.log('✅ Permisos usuario creados/actualizados')

    // 5. Crear items de inventario (si no existen)
    console.log('📦 Creando items de inventario...')
    let itemsCreated = 0
    for (const item of seedData.inventory) {
      const existing = await payload.find({
        collection: 'inventory-items',
        where: { sku: { equals: item.sku } },
        limit: 1,
      })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'inventory-items',
          data: item,
        })
        itemsCreated++
      }
    }
    console.log(`✅ ${itemsCreated} items creados (${seedData.inventory.length - itemsCreated} ya existían)`)

    // 6. Crear cobranzas (si no existen)
    console.log('💰 Creando cobranzas...')
    let cobranzasCreated = 0
    for (const cobranza of seedData.cobranzas) {
      const existing = await payload.find({
        collection: 'cobranzas',
        where: { cliente: { equals: cobranza.cliente } },
        limit: 1,
      })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'cobranzas',
          data: cobranza,
        })
        cobranzasCreated++
      }
    }
    console.log(`✅ ${cobranzasCreated} cobranzas creadas (${seedData.cobranzas.length - cobranzasCreated} ya existían)`)

    // 7. Crear ventas (si no existen)
    console.log('🛒 Creando ventas...')
    let ventasCreated = 0
    for (const venta of seedData.ventas) {
      const existing = await payload.find({
        collection: 'ventas',
        where: { cliente: { equals: venta.cliente } },
        limit: 1,
      })
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'ventas',
          data: venta,
        })
        ventasCreated++
      }
    }
    console.log(`✅ ${ventasCreated} ventas creadas (${seedData.ventas.length - ventasCreated} ya existían)`)

    console.log('\n✨ Seeding completado exitosamente!')
    console.log('\n📋 Usuarios para testing:')
    console.log('  • admin@test.com / admin1234 → Acceso total')
    console.log('  • usuario@test.com / usuario1234 → Lectura en Ventas, CRUD en Inventario (sin borrar)')
  } catch (error) {
    console.error('❌ Error durante seeding:', error)
    throw error
  }
}
