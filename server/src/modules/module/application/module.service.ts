// Whitelist de columnas ordenables
const SORT_MAP: Record<string, string> = {
  created_at: 'module.createdAt',
  name: 'module.name',
  description: 'module.description',
  updated_at: 'module.updatedAt',
  deleted_at: 'module.deletedAt',
};
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ModuleResponseDto,
  PagedModuleResponseDto,
} from '../dto/module-response.dto';
import { ModuleCreateDto } from '../dto/module-create.dto';
import { ModuleUpdateDto } from '../dto/module-update.dto';
import { FiltersModuleDto } from '../dto/filters-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Module } from '../domain/module.entity';
import { Repository, IsNull } from 'typeorm';
import { ModuleMapper } from '../interfaces/module.mapper';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Module) private moduleRepo: Repository<Module>,
  ) {}

  private toResponseDto(module: Module): ModuleResponseDto {
    return {
      id: module.id,
      name: module.name,
      description: module.description ?? undefined,
      createdAt: module.createdAt,
      updatedAt: module.updatedAt,
    };
  }

  async findAllPaged(filters?: FiltersModuleDto): Promise<PagedModuleResponseDto> {
    try {
      const {
        page = 1,
        pageSize = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        q,
        withDeleted,
      } = filters || {};

      const query = this.moduleRepo.createQueryBuilder('module');
      if (!withDeleted) {
        query.andWhere('module.deletedAt IS NULL');
      }
      if (q) {
        query.andWhere('module.name ILIKE :q OR module.description ILIKE :q', {
          q: `%${q}%`,
        });
      }
      const sortColumn = SORT_MAP[sortBy] ?? 'module.createdAt';
      query.orderBy(sortColumn, sortOrder);
      query.skip((page - 1) * pageSize).take(pageSize);
      const [modules, total] = await query.getManyAndCount();
      return {
        items: modules.map((m) => ModuleMapper.toResponseDto(m)),
        total,
        page,
        pageSize,
      };
    } catch {
      throw new InternalServerErrorException('Error al obtener los módulos');
    }
  }

  async findOne(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      return ModuleMapper.toResponseDto(module);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el módulo');
    }
  }

  async create(data: ModuleCreateDto): Promise<ModuleResponseDto> {
    try {
      // Validar que el nombre no exista
      const existingModule = await this.moduleRepo.findOne({
        where: { name: data.name },
      });

      if (existingModule) {
        throw new ConflictException('Ya existe un módulo con este nombre');
      }

      const module = this.moduleRepo.create(data);
      await this.moduleRepo.save(module);
      return this.toResponseDto(module);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el módulo');
    }
  }

  async update(id: number, data: ModuleUpdateDto): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      // Validar que el nombre no exista en otro módulo
      if (data.name && data.name !== module.name) {
        const existingModule = await this.moduleRepo.findOne({
          where: { name: data.name },
        });

        if (existingModule) {
          throw new ConflictException('Ya existe un módulo con este nombre');
        }
      }

      Object.assign(module, data);
      await this.moduleRepo.save(module);
      return this.toResponseDto(module);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el módulo');
    }
  }

  async remove(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      const module = await this.moduleRepo.findOne({
        where: { id, deletedAt: IsNull() },
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      await this.moduleRepo.softDelete(id);
      module.deletedAt = new Date();
      return this.toResponseDto(module);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el módulo');
    }
  }

  async restore(id: number): Promise<ModuleResponseDto> {
    try {
      if (!id || isNaN(id)) {
        throw new BadRequestException('El ID debe ser un número válido');
      }

      // Verificar que el módulo existe y está eliminado
      const module = await this.moduleRepo.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!module) {
        throw new NotFoundException('Módulo no encontrado');
      }

      if (!module.deletedAt) {
        throw new BadRequestException('El módulo no está eliminado');
      }

      await this.moduleRepo.restore(id);
      const restoredModule = await this.moduleRepo.findOne({
        where: { id },
      });

      if (!restoredModule) {
        throw new InternalServerErrorException('Error al restaurar el módulo');
      }

      return this.toResponseDto(restoredModule);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al restaurar el módulo');
    }
  }
}
