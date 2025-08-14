import { ConfigService } from '@nestjs/config';

/**
 * 🛡️ Configuración CORS
 */
export const getCorsConfig = (configService: ConfigService) => ({
  origin: configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim()),
  credentials: true,
});
