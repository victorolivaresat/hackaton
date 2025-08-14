# Copilot Repository Instructions — Total Secure Backend

## Principios base
- Sigue **Clean Code** (Robert C. Martin): funciones pequeñas, nombres claros, sin duplicación, SRP, y sin mezclar responsabilidades.
- **Arquitectura modular**: cada módulo (`auth`, `user`, `role`, `permission`, `module`, etc.) debe tener subcarpetas:
  - `application` → servicios y casos de uso (lógica de negocio pura).
  - `domain` → entidades y repositorios (interfaces).
  - `dto` → objetos de transferencia de datos.
  - `interfaces` → adaptadores/puertos, incluyendo **mappers**.
  - `presentation` → controladores y endpoints.
- **Separación de capas** estricta:
  - Controladores: orquestan DTOs → casos de uso → respuesta.
  - Casos de uso: lógica de negocio sin dependencias de Nest.
  - Infraestructura: repositorios concretos, integraciones externas.
- **Configuración centralizada** en `src/config` (JWT, CORS, Swagger, validaciones).

## Convenciones
- Nombres en **inglés** para código y variables. Comentarios breves en español si aportan contexto.
- DTOs con sufijo `Dto` y decoradores `class-validator` + `@ApiProperty` con ejemplos.
- Timestamps en base de datos en **snake_case** (`created_at`, `updated_at`), mapeados explícitamente en entidades.
- Rutas base por módulo: `/api/v1/<module>`.
- Reutilizar pipes, guards, decoradores y filtros desde `src/common`.
- **Mappers**:
  - Archivo por entidad (`<entity>.mapper.ts`) en `interfaces/mappers/`.
  - Funciones estáticas para: `toEntity(dto)`, `toResponseDto(entity)`.
  - Sin lógica de negocio, solo transformación de datos.

## Stack y librerías
- NestJS ^11, TypeORM ^0.3, PostgreSQL, JWT con `@nestjs/jwt`, validación con `class-validator`/`class-transformer`, Swagger con `@nestjs/swagger`.
- Autenticación con Passport (`@nestjs/passport`) y `passport-jwt`.
- `bcryptjs` para hashing de contraseñas.

## Seguridad
- Configurar CORS solo para orígenes en whitelist (`CORS_ORIGINS` en `.env`).
- JWT secret desde `.env` con expiración corta.
- Contraseñas siempre encriptadas con bcrypt antes de insertar en DB.
- Usar filtros de excepciones globales en `src/common/filters`.

## Swagger
- Configurar en `main.ts` con `DocumentBuilder` y `addBearerAuth()`.
- Documentar paginación, errores comunes y ejemplos de respuesta.

## Paginación y filtros
- Query params estándar: `page`, `pageSize`, `sortBy`, `sortOrder`, `filters`.
- Limitar `pageSize` a 100.
- Soportar filtros por texto, estado y rangos de fecha (máx. 60 días).
- Respuesta paginada estándar:
```ts
{
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Testing
- Unit tests para casos de uso y servicios con mocks de repositorio.
- e2e tests en `test/` usando Supertest.
- Cobertura mínima recomendada: 80%.

## Creación de entidades (TypeORM + Postgres)
- Reflejar exactamente el esquema de la BD (nombres de columnas `snake_case`, tipos, nulabilidad, claves foráneas e índices).
- Clave primaria: usar `@PrimaryGeneratedColumn()` (o `'increment'` en Postgres si aplica).
- Agregar cada entidad nueva al **barrel** `src/entities/index.ts` y registrarla en `TypeOrmModule.forFeature([...])` del módulo correspondiente.
- Convenciones:
  - `@Entity({ name: '<tabla>' })` siempre con **name** explícito.
  - Cada columna debe usar `@Column({ name: '<snake_case>' })` salvo PK y columnas especiales.
  - Timestamps con `@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn`.
  - FKs con `@ManyToOne()` + `@JoinColumn({ name: '<fk_column>' })`.

## Qué debe generar Copilot por defecto al crear un módulo
1. Entidad TypeORM en `domain/entities`.
2. Repositorio (interfaz en `domain/repositories` + implementación en `infrastructure/repositories`).
3. Casos de uso CRUD + validaciones (`application`).
4. DTOs (`dto`) con `class-validator` y `@ApiProperty`.
5. Mapper (`interfaces/mappers`) para entity ↔ DTO.
6. Controller en `presentation` con endpoints RESTful.
7. Documentación Swagger.
8. Tests unit y e2e.

## Notas especiales del proyecto
- `src/common/` centraliza decoradores, filtros, guards y pipes.
- No se usarán migraciones ni seeders (la BD ya existe).
- El usuario admin inicial se insertará manualmente con contraseña hasheada.
