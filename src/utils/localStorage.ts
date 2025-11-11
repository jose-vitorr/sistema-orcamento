import { Orcamento } from '@/types/orcamento';

const STORAGE_KEY = 'orcamentos';

export const getOrcamentos = (): Orcamento[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const saveOrcamento = (orcamento: Orcamento): void => {
  try {
    const orcamentos = getOrcamentos();
    const index = orcamentos.findIndex(o => o.id === orcamento.id);
    
    if (index >= 0) {
      orcamentos[index] = orcamento;
    } else {
      orcamentos.push(orcamento);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
  } catch (error) {
    console.error('Error saving budget:', error);
  }
};

export const getOrcamentoById = (id: string): Orcamento | undefined => {
  const orcamentos = getOrcamentos();
  return orcamentos.find(o => o.id === id);
};

export const deleteOrcamento = (id: string): void => {
  try {
    const orcamentos = getOrcamentos();
    const filtered = orcamentos.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting budget:', error);
  }
};

export const getNextNumero = (): string => {
  const orcamentos = getOrcamentos();
  const numbers = orcamentos
    .map(o => parseInt(o.numero.replace('OR.', '')))
    .filter(n => !isNaN(n));
  
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `OR.${String(maxNumber + 1).padStart(4, '0')}`;
};
