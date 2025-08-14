import { User } from '../domain/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

/**
 * Mapea entidades de dominio a DTOs de respuesta.
 * Centraliza la lógica para asegurar consistencia en todas las salidas.
 */
export class UserMapper {
   static toResponseDto(this: void, user: User): UserResponseDto {
    const mainRole = user.roles?.[0]?.role;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage ?? undefined,
      isActive: user.isActive,
      darkMode: user.darkMode,
      expirationPassword: user.expirationPassword ?? undefined,
      flagPassword: user.flagPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
      role: mainRole?.name ?? undefined,
      roleId: mainRole?.id ?? undefined,
    };
  }
}
