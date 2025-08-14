# Copilot Repository Instructions — Total Secure Backend

## Principios base
- Sigue **Clean Code** (Robert C. Martin): funciones pequeñas, nombres claros, sin duplicación, SRP, y sin mezclar responsabilidades.
- **Arquitectura modular**: cada módulo (`auth`, `user`, `role`, `permission`, `module`) debe tener subcarpetas:
  - `application` → servicios y casos de uso.
  - `domain` → entidades y repositorios (interfaces).
  - `dto` → objetos de transferencia de datos.
  - `interfaces` → adaptadores/puertos.
  - `presentation` → controladores y endpoints.
- **Separación de capas** estricta:
  - Controladores: orquestan DTOs → casos de uso → respuesta.
  - Casos de uso: lógica de negocio pura, sin dependencias de Nest.
  - Infraestructura: repositorios concretos, integraciones externas.
- **Configuración centralizada** en `src/config` (JWT, CORS, Swagger, validaciones).

## Convenciones
- Nombres en **inglés** para código y variables. Comentarios breves en español si aportan contexto.
- DTOs con sufijo `Dto` y decoradores `class-validator` + `@ApiProperty` con ejemplos.
- Timestamps en base de datos en **snake_case** (`created_at`, `updated_at`), mapeados explícitamente en entidades.
- Rutas base por módulo: `/api/v1/<module>`.
- Reutilizar pipes, guards, decoradores y filtros desde `src/common`.

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
- Soportar filtros por texto y estado.

## Testing
- Unit tests para casos de uso y servicios con mocks de repositorio.
- e2e tests en `test/` usando Supertest.
- Cobertura mínima recomendada: 80%.

## Qué debe generar Copilot por defecto
- Al crear un módulo:
  1. Entidad TypeORM en `src/entities` o `domain`.
  2. Repositorio (interfaz + implementación).
  3. Casos de uso CRUD + validaciones.
  4. DTOs con `class-validator` y `@ApiProperty`.
  5. Controller en `presentation` con endpoints RESTful.
  6. Documentación Swagger.
  7. Tests unit y e2e.
  8. Migration para la nueva entidad.
- Scripts `pnpm` esperados: `start:dev`, `build`, `test`, `migration:generate`, `migration:run`, `seed`.

## Notas especiales del proyecto
- `src/common/` centraliza decoradores, filtros, guards y pipes.
- `src/scripts/` contiene SQL de inicialización (roles, permisos, usuario admin).
- Las rutas `login` y `logout` son públicas.
- El usuario admin inicial debe insertarse con contraseña hasheada.

