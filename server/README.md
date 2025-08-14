# Hackaton - Backend

## Estructura del Proyecto

Este backend está desarrollado con NestJS siguiendo una arquitectura modular y buenas prácticas de organización. A continuación se describe la función de cada carpeta y archivo principal:

```
├── src/
│   ├── app.controller.ts         # Controlador principal de la app
│   ├── app.module.ts             # Módulo raíz de la aplicación
│   ├── app.service.ts            # Servicio principal de la app
│   ├── main.ts                   # Punto de entrada de la aplicación
│   ├── common/                   # Utilidades compartidas (decoradores, filtros, guards, pipes)
│   │   ├── decorators/           # Decoradores personalizados (ej. permisos)
│   │   ├── filters/              # Filtros de excepciones (autorización, base de datos)
│   │   ├── guards/               # Guards para control de acceso y permisos
│   │   ├── pipes/                # Pipes para validación y transformación de datos
│   ├── config/                   # Configuración centralizada (app, cors, jwt, swagger, validaciones)
│   ├── entities/                 # Entidades de dominio (ORM)
│   ├── modules/                  # Módulos funcionales del sistema
│   │   ├── auth/                 # Autenticación y autorización
│   │   ├── module/               # Gestión de módulos del sistema
│   │   ├── permission/           # Gestión de permisos
│   │   ├── role/                 # Gestión de roles y sus permisos
│   │   ├── user/                 # Gestión de usuarios y sus roles
│   ├── types/                    # Tipos personalizados y definiciones para Express
│   ├── scripts/                  # Scripts SQL para inicializar la base de datos
│   └── test/                     # Pruebas end-to-end
├── package.json                  # Dependencias y scripts del proyecto
├── tsconfig.json                 # Configuración de TypeScript
├── nest-cli.json                 # Configuración de NestJS CLI
├── README.md                     # Documentación principal
```

### Patrones y buenas prácticas

- **Modularidad:** Cada módulo (auth, user, role, etc.) tiene su propia carpeta con subcarpetas para `application` (servicios), `domain` (entidades), `dto` (objetos de transferencia de datos), `interfaces`, y `presentation` (controladores).
- **Separación de capas:** Se separan responsabilidades en controladores, servicios, entidades y DTOs para mantener el código limpio y escalable.
- **Configuración centralizada:** Todas las configuraciones (JWT, CORS, Swagger, validaciones) están en la carpeta `config`.
- **Uso de decoradores y guards:** Para manejar permisos y autenticación de forma declarativa.
- **Pruebas:** Carpeta `test` para pruebas end-to-end.

## Inicio rápido

Sigue estos pasos para iniciar el proyecto backend:

1. **Instala las dependencias**
   ```sh
   npm install
   ```

2. **Configura tus variables de entorno**
   - Crea un archivo `.env` si es necesario y coloca los datos de conexión a tu base de datos.
   - Para el JWT, necesitas un secret seguro. Puedes generarlo así:
     ```sh
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copia el valor generado y agrégalo en tu `.env` como:
     ```env
     JWT_SECRET=tu_valor_generado_aqui
     ```

3. **Prepara la base de datos**
   - Ve a la carpeta `src/scripts`. Allí encontrarás los scripts SQL para crear las tablas e insertar los datos iniciales.

4. **Genera la contraseña encriptada para el usuario admin**
   - Antes de insertar el usuario admin, genera el hash bcrypt para la contraseña:
     ```sh
     node -e "require('bcryptjs').hash('admin123', 10).then(console.log)"
     ```
   - Copia el hash generado y úsalo en el insert SQL para el usuario admin en tu script.

5. **Ejecuta los scripts SQL**
   - Ejecuta los scripts en tu base de datos PostgreSQL para crear las tablas e insertar los datos iniciales.

6. **Inicia el servidor backend**
   ```sh
   npm run start:dev
   ```

---

**Notas:**
- Las rutas de login y logout son públicas y no requieren autenticación.
- Asegúrate de que la contraseña en la base de datos esté encriptada con bcrypt para que el login funcione correctamente.
- El secret JWT debe ser seguro y estar configurado en el archivo `.env`.

---

**Prompt example**
Crea un módulo NestJS llamado "client" en src/modules/client siguiendo las instrucciones de Copilot para modules.
El módulo debe incluir:

1. Entidad TypeORM en domain/client.entity.ts mapeada 1:1 desde este DDL de Postgres:
```sql
CREATE TABLE public.client (
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    email varchar(150) UNIQUE NOT NULL,
    phone varchar(15),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);
