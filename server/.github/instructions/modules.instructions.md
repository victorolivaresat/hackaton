---
applyTo: "src/modules/**"
---

# Copilot Module Instructions — Total Secure (Servicios, DTOs, Mappers, Filtros, Paginación)

> Para crear/editar **entidades**, sigue **`.github/instructions/entities.instructions.md`**.  
> Este archivo se centra en **servicios, controladores, DTOs, mappers, paginación y transacciones**.  
> **No** crear archivos de *repository interfaces* por defecto; en su lugar, **crear mappers** en `interfaces/`.

## Estructura por módulo (usar exactamente estos nombres)
- `domain/` → Entidades (ver `entities.instructions.md`)
- `application/` → Servicios/casos de uso (transacciones cuando haya multi-tabla)
- `dto/` → `CreateDto`, `UpdateDto`, `ResponseDto`, `FiltersDto`, **PagedResponseDto** (obligatorio)
- `interfaces/` → **Mappers** (obligatorio) y adaptadores concretos si son necesarios
- `presentation/` → Controladores NestJS (delgados, con guards/decorators de `src/common`)

## Mappers (obligatorio por módulo)
- Crear `interfaces/<entity>.mapper.ts` con métodos `static` y sin estado.
- Si un método no usa `this`, anotar `this: void` para evitar `unbound-method` cuando se pase como referencia.
- **No** generar archivos `repository.interface.ts` a menos que se pida explícitamente.
- Plantilla base (ajustar campos/relaciones a cada entidad):
```ts
import { <X> } from '../domain/<x>.entity';
import { <X>ResponseDto } from '../dto/<x>-response.dto';

export class <X>Mapper {
  static toResponseDto(this: void, e: <X>): <X>ResponseDto {
    // mapear campos públicos; nunca exponer sensibles
    return {
      id: e.id,
      // ... otros campos
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? undefined,
    };
  }
}
```

## DTOs
- `Create/Update`: `@ApiProperty`/`@ApiPropertyOptional` + `class-validator` + `@Type`.
- `Response`: solo datos públicos, sin sensibles.
- `Filters` (obligatorio): `page`, `pageSize`, `sortBy`, `sortOrder`, `q`, `withDeleted`.  
  - `sortBy`: **whitelist** con camelCase y snake_case.  
  - `withDeleted`: `@Transform(({ value }) => value === true || value === 'true')`.
- **PagedResponseDto** (obligatorio):
```ts
export class Paged<X>ResponseDto {
  items: <X>ResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Plantilla `FiltersDto`
```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max, IsIn } from 'class-validator';

export class <X>FiltersDto {
  @ApiPropertyOptional({ example: 1 }) @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10 }) @Type(() => Number) @IsInt() @Min(1) @Max(100)
  pageSize = 10;
  @ApiPropertyOptional({ example: 'created_at', enum: [
    'createdAt','created_at',
    // agrega aquí los campos ordenables del módulo
  ] })
  @IsOptional() @IsIn(['createdAt','created_at'])
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC','DESC'] })
  @IsOptional() @IsIn(['ASC','DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 'search term' })
  @IsOptional() @IsString()
  q?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  withDeleted?: boolean;
}
```

## Servicios (QueryBuilder + paginación + SORT_MAP)
- Evitar N+1 con `leftJoinAndSelect`.
- **Ordenamiento seguro**: usar `SORT_MAP` (whitelist) para mapear `sortBy` → alias del QB.  
  Ejemplo:
  ```ts
  const SORT_MAP: Record<string, string> = {
    createdAt: 'x.createdAt',
    created_at: 'x.createdAt',
    // agregar campos del módulo
  };

  const sortColumn = q.sortBy ? (SORT_MAP[q.sortBy] ?? 'x.createdAt') : 'x.createdAt';
  const sortOrder: 'ASC' | 'DESC' = q.sortOrder ?? 'DESC';
  qb.orderBy(sortColumn, sortOrder);
  ```
- Paginación estándar:
  ```ts
  type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };
  ```
- Implementar `findAll()` (rápido) y `findAllPaged(q)` (paginado/filtrado).
- **Siempre devolver DTO paginado en endpoints de listado**.
- Usar mappers para transformar entidades a DTOs en todas las respuestas.

## Transacciones
- En crear/actualizar/borrar con múltiples tablas: `this.repo.manager.transaction(...)`.
- Tras operar, recargar con `relations` y devolver `ResponseDto` vía mapper.

## Controladores
- Endpoints REST (`GET /`, `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id`, `PATCH /restore/:id` si aplica).
- Decoradores:
  - `@ApiTags('<Module>')`
  - `@ApiBearerAuth('access-token')`
  - `@UseGuards(JwtAuthGuard, PermissionsGuard)` + `@Permissions('...')`
- `GET /`: si llegan parámetros de paginación/filtros → usar `findAllPaged(q)` y devolver DTO paginado.
- Documentar con Swagger el tipo paginado en la respuesta.

## Registro de entidades en nuevos módulos (resumen)
1. Crear entidad en `domain/` siguiendo **entities.instructions.md**.  
2. Exportar en `src/entities/index.ts`.  
3. Registrar en `TypeOrmModule.forFeature([...])` y en `getDatabaseConfig().entities`.

## Do / Don’t
**Do**: normalizar campos (`email`, `username`), bcrypt para contraseñas, `pageSize ≤ 100`, `softDelete/restore`.  
**Don’t**: lógica de negocio en controller/repos, interpolar columnas sin whitelist, exponer `password`, `console.log` en prod.  
**No crear** archivos `repository.interface.ts` por defecto; priorizar **mappers**.
