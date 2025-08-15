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
  // Log para diagnosticar el valor real de la relación module
  //console.log('PermissionMapper entity.module:', entity.module);////comentar solo fue prueba
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      moduleId: entity.moduleId,
      module: entity.module
        ? { id: entity.module.id, name: entity.module.name }
        : { id: 0, name: '' },
    };
  }
}
