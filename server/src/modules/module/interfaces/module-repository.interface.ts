import { Module } from '../domain/module.entity';

export interface ModuleRepository {
  create(module: Partial<Module>): Promise<Module>;
  findAll(): Promise<Module[]>;
  findById(id: number): Promise<Module | null>;
  update(id: number, module: Partial<Module>): Promise<Module>;
  delete(id: number): Promise<void>;
}
