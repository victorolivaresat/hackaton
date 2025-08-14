
import axios from "@/lib/api";
import type { Permission, CreatePermissionDto, UpdatePermissionDto, PagedPermission } from '../types/permission';

export const createPermission = async (permissionData: CreatePermissionDto): Promise<Permission> => {
  const { data } = await axios.post('permissions', permissionData);
  return data as Permission;
};

export const getAllPermissions = async (filters?: Record<string, unknown>): Promise<PagedPermission> => {
  const { data } = await axios.get('permissions', { params: filters });
  return data as PagedPermission;
};

export const getPermissionById = async (id: number): Promise<Permission> => {
  const { data } = await axios.get(`permissions/${id}`);
  return data as Permission;
};

export const updatePermission = async (id: number, permissionData: UpdatePermissionDto): Promise<Permission> => {
  const { data } = await axios.patch(`permissions/${id}`, permissionData);
  return data as Permission;
};

export const deletePermission = async (id: number): Promise<Permission> => {
  const { data } = await axios.delete(`permissions/${id}`);
  return data as Permission;
};

export const restorePermission = async (id: number): Promise<Permission> => {
  const { data } = await axios.patch(`permissions/restore/${id}`);
  return data as Permission;
};
