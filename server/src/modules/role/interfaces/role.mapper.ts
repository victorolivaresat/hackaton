import { Role } from '../domain/role.entity';
import { RoleResponseDto } from '../dto/role-response.dto';
import { RoleCreateDto } from '../dto/role-create.dto';

export class RoleMapper {
  static toEntity(dto: RoleCreateDto): Role {
    const entity = new Role();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static toResponseDto(entity: Role): RoleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deleted_at: entity.deletedAt,
    };
  }
}
