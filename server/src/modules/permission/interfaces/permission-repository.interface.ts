import { Permission } from '../domain/permission.entity';

export interface PermissionRepository {
  create(permission: Partial<Permission>): Promise<Permission>;
  findAll(): Promise<Permission[]>;
  findById(id: number): Promise<Permission | null>;
  update(id: number, permission: Partial<Permission>): Promise<Permission>;
  delete(id: number): Promise<void>;
}
