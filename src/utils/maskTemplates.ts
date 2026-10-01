import { 
  ComodatoData, 
  SmartPreData,
  CompraData, 
  GamerData, 
  ComboData,
  ComboTVData, 
  PontoAdicionalData,
  AvaliacaoTVData,
  AvaliacaoCabeamentoData,
  ETrackerData
} from '../types/mask';

export const formatMaskETracker = (data: ETrackerData): string => {
  let formattedData = data.data;
  if (data.data && data.data.includes('-')) {
    const parts = data.data.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  const tipoVeiculoTexto = data.tipoVeiculo === 'OUTRO' && data.outroTipoVeiculo
    ? `OUTRO (${data.outroTipoVeiculo})`
    : data.tipoVeiculo;

  return `========================================
🚗 MÁSCARA DE O.S. - E-TRACKER
========================================
DATA: ${formattedData || ''}
PERÍODO: ${periodoTexto || ''}
CONTATO: ${data.contato || ''}
TITULAR DA INTERNET É O MESMO DO VEICULO: ${data.titularInternetMesmoVeiculo || 'SIM'}
TIPO DO VEICULO: ${tipoVeiculoTexto || 'CARRO'}
QUANTIDADE DE VEICULOS: ${data.quantidadeVeiculos || '1'}
NUMERO DO RASTREADOR: ${data.numeroRastreador || ''}
NUMERO DO CHIP DO RASTREADOR: ${data.numeroChipRastreador || ''}
NUMERO DA LINHA DO CHIP (CLIENTE): ${data.numeroLinhaChipCliente || ''}
MODELO RASTREADOR: ${data.modeloRastreador || 'XT40'}
========================================`;
};

export const formatMaskAvaliacaoTV = (data: AvaliacaoTVData): string => {
  let formattedData = data.data;
  if (data.data && data.data.includes('-')) {
    const parts = data.data.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
📋 MÁSCARA DE O.S. - AVALIAÇÃO CABEAMENTO TV
========================================
Data: ${formattedData || ''}
Período: ${periodoTexto || ''}
Combo: ${data.combo || 'TIP'}
Cliente baixou App: ${data.clienteBaixouApp || 'Não'}
Quantas TV's: ${data.quantasTvs || '1'}
TV Smart?: ${data.tvSmart || 'Sim'}
Termo Aceito: ${data.termoAceito || 'Sim'}
========================================`;
};

export const formatMaskAvaliacaoCabeamento = (data: AvaliacaoCabeamentoData): string => {
  let formattedData = data.data;
  if (data.data && data.data.includes('-')) {
    const parts = data.data.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
📋 MÁSCARA DE O.S. - AVALIAÇÃO CABEAMENTO
========================================
Data: ${formattedData || ''}
Período: ${periodoTexto || ''}
Serviço: ${data.servico || 'Ponto Adicional'}
Isento: ${data.isento || 'Não'}
Equipamento: ${data.equipamento || 'Comodato'}
Plano: ${data.plano || ''}
========================================`;
};

export const formatMaskComodato = (data: ComodatoData): string => {
  let formattedData = data.dataInstalacao;
  if (data.dataInstalacao && data.dataInstalacao.includes('-')) {
    const parts = data.dataInstalacao.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
📋 MÁSCARA DE O.S. - COMODATO
========================================
Data da Instalação: ${formattedData || ''}
Período: ${periodoTexto || ''}
Pode Adiantar?: ${data.podeAdiantar || 'Não'}
Localização (Link Google): ${data.localizacaoLink || ''}
Ponto de referência: ${data.pontoReferencia || 'Não informado'}
Poste Padrão: ${data.postePadrao || 'Sim'}
Telefone 1: ${data.telefone1 || ''}
Telefone 2: ${data.telefone2 || 'Não informado'}
Titular irá acompanhar a instalação: ${data.titularAcompanha || 'Sim'}
Lado Praia ou Morro: ${data.ladoPraiaMorro || 'Praia'}
Plano: ${data.plano || '600Mbps RES - R$109,90'}
Modalidade: KIT GIGA COMODATO
Comodo de Instalação: ${data.comodoInstalacao || 'IRÁ ESCOLHER COM TÉCNICO'}
Taxa de Ativação: ${data.taxaAtivacao || 'INSTALAÇÃO GRATUITA'}
Vendedor(a): ${data.vendedor || ''}
Data de vencimento: ${data.dataVencimento || '10'}
Avaliação para ponto adicional: ${data.avaliacaoPontoAdicional || 'Não'}
========================================`;
};

export const formatMaskSmartPre = (data: SmartPreData): string => {
  let formattedData = data.dataInstalacao;
  if (data.dataInstalacao && data.dataInstalacao.includes('-')) {
    const parts = data.dataInstalacao.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
📋 MÁSCARA DE O.S. - SMART-PRÉ
========================================
Data da Instalação: ${formattedData || ''}
Período: ${periodoTexto || ''}
Pode Adiantar?: ${data.podeAdiantar || 'Não'}
Localização (Link Google): ${data.localizacaoLink || ''}
Ponto de referência: ${data.pontoReferencia || 'Não informado'}
Poste Padrão: ${data.postePadrao || 'Sim'}
Telefone 1: ${data.telefone1 || ''}
Telefone 2: ${data.telefone2 || 'Não informado'}
Titular irá acompanhar a instalação: ${data.titularAcompanha || 'Sim'}
Lado Praia ou Morro: ${data.ladoPraiaMorro || 'Praia'}
Plano: 1Gbps - Sistema de Recargas
Modalidade: KIT GIGA SMART-PRÉ
Comodo de Instalação: ${data.comodoInstalacao || 'IRÁ ESCOLHER COM TÉCNICO'}
Taxa de Ativação: ${data.taxaAtivacao || 'INSTALAÇÃO GRATUITA'}
Vendedor(a): ${data.vendedor || ''}
========================================`;
};

export const formatMaskCompra = (data: CompraData): string => {
  return `========================================
📋 MÁSCARA DE O.S. - EQUIPAMENTO DE COMPRA
========================================
PROTOCOLO: ${data.protocolo || 'N/A'}
DATA AGENDAMENTO: ${data.dataAgendamento || 'A definir'}
PERÍODO: ${data.periodo}
VENDEDOR(A): ${data.vendedor || 'Comercial'}

[DADOS DO CLIENTE]
NOME: ${data.nomeCliente || 'N/A'}
CPF/CNPJ: ${data.cpfCnpj || 'N/A'}
CONTATO 1: ${data.telefone1 || 'N/A'}
CONTATO 2: ${data.telefone2 || 'Não informado'}
ENDEREÇO: ${data.endereco || ''}${data.numero ? `, Nº ${data.numero}` : ''}${data.complemento ? ` - ${data.complemento}` : ''}
BAIRRO: ${data.bairro || 'N/A'}
CIDADE: ${data.cidade || 'N/A'}
CEP: ${data.cep || 'N/A'}
REF: ${data.pontoReferencia || 'Não informada'}

[ITEM / EQUIPAMENTO ADQUIRIDO]
PLANO VINCULADO: ${data.plano || 'Nenhum / Venda Avulsa'}
ITEM: ${data.itemComprado || 'Roteador / Acessório'}
MARCA/MODELO: ${data.marcaModelo || 'Conforme estoque'}
Nº DE SÉRIE / MAC: ${data.serialMac || 'Preencher pelo técnico no local'}
ENTREGA/INSTALAÇÃO: ${data.condicaoEntrega}
GARANTIA: ${data.garantia || 'Garantia legal'}
CONFIGURAÇÃO: ${data.configuracaoDesejada || 'Configurar nome de rede (SSID) e senha'}

[OBSERVAÇÕES DA VENDA]
${data.observacoes || 'Nenhuma observação adicional.'}
========================================`;
};

export const formatMaskGamer = (data: GamerData): string => {
  let formattedData = data.dataInstalacao;
  if (data.dataInstalacao && data.dataInstalacao.includes('-')) {
    const parts = data.dataInstalacao.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
🎮 MÁSCARA DE O.S. - GAMER
========================================
Data da Instalação: ${formattedData || ''}
Período: ${periodoTexto || ''}
Pode Adiantar?: ${data.podeAdiantar || 'Não'}
Localização (Link Google): ${data.localizacaoLink || ''}
Ponto de referência: ${data.pontoReferencia || 'Não informado'}
Poste Padrão: ${data.postePadrao || 'Sim'}
Telefone 1: ${data.telefone1 || ''}
Telefone 2: ${data.telefone2 || 'Não informado'}
Titular irá acompanhar a instalação: ${data.titularAcompanha || 'Sim'}
Lado Praia ou Morro: ${data.ladoPraiaMorro || 'Praia'}
Plano: ${data.plano || 'Gamer 1Gbps + ExitLAG - R$169,90'}
Modalidade: KIT GIGA COMODATO
Comodo de Instalação: ${data.comodoInstalacao || 'IRÁ ESCOLHER COM TÉCNICO'}
Taxa de Ativação: ${data.taxaAtivacao || 'INSTALAÇÃO GRATUITA'}
Vendedor(a): ${data.vendedor || ''}
Data de vencimento: ${data.dataVencimento || '10'}
Qtd. e Dispositivos que serão cabeados: ${data.dispositivosCabeados || '1 PC, 1 Console, 1 TV (Até 2 cabeamentos)'}
========================================`;
};

export const formatMaskCombo = (data: ComboData): string => {
  let formattedData = data.dataInstalacao;
  if (data.dataInstalacao && data.dataInstalacao.includes('-')) {
    const parts = data.dataInstalacao.split('-');
    if (parts.length === 3) {
      formattedData = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const periodoTexto = data.periodo === 'Após'
    ? `Após (${data.horarioApos || 'Informar horário'})`
    : data.periodo;

  return `========================================
📋 MÁSCARA DE O.S. - COMBO
========================================
Data da Instalação: ${formattedData || ''}
Período: ${periodoTexto || ''}
Pode Adiantar?: ${data.podeAdiantar || 'Não'}
Localização (Link Google): ${data.localizacaoLink || ''}
Ponto de referência: ${data.pontoReferencia || 'Não informado'}
Poste Padrão: ${data.postePadrao || 'Sim'}
Telefone 1: ${data.telefone1 || ''}
Telefone 2: ${data.telefone2 || 'Não informado'}
Titular irá acompanhar a instalação: ${data.titularAcompanha || 'Sim'}
Lado Praia ou Morro: ${data.ladoPraiaMorro || 'Praia'}
Tipo de Combo: ${data.tipoCombo || 'Internet + TV'}
Plano: ${data.plano || 'Combo Básico - 139,90'}
Modalidade: KIT GIGA COMODATO (FIXO)
Comodo de Instalação: ${data.comodoInstalacao || 'IRÁ ESCOLHER COM TÉCNICO'}
Taxa de Ativação: ${data.taxaAtivacao || 'INSTALAÇÃO GRATUITA'}
Vendedor(a): ${data.vendedor || ''}
========================================`;
};

export const formatMaskPontoAdicional = (data: PontoAdicionalData): string => {
  return `========================================
🔌 MÁSCARA DE O.S. - PONTO ADICIONAL / CABEAMENTO
========================================
PROTOCOLO: ${data.protocolo || 'N/A'}
DATA AGENDAMENTO: ${data.dataAgendamento || 'A definir'}
PERÍODO: ${data.periodo}
VENDEDOR(A): ${data.vendedor || 'Comercial'}

[DADOS DO CLIENTE]
NOME: ${data.nomeCliente || 'N/A'}
CPF/CNPJ: ${data.cpfCnpj || 'N/A'}
CONTATO 1: ${data.telefone1 || 'N/A'}
CONTATO 2: ${data.telefone2 || 'Não informado'}
ENDEREÇO: ${data.endereco || ''}${data.numero ? `, Nº ${data.numero}` : ''}${data.complemento ? ` - ${data.complemento}` : ''}
BAIRRO: ${data.bairro || 'N/A'}
CIDADE: ${data.cidade || 'N/A'}
CEP: ${data.cep || 'N/A'}
REF: ${data.pontoReferencia || 'Não informada'}

[DETALHES DO CABEAMENTO / PONTO]
SOLICITAÇÃO: ${data.motivoSolicitacao || 'Extensão de rede / cabo adicional'}
TIPO DE SERVIÇO: ${data.tipoSolucao}
METRAGEM ESTIMADA DE CABO: ${data.metragemEstimada || 'Até 15 metros'}
TIPO DO CABO: ${data.tipoCabo}
EQUIPAMENTO A INSTALAR NO PONTO: ${data.equipamentoInstalado || 'Conector RJ45 Macho / Tomada de parede'}
CÔMODO DE ORIGEM: ${data.comodoOrigem || 'Onde está o roteador principal'}
CÔMODO DE DESTINO: ${data.comodoDestino || 'Quarto / Escritório'}
TIPO DE PASSAGEM: ${data.tipoPassagem}

[OBSERVAÇÕES DO TÉCNICO]
${data.observacoes || 'Testar velocidade no ponto final com testador de cabo ou notebook.'}
========================================`;
};

export const defaultBaseData = {
  protocolo: '',
  vendedor: '',
  dataAgendamento: '',
  periodo: 'Manhã (08h às 12h)' as const,
  nomeCliente: '',
  cpfCnpj: '',
  telefone1: '',
  telefone2: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  pontoReferencia: '',
  observacoes: ''
};
