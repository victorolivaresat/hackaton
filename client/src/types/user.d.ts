
// Tipos para API de usuarios, alineados con los DTOs y respuestas del backend

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string | null;
  isActive: boolean;
  darkMode: boolean;
  expirationPassword?: string | null;
  flagPassword: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  role: {
    id: number;
    name: string;
  };
};

export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string | null;
  isActive?: boolean;
  darkMode?: boolean;
  expirationPassword?: string | null;
  flagPassword?: boolean;
  roleId: number;
  password: string;
};

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  profileImage?: string | null;
  isActive?: boolean;
  darkMode?: boolean;
  expirationPassword?: string | null;
  flagPassword?: boolean;
  roleId?: number;
  password?: string;
};

export type PagedUser = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
};
