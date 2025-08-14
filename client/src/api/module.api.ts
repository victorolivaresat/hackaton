
import axios from "@/lib/api";
import type { Module, CreateModuleDto, UpdateModuleDto, PagedModule } from '../types/module';

export const createModule = async (moduleData: CreateModuleDto): Promise<Module> => {
  const { data } = await axios.post('modules', moduleData);
  return data as Module;
};

export const getAllModules = async (filters?: Record<string, unknown>): Promise<PagedModule> => {
  const { data } = await axios.get('modules', { params: filters });
  return data as PagedModule;
};

export const getAllModulesPublic = async (): Promise<Module[]> => {
  const { data } = await axios.get('modules/public');
  return data as Module[];
};

export const getModuleById = async (id: number): Promise<Module> => {
  const { data } = await axios.get(`modules/${id}`);
  return data as Module;
};

export const updateModule = async (id: number, moduleData: UpdateModuleDto): Promise<Module> => {
  const { data } = await axios.patch(`modules/${id}`, moduleData);
  return data as Module;
};

export const deleteModule = async (id: number): Promise<Module> => {
  const { data } = await axios.delete(`modules/${id}`);
  return data as Module;
};

export const restoreModule = async (id: number): Promise<Module> => {
  const { data } = await axios.patch(`modules/restore/${id}`);
  return data as Module;
};
