import { ConfigService } from '@nestjs/config';

/**
 * ✅ Validación de configuración
 */
export const validateConfig = (configService: ConfigService): void => {
  const required = ['JWT_SECRET', 'DATABASE_HOST', 'DATABASE_USERNAME', 'DATABASE_PASSWORD', 'DATABASE_NAME'];
  const missing = required.filter(key => !configService.get(key));

  if (missing.length > 0) {
    throw new Error(`🚨 Variables faltantes en .env: ${missing.join(', ')}`);
  }

  // Validaciones adicionales
  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (jwtSecret && jwtSecret.length < 32) {
    console.warn('⚠️  JWT_SECRET muy corto, usa al menos 32 caracteres');
  }

  const nodeEnv = configService.get<string>('APP_ENV');
  if (nodeEnv === 'production') {
    if (!configService.get<boolean>('COOKIE_SECURE')) {
      console.warn('⚠️  En producción usa COOKIE_SECURE=true');
    }
    if (!configService.get<boolean>('DATABASE_SSL')) {
      console.warn('⚠️  En producción usa DATABASE_SSL=true');
    }
  }
};
