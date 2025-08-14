// Importaciones de terceros
// import { Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule  } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_FILTER } from '@nestjs/core';

// Importaciones de módulos internos
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { getDatabaseConfig, validateConfig } from './config';
import { DatabaseExceptionFilter } from '@common/filters/database-exception.filter';
import { AuthorizationExceptionFilter } from '@common/filters/authorization-exception.filter';

// Importaciones de módulos de dominio (ordenadas por cantidad de caracteres en la ruta)
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RoleModule } from '@modules/role/role.module';
import { PermissionModule } from '@modules/permission/permission.module';
import { ModuleModule } from '@modules/module/module.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      validate: (config) => {
        const configService = new ConfigService(config);
        validateConfig(configService);
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    // Módulos de infraestructura
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    ModuleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AuthorizationExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('Data Source has been initialized!', dataSource.isInitialized);
  }
}
