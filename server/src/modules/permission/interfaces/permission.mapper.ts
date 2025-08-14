import { Permission } from '../domain/permission.entity';
import { PermissionResponseDto } from '../dto/permission-response.dto';
import { PermissionCreateDto } from '../dto/permission-create.dto';

export class PermissionMapper {
  static toEntity(dto: PermissionCreateDto): Permission {
    const entity = new Permission();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static toResponseDto(entity: Permission): PermissionResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
