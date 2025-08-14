import { Role } from '../domain/role.entity';

export interface RoleRepository {
  create(role: Partial<Role>): Promise<Role>;
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  update(id: number, role: Partial<Role>): Promise<Role>;
  delete(id: number): Promise<void>;
}
