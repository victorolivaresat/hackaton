// Tipos para API de roles, alineados con los DTOs y respuestas del backend

import type { Permission } from './permission';

export type Role = {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  permissions: Permission[];
};

export type CreateRoleDto = {
  name: string;
  description?: string | null;
  permissions: number[];
};

export type UpdateRoleDto = {
  name?: string;
  description?: string | null;
  permissions?: number[];
};

export type PagedRole = {
  items: Role[];
  total: number;
  page: number;
  pageSize: number;
};