import { Module } from '@nestjs/common';
import { PermissionService } from './application/permission.service';
import { PermissionController } from './presentation/permission.controller';
import { User } from '@modules/user/domain/user.entity';
import { Permission } from './domain/permission.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, User]),
    AuthModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
