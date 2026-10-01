import { 
  ComodatoData, 
  SmartPreData,
  CompraData, 
  GamerData, 
  ComboData,
  ComboTVData, 
  PontoAdicionalData 
} from '../types/mask';

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
  return `========================================
🎮 MÁSCARA DE O.S. - PLANO GAMER (ALTA PERFORMANCE)
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

[ESPECIFICAÇÕES TÉCNICAS GAMER]
PLANO CONTRATADO: ${data.plano || 'Plano Gamer'}
IP FIXO / PÚBLICO: ${data.ipFixoPublico}
EQUIPAMENTO: ${data.roteadorGamer}
PASSAR CABO DIRETO NO PC/CONSOLE: ${data.cabeamentoPcConsole}
JOGOS/PLATAFORMAS PRINCIPAIS: ${data.jogosPlataformas || 'PC Gamer / Console'}
QOS & PRIORIZAÇÃO DE LATÊNCIA: ${data.qosPrioridade}

[OBSERVAÇÕES TÉCNICAS]
${data.observacoes || 'Verificar rotas e atenuação na fibra para garantir menor ping possível.'}
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
