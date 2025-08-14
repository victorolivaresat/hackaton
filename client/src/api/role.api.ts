
import axios from "@/lib/api";
import type { Role, CreateRoleDto, UpdateRoleDto, PagedRole } from "../types/role";
import type { Permission } from "../types/permission";

export const createRole = async (roleData: CreateRoleDto): Promise<Role> => {
  const { data } = await axios.post('roles', roleData);
  return data as Role;
};

export const getAllRoles = async (filters?: Record<string, unknown>): Promise<PagedRole> => {
  const { data } = await axios.get('roles', { params: filters });
  return data as PagedRole;
};

export const getRoleById = async (id: number): Promise<Role> => {
  const { data } = await axios.get(`roles/${id}`);
  return data as Role;
};

export const updateRole = async (id: number, roleData: UpdateRoleDto): Promise<Role> => {
  const { data } = await axios.patch(`roles/${id}`, roleData);
  return data as Role;
};

export const deleteRole = async (id: number): Promise<Role> => {
  const { data } = await axios.delete(`roles/${id}`);
  return data as Role;
};

export const restoreRole = async (id: number): Promise<Role> => {
  const { data } = await axios.patch(`roles/restore/${id}`);
  return data as Role;
};

export const getAvailablePermissions = async (): Promise<Permission[]> => {
  const { data } = await axios.get('roles/permissions/available');
  return data as Permission[];
};
