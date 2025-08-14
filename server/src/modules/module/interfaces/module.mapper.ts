import { Module } from '../domain/module.entity';
import { ModuleResponseDto } from '../dto/module-response.dto';
import { ModuleCreateDto } from '../dto/module-create.dto';

export class ModuleMapper {
  static toEntity(dto: ModuleCreateDto): Module {
    const entity = new Module();
    entity.name = dto.name;
    entity.description = dto.description;
    return entity;
  }

  static toResponseDto(entity: Module): ModuleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
