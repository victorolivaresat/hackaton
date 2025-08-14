# Copilot Instructions — Frontend (Next.js 15 + React 19 + Tailwind v4)

Estas reglas aplican a **todo el frontend**.

## Stack y librerías
- **Next.js 15 (App Router)**, **React 19**, **Tailwind v4**.
- UI: Radix Primitives, lucide-react, next-themes.
- Estado/UI común: react-hot-toast, framer-motion.
- Tablas: @tanstack/react-table.
- Gráficos: recharts.
- HTTP: axios (+ interceptores).
- Cookies: js-cookie.
- **No usar migraciones ni TypeORM en el frontend** (si hay types compartidos, se modelan como TS interfaces).

## Estructura recomendada
```
app/
  (auth)/login/page.tsx
  (dashboard)/layout.tsx
  (dashboard)/page.tsx
  users/
    page.tsx
    [id]/page.tsx
lib/
  api/axios.ts          # cliente axios con interceptores
  api/users.ts          # llamadas HTTP tipadas por recurso
  hooks/useAuth.ts      # estado de autenticación
  hooks/usePagination.ts
  utils/format.ts
  constants/index.ts
components/
  ui/                   # primitivas (botón, input, etc.) sobre Radix
  data-table/           # tabla base con @tanstack/react-table
  feedback/Toast.tsx
providers/
  ThemeProvider.tsx
middleware.ts           # protección de rutas (lectura de cookie)
types/                  # tipos TS
```

## Convenciones
- **Naming**: archivos en *kebab-case*, componentes en *PascalCase*, hooks en *camelCase* con prefijo `use`.
- **Estilos**: Tailwind utility-first; usa `clsx` y `tailwind-merge` para variantes.
- **Dark mode**: via `next-themes` (`ThemeProvider` en `app/layout.tsx`).
- **Iconos**: lucide-react.
- **Accesibilidad**: preferir Radix para elementos interactivos.

## HTTP & Auth
- Crear **un solo** cliente `axios` (`lib/api/axios.ts`) con:
  - `baseURL` desde `process.env.NEXT_PUBLIC_API_URL`.
  - Header `Authorization: Bearer <token>` si existe cookie `access_token`.
  - Interceptor de respuesta: si `401`, redirigir a `/login` y limpiar cookie.
- **Nunca** llamar `fetch` directo para APIs propias; usar `axios` centralizado.
- Guardar el token en **cookie** (`access_token`) *httpOnly si llega desde backend; si no, usar js-cookie como fallback*.
- `middleware.ts` protege rutas bajo `/` excepto `/login` y rutas públicas.

## Páginas y Server/Client
- Páginas de datos **dinámicos**: componentes cliente (`'use client'`) con `useEffect` + axios, o Server Actions si aplica.
- Evitar SSR blocking cuando no sea necesario; usa spinners/skeletons.
- Estructura de **tabla paginada** estándar con `usePagination` y `@tanstack/react-table`.
- Formularios simples con `useState` y validación nativa o utilidades propias (no añadimos libs nuevas).

## UI reutilizable
- `components/ui/` debe exponer:
  - `Button`, `Input`, `Select`, `Dialog`, `Dropdown`, `Switch`, `Avatar`, `Badge`, `Tooltip` (envolturas de Radix).
- `components/data-table/` debe exponer `DataTable<T>` con props `columns`, `data`, `pagination`.
- `feedback/Toast.tsx` registra `react-hot-toast` y helpers `toastSuccess/ toastError`.

## Tablas (patrón estándar)
- Props esperadas de API: `{ items: T[]; total: number; page: number; pageSize: number }`.
- Query params: `page`, `pageSize`, `q`, `sortBy`, `sortOrder`, `withDeleted`.
- Enviar `sortBy` con **snake_case o camelCase**; el backend mapea con whitelist.

## Seguridad
- Nunca exponer secretos en el cliente.
- Sanitizar parámetros de consulta antes de enviarlos.
- Manejar errores con toasts + estados locales (`loading`, `error`).

## Copilot debe generar por defecto
1. `lib/api/axios.ts` con interceptores y lectura de `access_token`.
2. `lib/api/<resource>.ts` para cada recurso (users, roles, etc.).
3. `hooks/useAuth.ts` con login/logout y persistencia de session por cookie.
4. `hooks/usePagination.ts` para page/pageSize/sort/search.
5. Componentes `ui/*` sobre Radix.
6. `components/data-table/DataTable.tsx` con TanStack.
7. `middleware.ts` para proteger rutas privadas.
8. Páginas: `/login`, `/users` (listado con búsqueda y paginación), `/users/[id]` (detalle).

## Ejemplos de prompts
- “Crea `lib/api/axios.ts` con interceptores para inyectar Bearer de la cookie `access_token` y manejar 401 redirigiendo a /login.”
- “Crea `components/data-table/DataTable.tsx` usando @tanstack/react-table con paginación controlada externa.”
- “Crea `app/users/page.tsx` que consuma `lib/api/users.list` y renderice `DataTable` con búsqueda, sort y paginación.”
- “Genera `middleware.ts` que bloquee acceso a rutas privadas si no hay `access_token`.”
