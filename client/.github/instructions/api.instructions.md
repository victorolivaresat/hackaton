# Copilot Instructions — Organización y creación de APIs (Next.js 15)

## Convenciones generales
- Los archivos de API van en `src/lib/api/<module>.ts`.
- Los tipos de datos públicos van en `src/types/<module>.ts`.
- Usa **axios centralizado** (`lib/api/axios.ts`) para todas las llamadas.
- Los nombres de archivos y funciones deben ser en kebab-case y camelCase respectivamente.

## 1) Crear la capa API y los tipos

Ejemplo para el módulo "products":

**`src/lib/api/products.ts`**
```ts
'use client';
import api from '@/lib/api/axios';
import type { Product, Paged } from '@/types/products';

export async function listProducts(params: {
  page?: number; pageSize?: number; q?: string;
  sortBy?: string; sortOrder?: 'ASC'|'DESC'; withDeleted?: boolean;
}) {
  const { data } = await api.get<Paged<Product>>('/products', { params });
  return data;
}

export async function getProduct(id: number) {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: Partial<Product>) {
  const { data } = await api.post<Product>('/products', payload);
  return data;
}

export async function updateProduct(id: number, payload: Partial<Product>) {
  const { data } = await api.patch<Product>(`/products/${id}`, payload);
  return data;
}

export async function removeProduct(id: number) {
  const { data } = await api.delete<Product>(`/products/${id}`);
  return data;
}

export async function restoreProduct(id: number) {
  const { data } = await api.patch<Product>(`/products/restore/${id}`);
  return data;
}
```

**`src/types/products.ts`**
```ts
export type Product = {
  id: number;
  name: string;
  code: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
```

## 2) Conexión con componentes
- Los componentes consumen la API importando las funciones desde `lib/api/<module>.ts`.
- El tipado se importa desde `types/<module>.ts` para tipar props, estados y respuestas.
- Mantén la lógica de negocio fuera de los componentes UI.

## 3) Flujo recomendado para nuevos módulos
1. Define los tipos públicos en `types/<module>.ts`.
2. Implementa las funciones de API en `lib/api/<module>.ts` usando axios.
3. Crea los componentes del módulo en `src/app/(private)/modules/<module>/components/`.
4. En la página principal (`page.tsx`), importa y usa las funciones de API y los componentes.
5. Sincroniza los query params con la URL usando `useSearchParams` y `useRouter`.
6. Usa `DataTable` para renderizar los datos paginados.

## 4) Ejemplo de uso en un componente
```tsx
'use client';
import { listProducts } from '@/lib/api/products';
import type { Product } from '@/types/products';

// ...
const [data, setData] = useState<Product[]>([]);
useEffect(() => {
  listProducts({ page: 1, pageSize: 10 }).then(res => setData(res.items));
}, []);
```

## 5) Checklist antes de commitear
- [ ] Archivos en **kebab-case**.
- [ ] API del módulo en `lib/api/<module>.ts` + tipos en `types/<module>.ts`.
- [ ] Los componentes consumen la API y usan los tipos.
- [ ] No mezclar lógica de API con UI.
- [ ] Solo se exponen campos públicos (coinciden con ResponseDto del backend).
