import { OSStatus, OSPriority, PaymentMethod, WorkOrder, CompanyProfile } from '../types/os';

export const formatCurrency = (value: number | undefined | null): string => {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const formatDocument = (value: string): string => {
  const clean = value.replace(/\D/g, '');
  if (clean.length <= 11) {
    // CPF: 000.000.000-00
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  // CNPJ: 00.000.000/0000-00
  return clean
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

export const formatPhone = (value: string): string => {
  const clean = value.replace(/\D/g, '');
  if (clean.length > 10) {
    // Celular: (00) 00000-0000
    return clean
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2')
      .slice(0, 15);
  }
  // Fixo: (00) 0000-0000
  return clean
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4})(\d{4})$/, '$1-$2')
    .slice(0, 14);
};

export const formatCep = (value: string): string => {
  const clean = value.replace(/\D/g, '');
  return clean.replace(/^(\d{5})(\d{1,3})/, '$1-$2').slice(0, 9);
};

export const getStatusMeta = (status: OSStatus): { label: string; bg: string; text: string; border: string; badgeColor: string } => {
  switch (status) {
    case 'budget':
      return { 
        label: 'Orçamento', 
        bg: 'bg-amber-50 text-amber-700 border-amber-200', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        badgeColor: 'bg-amber-500' 
      };
    case 'approved':
      return { 
        label: 'Aprovado', 
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
        text: 'text-indigo-700', 
        border: 'border-indigo-200',
        badgeColor: 'bg-indigo-500' 
      };
    case 'in_progress':
      return { 
        label: 'Em Andamento', 
        bg: 'bg-blue-50 text-blue-700 border-blue-200', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        badgeColor: 'bg-blue-500' 
      };
    case 'waiting_parts':
      return { 
        label: 'Aguardando Peças', 
        bg: 'bg-purple-50 text-purple-700 border-purple-200', 
        text: 'text-purple-700', 
        border: 'border-purple-200',
        badgeColor: 'bg-purple-500' 
      };
    case 'completed':
      return { 
        label: 'Concluído', 
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        badgeColor: 'bg-emerald-500' 
      };
    case 'delivered':
      return { 
        label: 'Entregue / Finalizado', 
        bg: 'bg-slate-100 text-slate-700 border-slate-300', 
        text: 'text-slate-700', 
        border: 'border-slate-300',
        badgeColor: 'bg-slate-600' 
      };
    case 'cancelled':
      return { 
        label: 'Cancelado', 
        bg: 'bg-rose-50 text-rose-700 border-rose-200', 
        text: 'text-rose-700', 
        border: 'border-rose-200',
        badgeColor: 'bg-rose-500' 
      };
    default:
      return { 
        label: 'Desconhecido', 
        bg: 'bg-gray-100 text-gray-700 border-gray-200', 
        text: 'text-gray-700', 
        border: 'border-gray-200',
        badgeColor: 'bg-gray-400' 
      };
  }
};

export const getPriorityMeta = (priority: OSPriority): { label: string; color: string; badge: string } => {
  switch (priority) {
    case 'low':
      return { label: 'Baixa', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' };
    case 'medium':
      return { label: 'Média', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' };
    case 'high':
      return { label: 'Alta', color: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' };
    case 'urgent':
      return { label: 'Urgente', color: 'text-rose-600 font-semibold', badge: 'bg-rose-100 text-rose-700' };
    default:
      return { label: 'Normal', color: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' };
  }
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case 'pix': return 'PIX (Chave ou QR Code)';
    case 'credit': return 'Cartão de Crédito';
    case 'debit': return 'Cartão de Débito';
    case 'cash': return 'Dinheiro';
    case 'transfer': return 'Transferência Bancária / TED';
    case 'boleto': return 'Boleto Bancário';
    case 'installments': return 'Parcelado / Crediário';
    default: return method;
  }
};

export const generateNextOSNumber = (existingOrders: WorkOrder[]): string => {
  const currentYear = new Date().getFullYear();
  let maxSeq = 0;

  for (const o of existingOrders) {
    if (o.number) {
      const match = o.number.match(/OS-(\d{4})-(\d+)/i) || o.number.match(/(\d+)/);
      if (match) {
        const seq = parseInt(match[match.length - 1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const padded = String(nextSeq).padStart(4, '0');
  return `OS-${currentYear}-${padded}`;
};

export const fetchAddressByCep = async (cep: string): Promise<{
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
} | null> => {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;

    return {
      address: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || ''
    };
  } catch (e) {
    console.warn('ViaCEP lookup failed:', e);
    return null;
  }
};

export const buildWhatsAppMessage = (order: WorkOrder, company: CompanyProfile): string => {
  const clientName = order.client.name.split(' ')[0];
  const statusLabel = getStatusMeta(order.status).label;
  
  let msg = `*Olá, ${clientName}! Tudo bem?*\n\n`;
  msg += `Aqui é da *${company.tradeName || company.name}*.\n`;
  msg += `Segue a atualização da sua Ordem de Serviço:\n\n`;
  msg += `📋 *${order.number}*\n`;
  msg += `📌 *Status:* ${statusLabel}\n`;
  msg += `🔧 *Equipamento:* ${order.equipment.type} ${order.equipment.brand} ${order.equipment.model}\n`;
  
  if (order.equipment.reportedDefect) {
    msg += `⚠️ *Defeito Relatado:* ${order.equipment.reportedDefect}\n`;
  }
  
  if (order.equipment.technicalDiagnosis) {
    msg += `🔍 *Laudo Técnico:* ${order.equipment.technicalDiagnosis}\n`;
  }

  msg += `\n*RESUMO FINANCEIRO:*\n`;
  if (order.items && order.items.length > 0) {
    order.items.forEach(item => {
      msg += `• ${item.quantity}x ${item.description}: ${formatCurrency(item.total)}\n`;
    });
  }

  if (order.financial.discount > 0) {
    msg += `Desconto: -${formatCurrency(order.financial.discount)}\n`;
  }

  msg += `*VALOR TOTAL:* ${formatCurrency(order.financial.total)}\n`;
  msg += `Condição: ${getPaymentMethodLabel(order.financial.paymentMethod)}\n`;

  if (company.pixKey) {
    msg += `\n🔑 *Chave PIX:* \`${company.pixKey}\`\n`;
  }

  if (order.warrantyDays > 0) {
    msg += `🛡️ *Garantia:* ${order.warrantyDays} dias\n`;
  }

  msg += `\nPara dúvidas ou aprovação, responda diretamente a esta mensagem!`;

  return msg;
};

export const getWhatsAppLink = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
};
