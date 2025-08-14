---
applyTo: "src/app/(private)/**"
---

## Cómo crear un módulo en `(private)/<module>`

### 1. Estructura de archivos

Crea la siguiente estructura para tu módulo (ejemplo: "products"):

```
src/
	app/
		(private)/
            products/
                page.tsx                # Página principal del módulo
                layout.tsx              # Layout específico del módulo (opcional)
                components/             # Componentes propios del módulo
                    product-table.tsx
                    product-form.tsx
                    ...
```

- Nombres de archivos: kebab-case para archivos y carpetas.
- Componentes generales van en `components/common/` o `components/ui/`. Los específicos del módulo van en `src/app/(private)/products/components/`.

### 2. Layout y diseño

- Si el módulo requiere layout propio, crea `layout.tsx` y extiende el layout principal de `(private)`.
- Usa componentes de `components/ui/` para UI.
- Para iconos, utiliza `lucide-react` y colócalos en los componentes del módulo o en el layout.

### 3. Renderizado y rutas

- La ruta del módulo debe estar en `src/app/(private)/<modulo>/page.tsx`.
- El layout de `(private)` se aplica automáticamente si no defines uno propio.

### 4. Separación de componentes

- Generales: `components/common/`, `components/ui/` (reutilizables).
- Del módulo: `src/app/(private)/<modulo>/components/` (solo para el módulo).

### 5. Ejemplo de estructura de módulo "products"

```
src/
	app/
		(private)/
            products/
                page.tsx
                layout.tsx
                components/
                    product-table.tsx
                    product-form.tsx
```

### 6. Ejemplo de importación y uso

En `page.tsx` del módulo:

```tsx
'use client'
import ProductTable from './components/product-table'
import ProductForm from './components/product-form'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold flex items-center gap-2">
				<Icon name="package" /> Productos
			</h1>
			<ProductForm />
			<ProductTable />
		</div>
	)
}
```

### 7. Iconos

- Usa `lucide-react` para iconos.
- Ejemplo: `<Icon name="package" />` o importa el icono directamente.

### 8. Diseño

- Aplica utilidades de Tailwind para estilos.
- Usa variantes y helpers como `clsx` y `tailwind-merge` para clases condicionales.
