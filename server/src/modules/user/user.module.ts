import { Module } from '@nestjs/common';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { PasswordService } from './application/password.service';
import { UserController } from './presentation/user.controller';
import { UserService } from './application/user.service';
import { Role } from '@modules/role/domain/role.entity';
import { AuthModule } from '@modules/auth/auth.module';
import { UserRole } from './domain/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, PasswordService, PermissionsGuard],
  exports: [UserService],
})
export class UserModule {}

