import { WorkOrder, Client } from '../types/os';

export const initialSampleClients: Client[] = [
  {
    id: 'cli-001',
    name: 'Carlos Eduardo Mendes',
    document: '287.654.321-09',
    phone: '(11) 98123-4567',
    whatsapp: '5511981234567',
    email: 'carlos.mendes@empresa.com.br',
    zipCode: '04538-133',
    address: 'Rua Joaquim Floriano',
    number: '466',
    complement: 'Sala 802',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Cliente corporativo com faturamento mensal.',
    createdAt: '2026-09-15T10:00:00.000Z'
  },
  {
    id: 'cli-002',
    name: 'Mariana Lima Barbosa',
    document: '342.981.765-44',
    phone: '(11) 99876-5432',
    whatsapp: '5511998765432',
    email: 'mariana.barbosa@gmail.com',
    zipCode: '01419-002',
    address: 'Alameda Santos',
    number: '1800',
    neighborhood: 'Cerqueira César',
    city: 'São Paulo',
    state: 'SP',
    createdAt: '2026-09-20T14:30:00.000Z'
  },
  {
    id: 'cli-003',
    name: 'Logística & Distribuição Express Ltda',
    document: '45.123.789/0001-55',
    phone: '(11) 3211-9000',
    whatsapp: '5511976543210',
    email: 'frota@logexpress.com.br',
    zipCode: '05314-000',
    address: 'Av. Dr. Gastão Vidigal',
    number: '1946',
    neighborhood: 'Vila Leopoldina',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Manutenção de equipamentos de rastreamento e tablets da frota.',
    createdAt: '2026-09-25T09:15:00.000Z'
  }
];

export const initialSampleOrders: WorkOrder[] = [
  {
    id: 'os-1001',
    number: 'OS-2026-0001',
    createdAt: '2026-09-28T09:30:00.000Z',
    scheduledDate: '2026-10-02T18:00:00.000Z',
    status: 'in_progress',
    priority: 'high',
    technicianName: 'Rodrigo Silveira (Téc. Senior)',
    client: {
      id: 'cli-001',
      name: 'Carlos Eduardo Mendes',
      document: '287.654.321-09',
      phone: '(11) 98123-4567',
      whatsapp: '5511981234567',
      email: 'carlos.mendes@empresa.com.br',
      address: 'Rua Joaquim Floriano, 466 - Sala 802',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04538-133'
    },
    equipment: {
      type: 'Notebook',
      brand: 'Dell',
      model: 'Inspiron 15 5000 Series (Core i7 16GB)',
      serialNumberOrPlate: 'BR-DELL-88239A',
      accessories: 'Fonte original bivolt 65W e capa de neoprene preta',
      reportedDefect: 'Aparelho desliga repentinamente após 20 minutos de uso intenso. Barulho excessivo no cooler e aquecimento na base inferior.',
      technicalDiagnosis: 'Pasta térmica original totalmente ressecada e obstrução de poeira nas aletas do dissipador térmico. Teste de estresse confirma superaquecimento (98°C). Recomendada desoxidação e troca de pasta por composto térmico cerâmico.',
      visualCondition: 'Pequeno arranhão superficial na tampa traseira, tela e teclado sem avarias.'
    },
    items: [
      {
        id: 'item-1',
        type: 'service',
        code: 'SRV-02',
        description: 'Manutenção Preventiva, Desobstrução Térmica e Limpeza Ultrassônica',
        quantity: 1,
        unitPrice: 180.00,
        discount: 0,
        total: 180.00,
        technician: 'Rodrigo Silveira'
      },
      {
        id: 'item-2',
        type: 'part',
        code: 'PEC-05',
        description: 'Aplicação de Pasta Térmica Alta Condutividade Artic Silver 5',
        quantity: 1,
        unitPrice: 65.00,
        discount: 0,
        total: 65.00
      },
      {
        id: 'item-3',
        type: 'service',
        code: 'SRV-04',
        description: 'Otimização do Sistema Operacional e Varredura de Diagnóstico',
        quantity: 1,
        unitPrice: 120.00,
        discount: 20.00,
        total: 100.00,
        technician: 'Rodrigo Silveira'
      }
    ],
    financial: {
      servicesSubtotal: 280.00,
      partsSubtotal: 65.00,
      discount: 20.00,
      additionalFee: 0,
      total: 325.00,
      paymentMethod: 'pix',
      paymentStatus: 'pending',
      paidAmount: 0
    },
    warrantyDays: 90,
    warrantyTerms: 'Garantia de 90 dias referente aos serviços de limpeza térmica e peças aplicadas, nos termos do Art. 26 do CDC.',
    internalNotes: 'Cliente com pressa por motivo de viagem na sexta-feira.',
    clientNotes: 'Fazer backup prévio dos arquivos do desktop por precaução.',
    updatedAt: '2026-09-28T11:00:00.000Z'
  },
  {
    id: 'os-1002',
    number: 'OS-2026-0002',
    createdAt: '2026-09-26T14:15:00.000Z',
    scheduledDate: '2026-09-29T12:00:00.000Z',
    completedDate: '2026-09-29T11:45:00.000Z',
    status: 'completed',
    priority: 'medium',
    technicianName: 'Lucas Ferreira',
    client: {
      id: 'cli-002',
      name: 'Mariana Lima Barbosa',
      document: '342.981.765-44',
      phone: '(11) 99876-5432',
      whatsapp: '5511998765432',
      email: 'mariana.barbosa@gmail.com',
      address: 'Alameda Santos, 1800',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01419-002'
    },
    equipment: {
      type: 'Smartphone',
      brand: 'Apple',
      model: 'iPhone 13 128GB Estelar',
      serialNumberOrPlate: 'IMEI: 354928104820194',
      accessories: 'Aparelho entregue com película de vidro danificada, sem carregador.',
      reportedDefect: 'Display com linhas verticais coloridas e touch com falha no canto superior direito após impacto.',
      technicalDiagnosis: 'Módulo de tela OLED danificado internamente. Placa lógica e bateria com 91% de saúde, totalmente operacionais. Substituição de tela recomendada.',
      visualCondition: 'Bordas em alumínio com marcas de impacto no canto inferior direito.'
    },
    items: [
      {
        id: 'item-4',
        type: 'part',
        code: 'TEL-13',
        description: 'Módulo Display OLED Super Retina XDR com TrueTone restaurado',
        quantity: 1,
        unitPrice: 690.00,
        discount: 40.00,
        total: 650.00
      },
      {
        id: 'item-5',
        type: 'service',
        code: 'SRV-01',
        description: 'Mão de Obra de Troca de Tela e Vedação IP68 com Prensa Especial',
        quantity: 1,
        unitPrice: 150.00,
        discount: 0,
        total: 150.00,
        technician: 'Lucas Ferreira'
      },
      {
        id: 'item-6',
        type: 'part',
        code: 'ACC-01',
        description: 'Película de Vidro 9D e Limpeza Externa Cortesia',
        quantity: 1,
        unitPrice: 35.00,
        discount: 35.00,
        total: 0.00
      }
    ],
    financial: {
      servicesSubtotal: 150.00,
      partsSubtotal: 650.00,
      discount: 75.00,
      additionalFee: 0,
      total: 800.00,
      paymentMethod: 'credit',
      installmentsCount: 3,
      paymentStatus: 'paid',
      paidAmount: 800.00
    },
    warrantyDays: 90,
    warrantyTerms: 'Garantia de 90 dias contra defeitos de fabricação da tela substituída. Danos físicos posteriores, quebra ou exposição a líquidos invalidam o termo.',
    internalNotes: 'TrueTone calibrado com sucesso através do gravador.',
    updatedAt: '2026-09-29T12:00:00.000Z'
  },
  {
    id: 'os-1003',
    number: 'OS-2026-0003',
    createdAt: '2026-09-30T16:20:00.000Z',
    scheduledDate: '2026-10-05T17:00:00.000Z',
    status: 'budget',
    priority: 'urgent',
    technicianName: 'Rodrigo Silveira',
    client: {
      id: 'cli-003',
      name: 'Logística & Distribuição Express Ltda',
      document: '45.123.789/0001-55',
      phone: '(11) 3211-9000',
      whatsapp: '5511976543210',
      email: 'frota@logexpress.com.br',
      address: 'Av. Dr. Gastão Vidigal, 1946',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05314-000'
    },
    equipment: {
      type: 'Industrial / Eletrônico',
      brand: 'Zebra / Motorola',
      model: 'Coletor de Dados TC21 Industrial (Lote de 3 unidades)',
      serialNumberOrPlate: 'SN: ZB-883910 / ZB-883911 / ZB-883912',
      accessories: '3 Baterias recarregáveis e 1 base dock quádrupla de recarga.',
      reportedDefect: '1 unidade não lê código de barras laser. 2 unidades com conectores de carga USB soltos e desligamento intermitente.',
      technicalDiagnosis: 'Orçamento solicitado para troca de leitor 2D SE4710 e ressoldagem do conector dock reforçado.',
      visualCondition: 'Aparelhos com marcas normais de uso em ambiente logístico de galpão.'
    },
    items: [
      {
        id: 'item-7',
        type: 'service',
        code: 'SRV-03',
        description: 'Recuperação de Placa Controladora e Reconstrução de Barramento Dock (x2)',
        quantity: 2,
        unitPrice: 220.00,
        discount: 40.00,
        total: 400.00,
        technician: 'Rodrigo Silveira'
      },
      {
        id: 'item-8',
        type: 'part',
        code: 'SCAN-2D',
        description: 'Substituição de Módulo Óptico Leitor Imager 2D Zebra Original',
        quantity: 1,
        unitPrice: 580.00,
        discount: 0,
        total: 580.00
      },
      {
        id: 'item-9',
        type: 'service',
        code: 'SRV-05',
        description: 'Visita Técnica e Coleta de Equipamentos In-Loco',
        quantity: 1,
        unitPrice: 90.00,
        discount: 0,
        total: 90.00
      }
    ],
    financial: {
      servicesSubtotal: 490.00,
      partsSubtotal: 580.00,
      discount: 40.00,
      additionalFee: 0,
      total: 1070.00,
      paymentMethod: 'boleto',
      paymentStatus: 'pending',
      paidAmount: 0
    },
    warrantyDays: 90,
    warrantyTerms: 'Termo de garantia padrão de 90 dias.',
    internalNotes: 'Aguardando aprovação formal do gestor de compras da empresa.',
    updatedAt: '2026-09-30T17:00:00.000Z'
  }
];

export const seedInitialDataIfEmpty = () => {
  if (!localStorage.getItem('os_comercial_orders')) {
    localStorage.setItem('os_comercial_orders', JSON.stringify(initialSampleOrders));
  }
  if (!localStorage.getItem('os_comercial_clients')) {
    localStorage.setItem('os_comercial_clients', JSON.stringify(initialSampleClients));
  }
};
