import { ConfigService } from '@nestjs/config';
import { getAppConfig } from '../app/app.config';

/**
 * 📚 Configuración específica para Swagger
 * @param configService - Servicio de configuración de NestJS
 * @returns Configuración de Swagger
 */
export const getSwaggerConfig = (configService: ConfigService) => {
  const appConfig = getAppConfig(configService);

  return {
    title: 'Test API',
    description: 'Documentación de la API de Test',
    version: '1.0',
    path: 'api',
    bearerAuth: {
      type: 'http' as const,
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header' as const,
      description: 'Introduce tu token JWT aquí',
    },
    swaggerOptions: {
      persistAuthorization: true,
      url: '/api/v1/api-json',
    },
    isEnabled: appConfig.nodeEnv !== 'production',
  };
};
