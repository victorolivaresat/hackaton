// Whitelist de columnas ordenables
const SORT_MAP: Record<string, string> = {
  created_at: 'permission.createdAt',
  name: 'permission.name',
  description: 'permission.description',
  updated_at: 'permission.updatedAt',
  deleted_at: 'permission.deletedAt',
};
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiltersPermissionDto } from '../dto/filters-permission.dto';
import { Permission } from '../domain/permission.entity';
import { PermissionCreateDto } from '../dto/permission-create.dto';
import { PermissionUpdateDto } from '../dto/permission-update.dto';
import { PermissionMapper } from '../interfaces/permission.mapper';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  async findAllPaged(filters?: FiltersPermissionDto) {
    try {
      const {
        page = 1,
        pageSize = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        q,
        withDeleted,
      } = filters || {};

      const query = this.permissionRepo.createQueryBuilder('permission')
        .leftJoinAndSelect('permission.module', 'module');
      if (!withDeleted) {
        query.andWhere('permission.deletedAt IS NULL');
      }
      if (q) {
        query.andWhere('permission.name ILIKE :q OR permission.description ILIKE :q', { q: `%${q}%` });
      }
  const sortColumn = SORT_MAP[sortBy] ?? 'permission.createdAt';
  query.orderBy(sortColumn, sortOrder);
      query.skip((page - 1) * pageSize).take(pageSize);
      const [permissions, total] = await query.getManyAndCount();
      return {
        items: permissions.map(p => PermissionMapper.toResponseDto(p)),
        total,
        page,
        pageSize,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al obtener los permisos');
    }
  }
  

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) throw new NotFoundException('Permiso no encontrado');
  return PermissionMapper.toResponseDto(permission);
  }

  async create(data: PermissionCreateDto) {
    const permission = this.permissionRepo.create({
      name: data.name,
      description: data.description,
      moduleId: data.moduleId,
    });
    return this.permissionRepo.save(permission);
  }

  async update(id: number, data: PermissionUpdateDto) {
    const permission = await this.permissionRepo.findOneOrFail({ where: { id } });
    Object.assign(permission, data);
    return this.permissionRepo.save(permission);
  }

  async remove(id: number) {
    await this.permissionRepo.delete(id);
    return { deleted: true };
  }

  async restore(id: number) {
    // No implementado ya que no hay soft delete
    return this.permissionRepo.findOne({ where: { id } });
  }
}
