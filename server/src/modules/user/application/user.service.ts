import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { User } from '../domain/user.entity';
import { UserRole } from '../domain/user-role.entity';
import { Role } from '../../role/domain/role.entity';

import { UserCreateDto } from '../dto/user-create.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { FiltersUserDto } from '../dto/filters-user.dto';
import { UserMapper } from '../interfaces/user.mapper';
import { PasswordService } from './password.service';

// Whitelist de columnas ordenables: mapea snake/camel → prop válida de la entidad
const SORT_MAP: Record<string, string> = {
  createdAt: 'u.createdAt',
  email: 'u.email',
  username: 'u.username',
  firstName: 'u.firstName',
  lastName: 'u.lastName',
  isActive: 'u.isActive',
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly passwordService: PasswordService,
  ) {}

  /**
   * Obtiene todos los usuarios activos (no eliminados)
   */
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({
      where: { deletedAt: IsNull() },
      relations: ['roles', 'roles.role'],
    });
    return users.map(UserMapper.toResponseDto);
  }

  /**
   * Listado paginado + búsqueda
   */
  async findAllPaged(q: FiltersUserDto) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;

    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'ur')
      .leftJoinAndSelect('ur.role', 'r');

    if (!q.withDeleted) qb.andWhere('u.deletedAt IS NULL');

    if (q.q) {
      const like = `%${q.q.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(u.email) LIKE :like OR LOWER(u.username) LIKE :like OR LOWER(u.firstName) LIKE :like OR LOWER(u.lastName) LIKE :like)',
        { like },
      );
    }

    const sortColumn = q.sortBy ? (SORT_MAP[q.sortBy] ?? 'u.createdAt') : 'u.createdAt';
    const sortOrder: 'ASC' | 'DESC' = q.sortOrder ?? 'DESC';

    qb.orderBy(sortColumn, sortOrder);
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [rows, total] = await qb.getManyAndCount();
    return {
      items: rows.map(UserMapper.toResponseDto),
      total,
      page,
      pageSize,
    };
  }

  /**
   * Busca un usuario por ID
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
      withDeleted: true,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return UserMapper.toResponseDto(user);
  }

  /**
   * Crea un nuevo usuario con rol asignado (transacción)
   */
  async create(dto: UserCreateDto): Promise<UserResponseDto> {
    const roleId = dto.roleId;
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();

    await this.validateEmailNotExists(email);
    await this.validateUsernameNotExists(username);
    await this.validateRoleExists(roleId);

    const expiration =
      dto.expirationPassword ??
      (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 6);
        return d;
      })();

    return await this.userRepo.manager.transaction(async (tx) => {
      const password = await this.passwordService.hash(dto.password);

      const user = await tx.getRepository(User).save({
        ...dto,
        email,
        username,
        password,
        flagPassword: true,
        expirationPassword: expiration,
      });

      await tx.getRepository(UserRole).save(
        tx.getRepository(UserRole).create({
          user,
          role: { id: roleId } as Role,
        }),
      );

      const result = await tx.getRepository(User).findOne({
        where: { id: user.id },
        relations: ['roles', 'roles.role'],
      });

      return UserMapper.toResponseDto(result!);
    });
  }

  /**
   * Actualiza un usuario (transacción). Reasigna rol si viene roleId.
   */
  async update(id: number, dto: UserUpdateDto): Promise<UserResponseDto> {
    const email = dto.email?.trim().toLowerCase();
    const username = dto.username?.trim();

    return await this.userRepo.manager.transaction(async (tx) => {
      const repo = tx.getRepository(User);
      const entity = await repo.findOne({ where: { id } });
      if (!entity) throw new NotFoundException('Usuario no encontrado');

      if (email && email !== entity.email) await this.validateEmailNotExists(email);
      if (username && username !== entity.username) await this.validateUsernameNotExists(username);

      Object.assign(entity, {
        ...dto,
        ...(email && { email }),
        ...(username && { username }),
      });

      if (dto.password) {
        entity.password = await this.passwordService.hash(dto.password);
      }

      await repo.save(entity);

      if (dto.roleId) {
        await tx.getRepository(UserRole).delete({ user: { id } });
        await tx.getRepository(UserRole).save(
          tx.getRepository(UserRole).create({
            user: { id } as User,
            role: { id: dto.roleId } as Role,
          }),
        );
      }

      const updated = await repo.findOne({
        where: { id },
        relations: ['roles', 'roles.role'],
      });
      return UserMapper.toResponseDto(updated!);
    });
  }

  /**
   * Soft delete + desactivar
   */
  async remove(id: number): Promise<UserResponseDto> {
    return await this.userRepo.manager.transaction(async (tx) => {
      const repo = tx.getRepository(User);
      const found = await repo.findOne({ where: { id } });
      if (!found) throw new NotFoundException('Usuario no encontrado');

      await repo.softDelete(id);
      await repo.update(id, { isActive: false });

      const deletedUser = await repo.findOne({
        where: { id },
        relations: ['roles', 'roles.role'],
        withDeleted: true,
      });
      return UserMapper.toResponseDto(deletedUser!);
    });
  }

  /**
   * Restore soft delete + activar
   */
  async restore(id: number): Promise<UserResponseDto> {
    return await this.userRepo.manager.transaction(async (tx) => {
      const repo = tx.getRepository(User);
      const found = await repo.findOne({ where: { id }, withDeleted: true });
      if (!found) throw new NotFoundException('Usuario no encontrado');

      await repo.restore(id);
      await repo.update(id, { isActive: true });

      const restored = await repo.findOne({
        where: { id },
        relations: ['roles', 'roles.role'],
      });
      return UserMapper.toResponseDto(restored!);
    });
  }

  private async validateEmailNotExists(email: string): Promise<void> {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('El email ya está registrado en el sistema');
  }

  private async validateUsernameNotExists(username: string): Promise<void> {
    const existing = await this.userRepo.findOne({ where: { username } });
    if (existing) throw new ConflictException('El nombre de usuario ya está en uso');
  }

  private async validateRoleExists(roleId: number): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new BadRequestException('El rol especificado no existe');
  }
}
