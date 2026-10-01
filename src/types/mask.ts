export type OSType = 'comodato' | 'compra' | 'gamer' | 'combo_tv' | 'ponto_adicional';

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

export interface GamerData extends BaseCustomerData {
  plano: string;
  ipFixoPublico: 'Sim (Habilitar)' | 'Não (CGNAT Padrão)' | 'Apenas IP Público Dinâmico';
  roteadorGamer: 'Roteador Wi-Fi 6 de Alta Performance' | 'ONU Wi-Fi 6 Mesh' | 'Cliente possui roteador próprio';
  jogosPlataformas: string;
  cabeamentoPcConsole: 'Sim (Passar cabo direto)' | 'Não (Apenas Wi-Fi)' | 'Cliente já possui cabo';
  qosPrioridade: 'Sim (Baixa latência configurada)' | 'Padrão';
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
