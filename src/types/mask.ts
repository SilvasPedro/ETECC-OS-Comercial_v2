export type OSType = 'comodato' | 'smart_pre' | 'gamer' | 'combo_tv' | 'avaliacao' | 'e_tracker' | 'ponto_adicional' | 'consulta_cep';

export interface ETrackerData {
  data: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  contato: string;
  titularInternetMesmoVeiculo: 'SIM' | 'NÃO';
  tipoVeiculo: 'MOTO' | 'CARRO' | 'CAMINHÃO' | 'OUTRO';
  outroTipoVeiculo?: string;
  quantidadeVeiculos: string;
  numeroRastreador: string;
  numeroChipRastreador: string;
  numeroLinhaChipCliente: string;
  modeloRastreador: string; // 'XT40' | 'Outro'
}

export interface AvaliacaoTVData {
  data: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  combo: 'TIP' | 'Sky+';
  clienteBaixouApp: 'Sim' | 'Não';
  quantasTvs: string;
  tvSmart: 'Sim' | 'Não';
  termoAceito: 'Sim' | 'Não';
}

export interface AvaliacaoCabeamentoData {
  data: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  servico: 'Ponto Adicional' | 'Cabeamento Plano Gamer';
  isento: 'Sim' | 'Não';
  equipamento: 'Comodato' | 'Do cliente';
  plano: string;
}

export interface ComodatoData {
  dataInstalacao: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  podeAdiantar: 'Sim' | 'Não';
  localizacaoLink: string;
  pontoReferencia: string;
  postePadrao: 'Sim' | 'Não';
  telefone1: string;
  telefone2: string;
  titularAcompanha: 'Sim' | 'Não';
  ladoPraiaMorro: 'Praia' | 'Morro';
  plano: string;
  modalidade: string; // 'KIT GIGA COMODATO' (Fixo)
  comodoInstalacao: string; // 'IRÁ ESCOLHER COM TÉCNICO'
  taxaAtivacao: string; // 'INSTALAÇÃO GRATUITA'
  vendedor: string;
  dataVencimento: '05' | '10' | '15' | '20' | '25';
  avaliacaoPontoAdicional: 'Sim' | 'Não';
}

export interface SmartPreData {
  dataInstalacao: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  podeAdiantar: 'Sim' | 'Não';
  localizacaoLink: string;
  pontoReferencia: string;
  postePadrao: 'Sim' | 'Não';
  telefone1: string;
  telefone2: string;
  titularAcompanha: 'Sim' | 'Não';
  ladoPraiaMorro: 'Praia' | 'Morro';
  plano: string; // '1Gbps - Sistema de Recargas' (Fixo)
  modalidade: string; // 'KIT GIGA SMART-PRÉ' (Fixo)
  comodoInstalacao: string; // 'IRÁ ESCOLHER COM TÉCNICO'
  taxaAtivacao: string; // 'INSTALAÇÃO GRATUITA'
  vendedor: string;
}

export interface BaseCustomerData {
  protocolo: string;
  vendedor: string;
  dataAgendamento: string;
  periodo: 'Manhã (08h às 12h)' | 'Tarde (13h às 18h)' | 'Comercial' | 'Dia Todo' | 'A Definir';
  nomeCliente: string;
  cpfCnpj: string;
  telefone1: string;
  telefone2: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  pontoReferencia: string;
  observacoes: string;
}

export interface CompraData extends BaseCustomerData {
  plano: string;
  itemComprado: string;
  marcaModelo: string;
  serialMac: string;
  condicaoEntrega: 'Técnico leva no momento da instalação' | 'Retirada no balcão' | 'Envio por entregador';
  garantia: string;
  configuracaoDesejada: string;
}

export interface GamerData {
  dataInstalacao: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  podeAdiantar: 'Sim' | 'Não';
  localizacaoLink: string;
  pontoReferencia: string;
  postePadrao: 'Sim' | 'Não';
  telefone1: string;
  telefone2: string;
  titularAcompanha: 'Sim' | 'Não';
  ladoPraiaMorro: 'Praia' | 'Morro';
  plano: string;
  modalidade: string; // 'KIT GIGA COMODATO' (Fixo)
  comodoInstalacao: string; // 'IRÁ ESCOLHER COM TÉCNICO'
  taxaAtivacao: string; // 'INSTALAÇÃO GRATUITA'
  vendedor: string;
  dataVencimento: '05' | '10' | '15' | '20' | '25';
  dispositivosCabeados: string;
}

export interface ComboData {
  dataInstalacao: string;
  periodo: 'Comercial' | 'Primeira do Dia' | 'Manhã' | 'Tarde' | 'Após';
  horarioApos: string;
  podeAdiantar: 'Sim' | 'Não';
  localizacaoLink: string;
  pontoReferencia: string;
  postePadrao: 'Sim' | 'Não';
  telefone1: string;
  telefone2: string;
  titularAcompanha: 'Sim' | 'Não';
  ladoPraiaMorro: 'Praia' | 'Morro';
  tipoCombo: 'Internet + TV' | 'Internet + Telefone' | 'Internet + TV e Telefone';
  plano: string;
  modalidade: string; // 'KIT GIGA COMODATO' (Fixo)
  comodoInstalacao: string; // 'IRÁ ESCOLHER COM TÉCNICO'
  taxaAtivacao: string; // 'INSTALAÇÃO GRATUITA'
  vendedor: string;
}

export interface ComboTVData extends BaseCustomerData {
  planoInternet: string;
  pacoteTv: string;
  qtdTvBoxes: string;
  tipoAparelho: 'TV Box Android 4K' | 'Aplicativo na Smart TV' | 'Decodificador IP';
  pontosTvInstalar: string;
  streamingIncluso: string;
  pontoPrincipal: string;
}

export interface PontoAdicionalData extends BaseCustomerData {
  motivoSolicitacao: string;
  tipoSolucao: 'Ponto de Rede Cabeado (RJ45)' | 'Repetidor Wi-Fi Mesh' | 'Ponto para Smart TV' | 'Ponto para Home Office / PC';
  metragemEstimada: string;
  tipoCabo: 'CAT6 Homologado 100% Cobre' | 'CAT5e Homologado';
  equipamentoInstalado: string;
  comodoOrigem: string;
  comodoDestino: string;
  tipoPassagem: 'Tubulação interna existente' | 'Canaleta aparente' | 'Pelo forro / laje' | 'A avaliar no local';
}

export interface CepItem {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
}
