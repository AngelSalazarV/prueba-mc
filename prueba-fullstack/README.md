# Prueba Técnica Fullstack

App con Payload CMS + Next.js con autenticación y permisos por módulo.

## Inicio rápido

Ejecuta esto para levantar todo el proyecto automáticamente (instala dependencias, seed y servidor):

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

Esto abrirá la app en `http://localhost:3000`

---

## Stack

- **Backend:** Payload CMS v3 + TypeScript + MongoDB Atlas
- **Frontend:** Next.js 16 + React 19 + TailwindCSS v4
- **Auth:** Nativa de Payload (cookies/sesiones)

## Setup

```bash
# Instalar dependencias
pnpm install

# Variables de entorno (.env)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/prueba-fullstack
PAYLOAD_SECRET=tu-secret-aqui
NEXT_PUBLIC_API_URL=http://localhost:3000

# Seed de datos (usuario admin + usuario normal)
pnpm seed

# Ejecutar dev
pnpm dev
```

La app estará en `http://localhost:3000`

## Usuarios de Prueba

Después de ejecutar `pnpm seed`:

- **Admin:** `admin@test.com` / `admin123`
  - Acceso total a todo
  - Panel de Payload completo

- **Usuario:** `usuario@test.com` / `usuario123`
  - Inventario: CRUD completo (sin delete)
  - Ventas: Solo lectura
  - Cobranzas: Sin acceso

## Arquitectura

### Backend (Payload)

**Colecciones:**
- `Users` - Autenticación (email, password, role)
- `Permissions` - Permisos por módulo (inventario, ventas, cobranzas)
- `InventoryItems` - Productos
- `Ventas` - Transacciones de venta
- `Cobranzas` - Cobranzas/Pagos

**Access Control:**
- Admins: acceso total
- Users: acceso según documento `Permissions`
- Cada operación CRUD valida permisos

### Frontend (Next.js)

**Páginas públicas:**
- `/login` - Formulario de login

**Páginas protegidas:**
- `/` - Dashboard (muestra módulos disponibles)
- `/inventario` - CRUD de productos con paginación
- `/ventas` - Listado de ventas (editable si permisos)
- `/cobranzas` - Listado de cobranzas con estados

**Componentes:**
- `SessionProvider` - Gestiona sesión y permisos globales
- `ProtectedRoute` - Redirige si no tiene permisos
- `Navbar` - Menú dinámico según permisos

## Flujo

1. Usuario se autentica en `/login`
2. SessionProvider carga sesión + permisos
3. Dashboard muestra solo módulos disponibles
4. Rutas protegidas redirigen a `/unauthorized` si no tiene permisos
5. Cada CRUD respeta permisos (botones ocultos si no puede)

## Admin Panel

Acceder a `http://localhost:3000/admin` con usuario admin

Desde ahí puedes:
- Ver/editar usuarios
- Configurar permisos de cada usuario (colección Permissions)
- CRUD de productos, ventas, cobranzas
- Los usuarios normales ven solo las colecciones que pueden acceder

## Notas

- Los usuarios nuevos se crean sin permisos. El admin debe asignárselos desde `/admin`
- El seed crea datos de prueba automáticos
- Paginación: 10 items por página en todas las tablas
- Responsive con TailwindCSS

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URL` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URL` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
