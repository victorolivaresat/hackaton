import { Module } from '@nestjs/common';
import { RoleService } from './application/role.service';
import { RoleController } from './presentation/role.controller';
import { RolePermission } from './domain/role-permission.entity';
import { UserRole } from '@modules/user/domain/user-role.entity';
import { User } from '@modules/user/domain/user.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, UserRole, User]),
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
