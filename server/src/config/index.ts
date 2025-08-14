/**
 * 🔧 Configuración modular simplificada
 */

// Exportar tipos
export * from './types';

// Exportar configuraciones
export * from './app/app.config';
export * from './jwt/jwt.config';
export * from './cors/cors.config';
export * from './swagger/swagger.config';
export * from './validation/validation.config';

// Compatibilidad hacia atrás - exportaciones explícitas
import { getAppConfig, getDatabaseConfig } from './app/app.config';
import { getJwtConfig } from './jwt/jwt.config';
import { getCorsConfig } from './cors/cors.config';
import { getSwaggerConfig } from './swagger/swagger.config';
import { validateConfig } from './validation/validation.config';

export {
  getAppConfig,
  getJwtConfig,
  getCorsConfig,
  getDatabaseConfig,
  getSwaggerConfig,
  validateConfig,
};
