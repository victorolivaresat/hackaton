# 🚀 Total Secure — Frontend

Frontend del sistema **Total Secure**, construido con **Next.js 15 (App Router)**, **React 19**, **Tailwind v4**, **Radix UI** y **TypeScript**.  
Diseñado para escalar, con separación clara de responsabilidades, componentes reutilizables y convenciones estrictas de nombres.

---

## 📂 Arquitectura de carpetas (recomendada)

> Convención global de nombres de archivos: **kebab-case** (`protected-content.tsx`, `use-auth.ts`, `user-role.ts`).  
> Los *componentes* usan `.tsx`; *hooks*, *utils* y *tipos* usan `.ts` (o `.tsx` si renderizan JSX).

```bash
src/
  app/                              # Rutas App Router (server/client components)
    (auth)/
      login/page.tsx                # Página de login
    (private)/
      layout.tsx                    # Layout para rutas protegidas
      dashboard/page.tsx
      users/
        page.tsx                    # Listado de usuarios
        [id]/page.tsx               # Detalle/edición de usuario
    layout.tsx                      # Layout raíz (ThemeProvider, Toaster)
    page.tsx                        # Landing o redirect
  components/
    ui/                             # Primitivas sobre Radix (button.tsx, input.tsx, dialog.tsx, ...)
    shared/                         # Reusables cross-feature (data-table.tsx, confirm-dialog.tsx, empty-state.tsx)
    common/                         # Infraestructura UI (protected-content.tsx, toaster.tsx, page-header.tsx)
    forms/                          # Campos de formulario y composables (form-field.tsx, form-actions.tsx)
    layout/                         # Shell, navbar, sidebar
    charts/                         # Recharts wrappers
  hooks/
    use-auth.ts                     # Login/Logout + estado
    use-pagination.ts               # Paginación estándar (page, pageSize, sort, q)
    use-boolean.ts                  # Helper para toggles
  lib/
    api/
      axios.ts                      # Cliente axios con interceptores
      users.ts                      # API de usuarios (list, get, create, update, remove, restore)
      # ...otros recursos: roles.ts, permissions.ts, modules.ts
    auth/
      token.ts                      # Helpers de cookie/token
      guards.ts                     # Helpers para proteger acciones del cliente
    utils/
      date-utils.ts                 # Formateadores de fechas
      query-utils.ts                # Normalización de queries (sortBy/sortOrder)
    constants/
      index.ts                      # Constantes globales (paths, tamaños por defecto, etc.)
  providers/
    theme-provider.tsx              # next-themes
  routes/
    paths.ts                        # Rutas centralizadas (auth, private, recursos)
  types/
    user-role.ts                    # Tipos TS de dominio
    api.ts                          # Tipos de respuesta genéricos (Paged<T>, ApiError, etc.)
  middleware.ts                     # Protección de rutas (si no hay access_token => /login)
public/                             # Estáticos (imágenes, íconos)
```

---

## 🧭 Convenciones de nombres

- **Componentes React**: `kebab-case` + `.tsx` (ej. `protected-content.tsx`, `page-header.tsx`).
- **Hooks**: `kebab-case` + prefijo `use-` (ej. `use-auth.ts`, `use-pagination.ts`).
- **Tipos TS**: `kebab-case` (ej. `user-role.ts`, `api.ts`).
- **Utilidades**: `kebab-case` (ej. `date-utils.ts`, `query-utils.ts`).

> Dentro del código, los **componentes** usan `PascalCase` y los **hooks** usan `camelCase` con prefijo `use`.

---

## 🔌 HTTP & Auth (estándar)

- **Un único** cliente `axios` (`src/lib/api/axios.ts`) con:
  - `baseURL` desde `NEXT_PUBLIC_API_URL`.
  - Inyección de `Authorization: Bearer <token>` leyendo cookie `access_token`.
  - Interceptor 401: limpia cookie y redirige a `/login`.
- **No** usar `fetch` directo para APIs propias; *siempre* `axios` centralizado.
- Token en **cookie** (`access_token`). Si no es HTTPOnly en el backend, usar `js-cookie` como fallback.
- `middleware.ts` restringe acceso a rutas privadas.

---

## 📊 Listados y tabla estándar

- Respuesta esperada de la API:
  ```ts
  type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
  ```
- Query params: `page`, `pageSize`, `q`, `sortBy`, `sortOrder`, `withDeleted`.
- `sortBy` acepta **snake_case o camelCase** (whitelist en backend).

Componente recomendado: `components/shared/data-table.tsx` (basado en **TanStack Table v8**), con paginación controlada.

---

## 🎨 UI y estilo

- **Tailwind v4** + utilidades `clsx` y `tailwind-merge`.
- **Radix UI** para accesibilidad de primitives (dialog, dropdown, popover…).
- **Dark mode** con `next-themes` (provider en `app/layout.tsx`).

---

## ⚙️ Requisitos previos

- **Node.js 20+**
- **pnpm 8+**
- Backend en ejecución (NestJS)

---

## 🛠️ Setup rápido

1. Instalar dependencias:
   ```bash
   pnpm install
   ```

2. Variables de entorno (`.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

3. Levantar el dev server:
   ```bash
   pnpm dev
   ```

4. Abrir: http://localhost:3000

---

## ✅ Checklist de calidad (antes de commitear)

- [ ] ¿Los archivos siguen **kebab-case**?
- [ ] ¿Los componentes usan **PascalCase** y los hooks `use*`?
- [ ] ¿Las llamadas HTTP pasan por `lib/api/axios.ts`?
- [ ] ¿Las páginas privadas están protegidas por `middleware.ts`?
- [ ] ¿La tabla usa `use-pagination.ts` y envía `sortBy/sortOrder` válidos?
- [ ] ¿No hay **secretos** ni **tokens** hardcodeados?

---
*Crea un módulo en src/app/(private)/<module> con:*
- page.tsx y components/ con archivos en kebab-case.
- API centralizada en src/api/<module>.ts usando axiosInstance desde lib/api.ts.
- Funciones CRUD: getAll, getById, create, update, remove.
- Soporte para paginación (page, pageSize), orden (sortBy, sortOrder) y filtros (filters).
- Tabla con @tanstack/react-table, paginación controlada y filtros.
- Formulario con react-hook-form y validaciones zod.
- Importar UI desde components/ui/ y helpers desde lib/.
- Seguir convenciones: nombres en inglés, comentarios cortos en español si aportan contexto, rutas base /api/v1/<module>.