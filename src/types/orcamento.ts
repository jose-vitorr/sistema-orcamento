export type OrcamentoStatus = 'em_aberto' | 'aprovado' | 'recusado' | 'em_analise' | 'cancelado';

export interface OrcamentoItem {
  id: string;
  nome: string;
  tipo: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  total: number;
}

export interface Orcamento {
  id: string;
  numero: string;
  titulo: string;
  status: OrcamentoStatus;
  ocultarNumero: boolean;
  cliente: {
    nome: string;
    celular: string;
    email: string;
    cpfCnpj: string;
    endereco: string;
  };
  relatorioInicial: string;
  ocultarRelatorio: boolean;
  descricaoAtividades: string;
  imagens: string[];
  itens: OrcamentoItem[];
  desconto: number;
  descontoTipo: 'R$' | '%';
  subtotal: number;
  total: number;
  apresentarPrecos: {
    quantidadeTipo: boolean;
    valorUnitario: boolean;
    subtotal: boolean;
    valorTotal: boolean;
  };
  metodosPagemento: string[];
  condicoesContrato: string;
  ocultarCondicoes: boolean;
  observacoes: string;
  ocultarObservacoes: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}
