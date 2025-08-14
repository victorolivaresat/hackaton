
// Tipos para API de módulos, alineados con los DTOs y respuestas del backend

export type Module = {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CreateModuleDto = {
  name: string;
  description?: string | null;
};

export type UpdateModuleDto = {
  name?: string;
  description?: string | null;
};

export type PagedModule = {
  items: Module[];
  total: number;
  page: number;
  pageSize: number;
};
