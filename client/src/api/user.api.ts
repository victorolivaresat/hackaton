import axios from "@/lib/api";
import type { User, CreateUserDto, UpdateUserDto, PagedUser } from '../types/user';

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const { data } = await axios.post('users', userData);
  return data as User;
};

export const getAllUsers = async (filters?: Record<string, unknown>): Promise<PagedUser> => {
  const { data } = await axios.get('users', { params: filters });
  return data as PagedUser;
};

export const getUserById = async (id: number): Promise<User> => {
  const { data } = await axios.get(`users/${id}`);
  return data as User;
};

export const updateUser = async (id: number, userData: UpdateUserDto): Promise<User> => {
  const { data } = await axios.patch(`users/${id}`, userData);
  return data as User;
};

export const deleteUser = async (id: number): Promise<User> => {
  const { data } = await axios.delete(`users/${id}`);
  return data as User;
};

export const restoreUser = async (id: number): Promise<User> => {
  const { data } = await axios.patch(`users/restore/${id}`);
  return data as User;
};
