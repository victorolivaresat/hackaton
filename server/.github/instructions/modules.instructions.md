---
applyTo: "src/modules/**"
---

# Copilot Module Instructions — Modules (NestJS + TypeORM)

## Capas en este repo (usar exactamente estos nombres)
- `domain/` → entidades TypeORM (User, UserRole, etc.) y contratos de dominio.
- `application/` → **servicios** (o casos de uso) con lógica de negocio pura.
- `dto/` → DTOs con `class-validator` + `@nestjs/swagger`.
- `presentation/` → controladores Nest (delgados); guards/decorators ya viven en `src/common`.
- `interfaces/` (opcional) → mappers/adaptadores (repositorio concreto, factories, etc).

## Reglas clave (Clean Code)
- **SRP**: controller orquesta; service decide; repo persiste.
- **No lógica de negocio** en repositorios ni controllers.
- **Validación** siempre en DTOs. Parsea tipos (`@Type(() => Number/Date)`).
- **Errores**: usa excepciones Nest en el borde (controller/servicio) con mensajes claros.
- **Transacciones** para operaciones multi-tabla (crear usuario + rol, actualizar rol).

## Estandarización (que Copilot genere siempre)
- CRUD con soft delete (`deletedAt`) + restore.
- Relación principal ↔ secundaria (ej: `User` ↔ `UserRole`) con índices adecuados.
- DTOs completos (`CreateDto`, `UpdateDto`, `ResponseDto`, `FiltersDto`).
- Swagger con tags, bearer y ejemplos de respuesta paginada.
- Guards y decorators de permisos en controladores.
- Paginación estándar: query `page`, `pageSize`, `sortBy`, `sortOrder`, `filters` (JSON).

## Pautas TypeORM
- Usar `QueryBuilder` para filtros/paginación y evitar N+1 (`leftJoinAndSelect`).
- **Índices** en columnas filtrables (`email`, `username`, `created_at`, etc.).
- **Transacciones** con `manager`/`queryRunner` para operaciones que afecten varias tablas.

## Respuesta paginada
```ts
type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
```

## Testing mínimo por módulo
- Unit tests de `application` con repositorios mockeados.

## Registro de entidades en nuevos módulos
Al crear un nuevo módulo, debes:
1. Crear la entidad en la carpeta `domain` del módulo. El campo primario debe ser:
	```typescript
	@PrimaryGeneratedColumn('primaryidgenerator')
	id: number;
	```
	No usar 'uuid', sino 'primaryidgenerator' para el campo primario.
2. Registrar la entidad en `src/entities/index.ts` exportándola.
	Ejemplo:
	```typescript
	export { Client } from '@modules/client/domain/client.entity';
	```
3. Importar la entidad desde `src/entities/index.ts` en `src/config/app/app.config.ts` y agregarla al arreglo `entities` de la configuración de TypeORM.
	Así la entidad estará disponible para migraciones y operaciones de base de datos.
- e2e básico del flujo CRUD con Supertest (`/api/v1/<module>`).

## Do / Don’t
**Do**: normalizar campos clave (email, username), hashear contraseñas, limitar `pageSize ≤ 100`.  
**Don’t**: exponer campos sensibles, usar `console.log` en producción, poner lógica de negocio en controller/repo.
