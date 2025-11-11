import { OrcamentoItem } from '@/types/orcamento';

export const calculateItemTotal = (item: Partial<OrcamentoItem>): number => {
  const quantidade = item.quantidade || 0;
  const precoUnitario = item.precoUnitario || 0;
  const desconto = item.desconto || 0;
  
  const subtotal = quantidade * precoUnitario;
  return Math.max(0, subtotal - desconto);
};

export const calculateSubtotal = (itens: OrcamentoItem[]): number => {
  return itens.reduce((sum, item) => sum + item.total, 0);
};

export const calculateTotal = (
  subtotal: number,
  desconto: number,
  descontoTipo: 'R$' | '%'
): number => {
  if (descontoTipo === '%') {
    return Math.max(0, subtotal - (subtotal * desconto / 100));
  }
  return Math.max(0, subtotal - desconto);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};
