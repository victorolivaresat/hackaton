import { ConfigService } from '@nestjs/config';
import { JwtAlgorithm } from '../types';

/**
 * 🔐 Configuración JWT
 */
export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET') || (() => {
    throw new Error('JWT_SECRET es requerido en .env');
  })(),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
    algorithm: configService.get<string>('JWT_ALGORITHM', 'HS256') as JwtAlgorithm,
  },
});
