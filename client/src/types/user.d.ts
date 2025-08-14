// src/types/user.ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  isActive: boolean;
  darkMode: boolean;
  expirationPassword?: string;
  flagPassword: boolean;
  createdAt: string; 
  updatedAt: string;
  deletedAt?: string;
  role?: string;
  roleId?: number;
  password?: string;
  passwordConfirm?: string;
}
