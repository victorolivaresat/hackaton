import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from '../types';
import {
  User,
  UserRole,
  Role,
  RolePermission,
  Permission,
  Module,
} from '../../entities';

/**
 * 🌐 Configuración principal de la aplicación
 * Usa directamente las strings del .env sin constantes intermedias
 */
export const getAppConfig = (configService: ConfigService): AppConfig => ({
  port: configService.get<number>('APP_PORT', 3000),
  nodeEnv: configService.get<string>('APP_ENV', 'development'),

  jwt: {
    secret:
      configService.get<string>('JWT_SECRET') ||
      (() => {
        throw new Error('JWT_SECRET es requerido en .env');
      })(),
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
    algorithm: configService.get<string>('JWT_ALGORITHM', 'HS256'),
  },

  cookies: {
    maxAge: configService.get<number>('COOKIE_MAX_AGE', 3600000),
    domain: configService.get<string>('COOKIE_DOMAIN', 'localhost'),
    secure: configService.get<boolean>('COOKIE_SECURE', false),
  },

  cors: {
    origins: configService
      .get<string>('CORS_ORIGINS', 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
  },

  database: {
    host:
      configService.get<string>('DATABASE_HOST') ||
      (() => {
        throw new Error('DATABASE_HOST es requerido en .env');
      })(),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username:
      configService.get<string>('DATABASE_USERNAME') ||
      (() => {
        throw new Error('DATABASE_USERNAME es requerido en .env');
      })(),
    password:
      configService.get<string>('DATABASE_PASSWORD') ||
      (() => {
        throw new Error('DATABASE_PASSWORD es requerido en .env');
      })(),
    name:
      configService.get<string>('DATABASE_NAME') ||
      (() => {
        throw new Error('DATABASE_NAME es requerido en .env');
      })(),
    sync: configService.get<string>('DATABASE_SYNC') === 'true',
    logging: configService.get<boolean>('DATABASE_LOGGING', false),
    ssl: configService.get<boolean>('DATABASE_SSL', false),
    migrationsRun: configService.get<boolean>('DATABASE_MIGRATIONS_RUN', false),
    url: configService.get<string>('DATABASE_URL', ''),
  },
});

/**
 * 🛢️ Configuración de base de datos para TypeORM
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const { database } = getAppConfig(configService);

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.name,
    synchronize: database.sync,
    entities: [
      User,
      UserRole,
      Role,
      RolePermission,
      Permission,
      Module,
    ],
  };
};
