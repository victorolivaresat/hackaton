
// Tipos para API de permisos, alineados con los DTOs y respuestas del backend

export type Permission = {
  id: number;
  name: string;
  description?: string | null;
  module: {
    id: number;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CreatePermissionDto = {
  name: string;
  description?: string | null;
  moduleId: number;
};

export type UpdatePermissionDto = {
  name?: string;
  description?: string | null;
  moduleId?: number;
};

export type PagedPermission = {
  items: Permission[];
  total: number;
  page: number;
  pageSize: number;
};
