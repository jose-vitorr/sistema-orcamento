import { EmpresaConfig, defaultEmpresaConfig } from '@/types/empresa';

const STORAGE_KEY = 'empresa_config';

export const getEmpresaConfig = (): EmpresaConfig => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultEmpresaConfig;
  } catch (error) {
    console.error('Error loading company config:', error);
    return defaultEmpresaConfig;
  }
};

export const saveEmpresaConfig = (config: EmpresaConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving company config:', error);
  }
};
