/**
 * Data structures for Gerador de OS Comercial
 */

export type OSStatus = 
  | 'budget'        // Orçamento
  | 'approved'      // Aprovado
  | 'in_progress'   // Em Andamento
  | 'waiting_parts' // Aguardando Peças
  | 'completed'     // Concluído
  | 'delivered'     // Entregue / Finalizado
  | 'cancelled';    // Cancelado

export type OSPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PaymentMethod = 
  | 'pix' 
  | 'credit' 
  | 'debit' 
  | 'cash' 
  | 'transfer' 
  | 'boleto' 
  | 'installments';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'cancelled';

export interface CompanyProfile {
  name: string;
  tradeName?: string;
  document: string; // CNPJ / CPF
  ie?: string; // Inscrição Estadual
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl?: string;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  defaultWarrantyTerms: string;
  defaultNotes?: string;
}

export interface Client {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  phone: string;
  whatsapp?: string;
  email?: string;
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceOrPartItem {
  id: string;
  type: 'service' | 'part';
  code?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  technician?: string;
}

export interface CatalogItem {
  id: string;
  type: 'service' | 'part';
  code?: string;
  name: string;
  defaultPrice: number;
  category?: string;
}

export interface WorkOrder {
  id: string;
  number: string; // e.g. "OS-2026-0001"
  createdAt: string; // ISO string
  scheduledDate?: string; // Previsão de entrega
  completedDate?: string;
  status: OSStatus;
  priority: OSPriority;
  technicianName?: string;
  
  // Client details (snapshot)
  client: {
    id?: string;
    name: string;
    document: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };

  // Object / Equipment under service
  equipment: {
    type: string; // Celular, Notebook, Veículo, Ar Condicionado, Máquina, Equipamento Geral, etc.
    brand: string;
    model: string;
    serialNumberOrPlate?: string; // Número de série, Chassi, Placa ou IMEI
    accessories?: string; // Acessórios entregues junto (fonte, cabos, chaves, capa)
    reportedDefect: string; // Defeito reclamado pelo cliente
    technicalDiagnosis?: string; // Diagnóstico e laudo técnico do especialista
    visualCondition?: string; // Condição física, avarias estéticas, riscos
  };

  // Itemized Services and Parts
  items: ServiceOrPartItem[];

  // Financial details
  financial: {
    servicesSubtotal: number;
    partsSubtotal: number;
    discount: number;
    additionalFee: number; // frete, taxa de deslocamento, visita
    total: number;
    paymentMethod: PaymentMethod;
    installmentsCount?: number;
    paymentStatus: PaymentStatus;
    paidAmount?: number;
    dueDate?: string;
  };

  // Warranty and Legal Terms
  warrantyDays: number;
  warrantyTerms: string;
  internalNotes?: string;
  clientNotes?: string;

  // Digital Signatures
  signatures?: {
    clientSignature?: string; // base64 canvas image data URL
    technicianSignature?: string;
    signedAt?: string;
    clientSignerName?: string;
    clientSignerDoc?: string;
  };

  // Metadata
  photos?: string[];
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  budgetsCount: number;
  inProgressCount: number;
  completedCount: number;
  totalRevenue: number;
  pendingRevenue: number;
}
