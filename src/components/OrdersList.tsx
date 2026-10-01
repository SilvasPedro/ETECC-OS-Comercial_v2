import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Printer, 
  Share2, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Phone,
  Calendar,
  Layers,
  MoreVertical,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WorkOrder, CompanyProfile, OSStatus, OSPriority } from '../types/os';
import { 
  formatCurrency, 
  formatDate, 
  formatPhone, 
  getStatusMeta, 
  getPriorityMeta, 
  buildWhatsAppMessage, 
  getWhatsAppLink 
} from '../utils/formatters';

interface OrdersListProps {
  orders: WorkOrder[];
  company: CompanyProfile;
  onNewOrder: () => void;
  onViewOrder: (order: WorkOrder) => void;
  onEditOrder: (order: WorkOrder) => void;
  onDeleteOrder: (id: string) => void;
  onQuickStatusChange: (id: string, newStatus: OSStatus) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  company,
  onNewOrder,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onQuickStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OSStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | OSPriority>('all');

  // Metrics Calculations
  const totalOrders = orders.length;
  const inProgressCount = orders.filter(o => o.status === 'in_progress').length;
  const budgetCount = orders.filter(o => o.status === 'budget').length;
  const completedCount = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + (Number(curr.financial?.total) || 0), 0);

  const pendingRevenue = orders
    .filter(o => o.financial?.paymentStatus !== 'paid' && o.status !== 'cancelled')
    .reduce((acc, curr) => acc + (Number(curr.financial?.total) || 0), 0);

  // Filtering
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    // Priority filter
    if (priorityFilter !== 'all' && order.priority !== priorityFilter) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNumber = order.number.toLowerCase().includes(q);
      const matchClient = order.client.name.toLowerCase().includes(q);
      const matchPhone = (order.client.phone || '').includes(q);
      const matchDoc = (order.client.document || '').includes(q);
      const matchEquip = (
        (order.equipment.brand || '') + ' ' +
        (order.equipment.model || '') + ' ' +
        (order.equipment.type || '') + ' ' +
        (order.equipment.serialNumberOrPlate || '')
      ).toLowerCase().includes(q);
      const matchDefect = (order.equipment.reportedDefect || '').toLowerCase().includes(q);

      return matchNumber || matchClient || matchPhone || matchDoc || matchEquip || matchDefect;
    }

    return true;
  });

  const handleWhatsAppClick = (order: WorkOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = buildWhatsAppMessage(order, company);
    const link = getWhatsAppLink(order.client.phone || order.client.whatsapp || '', text);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* TOP DASHBOARD METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total OS */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total de OS</span>
            <div className="text-xl font-black text-slate-900">{totalOrders}</div>
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Em Andamento</span>
            <div className="text-xl font-black text-indigo-600">{inProgressCount}</div>
          </div>
        </div>

        {/* Card 3: Orçamentos */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Orçamentos</span>
            <div className="text-xl font-black text-amber-600">{budgetCount}</div>
          </div>
        </div>

        {/* Card 4: Concluídas */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Finalizadas</span>
            <div className="text-xl font-black text-emerald-600">{completedCount}</div>
          </div>
        </div>

        {/* Card 5: Faturamento */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Volume Comercial</span>
            <div className="text-lg font-black font-mono text-emerald-400">{formatCurrency(totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por Nº da OS, Cliente, Telefone, Marca, Modelo ou Defeito..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Selector */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">Todas as Prioridades</option>
              <option value="urgent">Apenas Urgentes</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>

            {/* Nova OS Action */}
            <button
              onClick={onNewOrder}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nova Ordem de Serviço
            </button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Todas as Ordens' },
            { id: 'budget', label: 'Orçamentos' },
            { id: 'approved', label: 'Aprovadas' },
            { id: 'in_progress', label: 'Em Andamento' },
            { id: 'waiting_parts', label: 'Aguardando Peças' },
            { id: 'completed', label: 'Concluídas' },
            { id: 'delivered', label: 'Entregues' },
            { id: 'cancelled', label: 'Canceladas' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium text-[11px] ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST / CARDS */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma Ordem de Serviço encontrada</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {searchTerm || statusFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca ou o status selecionado.' 
              : 'Comece criando a primeira Ordem de Serviço comercial para seus atendimentos.'}
          </p>
          <button
            onClick={onNewOrder}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Criar Ordem de Serviço Agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const statusMeta = getStatusMeta(order.status);
            const priorityMeta = getPriorityMeta(order.priority);

            return (
              <div
                key={order.id}
                onClick={() => onViewOrder(order)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-4 sm:p-5 cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: OS Identification & Client */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-sm text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                        {order.number}
                      </span>

                      {/* Status Selector Direct */}
                      <select
                        value={order.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => onQuickStatusChange(order.id, e.target.value as OSStatus)}
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-0.5 border cursor-pointer ${statusMeta.bg} focus:outline-none`}
                      >
                        <option value="budget">Orçamento</option>
                        <option value="approved">Aprovado</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="waiting_parts">Aguardando Peças</option>
                        <option value="completed">Concluído</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>

                      <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${priorityMeta.badge}`}>
                        {priorityMeta.label}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {order.client.name}
                      </h4>
                      {order.client.phone && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {formatPhone(order.client.phone)}
                        </span>
                      )}
                    </div>

                    {/* Equipment & Defect */}
                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {order.equipment.type}: {order.equipment.brand} {order.equipment.model}
                      </span>
                      {order.equipment.serialNumberOrPlate && (
                        <span className="text-slate-400 font-mono text-[11px]">
                          SN: {order.equipment.serialNumberOrPlate}
                        </span>
                      )}
                      {order.equipment.reportedDefect && (
                        <span className="text-slate-500 truncate max-w-md">
                          • Defeito: {order.equipment.reportedDefect}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Financial & Quick Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total da OS</span>
                      <div className="text-lg font-black font-mono text-slate-900">
                        {formatCurrency(order.financial?.total)}
                      </div>
                      <span className={`inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        order.financial?.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.financial?.paymentStatus === 'paid' ? 'Pago' : 'Pendente'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleWhatsAppClick(order, e)}
                        title="Enviar no WhatsApp"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl border border-emerald-200 transition"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewOrder(order)}
                        title="Imprimir / Ver A4"
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditOrder(order)}
                        title="Editar OS"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-200 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Deseja realmente excluir a ordem de serviço ${order.number}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        title="Excluir OS"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition hidden sm:block" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
