/**
 * 🔧 Tipos de configuración compartidos
 */

export interface AppConfig {
  // 🌐 Configuración general
  port: number;
  nodeEnv: string;

  // 🔐 Seguridad y JWT
  jwt: {
    secret: string;
    expiresIn: string;
    algorithm: string;
  };

  // 🍪 Cookies
  cookies: {
    maxAge: number;
    domain: string;
    secure: boolean;
  };

  // 🛡️ CORS
  cors: {
    origins: string[];
  };

  // 🛢️ Base de datos
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    sync: boolean;
    logging: boolean;
    ssl: boolean;
    migrationsRun: boolean;
    url?: string;
  };
}

/**
 * Tipos de algoritmos JWT permitidos
 */
export type JwtAlgorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512';

/**
 * Tipos para mejor tipado
 */
export type NodeEnvironment = 'development' | 'production' | 'test';
export type ConfigKey = string;
