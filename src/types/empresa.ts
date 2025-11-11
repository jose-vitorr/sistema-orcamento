export interface EmpresaConfig {
  logo: string; // base64 ou URL
  nome: string;
  email: string;
  cnpjCpf: string;
  telefone1: string;
  telefone2: string;
  endereco: string;
  atividades: string;
}

export const defaultEmpresaConfig: EmpresaConfig = {
  logo: '',
  nome: 'Minha Empresa LTDA.',
  email: '',
  cnpjCpf: '10.200.300/0001-00',
  telefone1: '',
  telefone2: '',
  endereco: 'Rua exemplo, 123',
  atividades: '',
};
