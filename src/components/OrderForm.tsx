import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Printer, 
  Share2, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Search, 
  MapPin, 
  Wrench, 
  User as UserIcon, 
  DollarSign, 
  ShieldAlert, 
  PenTool, 
  Sparkles,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  WorkOrder, 
  CompanyProfile, 
  Client, 
  CatalogItem, 
  OSStatus, 
  OSPriority, 
  PaymentMethod, 
  PaymentStatus,
  ServiceOrPartItem
} from '../types/os';
import { 
  formatCurrency, 
  formatDocument, 
  formatPhone, 
  formatCep,
  fetchAddressByCep,
  generateNextOSNumber
} from '../utils/formatters';
import { SignaturePadModal } from './SignaturePad';

interface OrderFormProps {
  initialOrder?: WorkOrder | null;
  existingOrders: WorkOrder[];
  savedClients: Client[];
  catalogItems: CatalogItem[];
  company: CompanyProfile;
  onSave: (order: WorkOrder, actionAfter?: 'view' | 'print' | 'whatsapp') => Promise<void>;
  onCancel: () => void;
  onSaveNewClient?: (client: Client) => Promise<void>;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  initialOrder,
  existingOrders,
  savedClients,
  catalogItems,
  company,
  onSave,
  onCancel,
  onSaveNewClient
}) => {
  const isEditing = Boolean(initialOrder);

  // Form State
  const [orderNumber, setOrderNumber] = useState(
    initialOrder?.number || generateNextOSNumber(existingOrders)
  );
  const [createdAt, setCreatedAt] = useState(
    initialOrder?.createdAt ? initialOrder.createdAt.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [scheduledDate, setScheduledDate] = useState(
    initialOrder?.scheduledDate ? initialOrder.scheduledDate.slice(0, 10) : ''
  );
  const [completedDate, setCompletedDate] = useState(
    initialOrder?.completedDate ? initialOrder.completedDate.slice(0, 10) : ''
  );
  const [status, setStatus] = useState<OSStatus>(initialOrder?.status || 'budget');
  const [priority, setPriority] = useState<OSPriority>(initialOrder?.priority || 'medium');
  const [technicianName, setTechnicianName] = useState(initialOrder?.technicianName || '');

  // Client State
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(initialOrder?.client?.id);
  const [clientName, setClientName] = useState(initialOrder?.client?.name || '');
  const [clientDoc, setClientDoc] = useState(initialOrder?.client?.document || '');
  const [clientPhone, setClientPhone] = useState(initialOrder?.client?.phone || '');
  const [clientWhatsapp, setClientWhatsapp] = useState(initialOrder?.client?.whatsapp || '');
  const [clientEmail, setClientEmail] = useState(initialOrder?.client?.email || '');
  const [clientCep, setClientCep] = useState(initialOrder?.client?.zipCode || '');
  const [clientAddress, setClientAddress] = useState(initialOrder?.client?.address || '');
  const [clientCity, setClientCity] = useState(initialOrder?.client?.city || '');
  const [clientState, setClientState] = useState(initialOrder?.client?.state || '');
  const [saveAsNewClient, setSaveAsNewClient] = useState(!initialOrder?.client?.id);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Equipment State
  const [equipType, setEquipType] = useState(initialOrder?.equipment?.type || 'Notebook');
  const [equipBrand, setEquipBrand] = useState(initialOrder?.equipment?.brand || '');
  const [equipModel, setEquipModel] = useState(initialOrder?.equipment?.model || '');
  const [equipSerial, setEquipSerial] = useState(initialOrder?.equipment?.serialNumberOrPlate || '');
  const [equipAccessories, setEquipAccessories] = useState(initialOrder?.equipment?.accessories || '');
  const [reportedDefect, setReportedDefect] = useState(initialOrder?.equipment?.reportedDefect || '');
  const [technicalDiagnosis, setTechnicalDiagnosis] = useState(initialOrder?.equipment?.technicalDiagnosis || '');
  const [visualCondition, setVisualCondition] = useState(initialOrder?.equipment?.visualCondition || '');

  // Items State
  const [items, setItems] = useState<ServiceOrPartItem[]>(
    initialOrder?.items || [
      {
        id: `item-${Date.now()}`,
        type: 'service',
        description: 'Diagnóstico e Avaliação Técnica',
        quantity: 1,
        unitPrice: 80,
        discount: 0,
        total: 80
      }
    ]
  );

  // Financial State
  const [discountTotal, setDiscountTotal] = useState(initialOrder?.financial?.discount || 0);
  const [additionalFee, setAdditionalFee] = useState(initialOrder?.financial?.additionalFee || 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialOrder?.financial?.paymentMethod || 'pix');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialOrder?.financial?.paymentStatus || 'pending');
  const [installments, setInstallments] = useState(initialOrder?.financial?.installmentsCount || 1);

  // Warranty and notes
  const [warrantyDays, setWarrantyDays] = useState(initialOrder?.warrantyDays ?? 90);
  const [warrantyTerms, setWarrantyTerms] = useState(
    initialOrder?.warrantyTerms || company.defaultWarrantyTerms
  );
  const [internalNotes, setInternalNotes] = useState(initialOrder?.internalNotes || '');
  const [clientNotes, setClientNotes] = useState(initialOrder?.clientNotes || '');

  // Signatures
  const [clientSignature, setClientSignature] = useState<string | undefined>(
    initialOrder?.signatures?.clientSignature
  );
  const [technicianSignature, setTechnicianSignature] = useState<string | undefined>(
    initialOrder?.signatures?.technicianSignature
  );
  const [signatureModal, setSignatureModal] = useState<'client' | 'technician' | null>(null);

  // Catalog picker modal
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'service' | 'part'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Saving indicator
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-fill Client from selection
  const handleSelectClient = (client: Client) => {
    setSelectedClientId(client.id);
    setClientName(client.name);
    setClientDoc(client.document);
    setClientPhone(client.phone);
    setClientWhatsapp(client.whatsapp || client.phone);
    setClientEmail(client.email || '');
    setClientCep(client.zipCode || '');
    setClientAddress(
      client.address ? `${client.address}${client.number ? `, ${client.number}` : ''}${client.neighborhood ? ` - ${client.neighborhood}` : ''}` : ''
    );
    setClientCity(client.city || '');
    setClientState(client.state || '');
    setSaveAsNewClient(false);
    setClientSearch('');
  };

  // ViaCEP Auto-Fill
  const handleCepBlur = async () => {
    if (!clientCep || clientCep.replace(/\D/g, '').length !== 8) return;
    setIsSearchingCep(true);
    const data = await fetchAddressByCep(clientCep);
    setIsSearchingCep(false);
    if (data) {
      setClientAddress(`${data.address || ''}${data.neighborhood ? ` - ${data.neighborhood}` : ''}`);
      if (data.city) setClientCity(data.city);
      if (data.state) setClientState(data.state);
    }
  };

  // Item Calculations
  const updateItem = (id: string, field: keyof ServiceOrPartItem, value: any) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: value };
        const qty = Number(updated.quantity) || 1;
        const price = Number(updated.unitPrice) || 0;
        const disc = Number(updated.discount) || 0;
        updated.total = Math.max(0, (qty * price) - disc);
        return updated;
      })
    );
  };

  const addItemRow = (type: 'service' | 'part' = 'service') => {
    const newItem: ServiceOrPartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      description: type === 'service' ? 'Novo Serviço' : 'Nova Peça / Material',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const addFromCatalog = (item: CatalogItem) => {
    const newItem: ServiceOrPartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: item.type,
      code: item.code,
      description: item.name,
      quantity: 1,
      unitPrice: item.defaultPrice,
      discount: 0,
      total: item.defaultPrice
    };
    setItems(prev => [...prev, newItem]);
    setShowCatalogModal(false);
  };

  const removeItemRow = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // Financial Sums
  const servicesSubtotal = items
    .filter(i => i.type === 'service')
    .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  const partsSubtotal = items
    .filter(i => i.type === 'part')
    .reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  const grandTotal = Math.max(0, servicesSubtotal + partsSubtotal - Number(discountTotal) + Number(additionalFee));

  // Form submission
  const handleSubmit = async (e?: React.FormEvent, actionAfter: 'view' | 'print' | 'whatsapp' = 'view') => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Por favor informe o Nome do Cliente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!equipModel.trim() && !reportedDefect.trim()) {
      setFormError('Por favor informe ao menos o Modelo do Equipamento ou o Defeito Relatado.');
      return;
    }

    setIsSubmitting(true);

    try {
      // If user checked save as new client, save to clients database
      let clientId = selectedClientId;
      if (saveAsNewClient && onSaveNewClient) {
        clientId = clientId || `cli-${Date.now()}`;
        const newClientData: Client = {
          id: clientId,
          name: clientName,
          document: clientDoc,
          phone: clientPhone,
          whatsapp: clientWhatsapp || clientPhone,
          email: clientEmail,
          zipCode: clientCep,
          address: clientAddress,
          city: clientCity,
          state: clientState,
          createdAt: new Date().toISOString()
        };
        await onSaveNewClient(newClientData);
      }

      const orderData: WorkOrder = {
        id: initialOrder?.id || `os-${Date.now()}`,
        number: orderNumber.trim() || `OS-${new Date().getFullYear()}-0001`,
        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
        scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        completedDate: completedDate ? new Date(completedDate).toISOString() : undefined,
        status,
        priority,
        technicianName: technicianName || undefined,
        client: {
          id: clientId,
          name: clientName,
          document: clientDoc,
          phone: clientPhone,
          whatsapp: clientWhatsapp,
          email: clientEmail,
          address: clientAddress,
          city: clientCity,
          state: clientState,
          zipCode: clientCep
        },
        equipment: {
          type: equipType,
          brand: equipBrand,
          model: equipModel,
          serialNumberOrPlate: equipSerial,
          accessories: equipAccessories,
          reportedDefect,
          technicalDiagnosis,
          visualCondition
        },
        items,
        financial: {
          servicesSubtotal,
          partsSubtotal,
          discount: Number(discountTotal) || 0,
          additionalFee: Number(additionalFee) || 0,
          total: grandTotal,
          paymentMethod,
          installmentsCount: Number(installments) || 1,
          paymentStatus,
          paidAmount: paymentStatus === 'paid' ? grandTotal : 0
        },
        warrantyDays: Number(warrantyDays) || 90,
        warrantyTerms,
        internalNotes,
        clientNotes,
        signatures: {
          clientSignature,
          technicianSignature,
          signedAt: clientSignature ? new Date().toISOString() : undefined,
          clientSignerName: clientName
        },
        updatedAt: new Date().toISOString()
      };

      await onSave(orderData, actionAfter);
    } catch (err: any) {
      console.error('Save OS error:', err);
      setFormError('Erro ao salvar Ordem de Serviço: ' + (err?.message || 'Verifique os dados preenchidos.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCatalog = catalogItems.filter(item => {
    const matchesType = catalogFilter === 'all' || item.type === catalogFilter;
    const matchesSearch = !catalogSearch || 
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
      (item.code && item.code.toLowerCase().includes(catalogSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-xl hover:bg-slate-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Painel
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(undefined, 'view')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Salvando...' : 'Salvar Ordem de Serviço'}
          </button>
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{formError}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, 'view')} className="space-y-6">
        {/* CARD 1: CABEÇALHO DA OS */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {initialOrder ? `Editar ${initialOrder.number}` : 'Abertura de Nova Ordem de Serviço'}
                </h2>
                <p className="text-xs text-slate-500">Defina número, prazos, status comercial e equipe responsável</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Número:</span>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="w-36 font-mono font-bold text-sm bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status da Ordem</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as OSStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="budget">Orçamento Comercial</option>
                <option value="approved">Aprovado pelo Cliente</option>
                <option value="in_progress">Em Andamento / Execução</option>
                <option value="waiting_parts">Aguardando Peças / Insumos</option>
                <option value="completed">Serviço Concluído</option>
                <option value="delivered">Entregue / Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as OSPriority)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média (Padrão)</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Data / Hora de Entrada</label>
              <input
                type="datetime-local"
                value={createdAt}
                onChange={e => setCreatedAt(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Previsão de Entrega</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Técnico / Responsável do Serviço</label>
              <input
                type="text"
                placeholder="Ex: Rodrigo Silveira (Técnico Eletrônico)"
                value={technicianName}
                onChange={e => setTechnicianName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Data de Conclusão / Entrega Efetiva</label>
              <input
                type="date"
                value={completedDate}
                onChange={e => setCompletedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: DADOS DO CLIENTE */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Dados do Cliente</h2>
                <p className="text-xs text-slate-500">Selecione um cliente salvo ou preencha para cadastrar</p>
              </div>
            </div>

            {/* Quick Picker from Saved Clients */}
            {savedClients.length > 0 && (
              <div className="relative">
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => {
                    const found = savedClients.find(c => c.id === e.target.value);
                    if (found) handleSelectClient(found);
                  }}
                  className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="">⚡ Selecionar Cliente Cadastrado...</option>
                  {savedClients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone || c.document || 'Sem tel'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nome Completo / Razão Social <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Mendes ou Empresa Silva Ltda"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">CPF ou CNPJ</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={clientDoc}
                onChange={e => setClientDoc(formatDocument(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Telefone Principal</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={clientPhone}
                onChange={e => setClientPhone(formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp (para envio de OS)</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={clientWhatsapp}
                onChange={e => setClientWhatsapp(formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">E-mail</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address fields */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>CEP (Busca Automática)</span>
                {isSearchingCep && <span className="text-[10px] text-blue-600 font-bold">Consultando...</span>}
              </label>
              <input
                type="text"
                placeholder="00000-000"
                value={clientCep}
                onChange={e => setClientCep(formatCep(e.target.value))}
                onBlur={handleCepBlur}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Endereço Completo</label>
              <input
                type="text"
                placeholder="Rua, Número, Complemento e Bairro"
                value={clientAddress}
                onChange={e => setClientAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cidade / UF</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={clientCity}
                  onChange={e => setClientCity(e.target.value)}
                  className="col-span-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={clientState}
                  onChange={e => setClientState(e.target.value.toUpperCase())}
                  className="uppercase bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-slate-800 font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsNewClient}
                  onChange={e => setSaveAsNewClient(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-medium">Salvar / atualizar este cliente na minha base permanente</span>
              </label>
            </div>
          </div>
        </div>

        {/* CARD 3: DADOS DO EQUIPAMENTO / OBJETO */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Equipamento / Objeto do Serviço</h2>
                <p className="text-xs text-slate-500">Detalhes do item recebido, acessórios, avarias e diagnósticos</p>
              </div>
            </div>

            {/* Quick Type Chips */}
            <div className="hidden sm:flex items-center gap-1.5">
              {['Notebook', 'Smartphone', 'Ar Condicionado', 'Veículo', 'Industrial', 'Outro'].map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setEquipType(t)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg transition font-medium ${
                    equipType === t ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Categoria / Tipo</label>
              <input
                type="text"
                placeholder="Ex: Notebook, Celular, Veículo"
                value={equipType}
                onChange={e => setEquipType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Marca / Fabricante</label>
              <input
                type="text"
                placeholder="Ex: Dell, Apple, Samsung, LG, Toyota"
                value={equipBrand}
                onChange={e => setEquipBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Modelo Completo</label>
              <input
                type="text"
                placeholder="Ex: Inspiron 15 5000 / iPhone 13 128GB"
                value={equipModel}
                onChange={e => setEquipModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nº de Série / IMEI / Placa</label>
              <input
                type="text"
                placeholder="SN, Chassi, Placa ou IMEI"
                value={equipSerial}
                onChange={e => setEquipSerial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Acessórios Entregues Junto</label>
              <input
                type="text"
                placeholder="Ex: Fonte original, cabo USB, chave do veículo, controle remoto"
                value={equipAccessories}
                onChange={e => setEquipAccessories(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Estado Visual / Avarias Pré-existentes</label>
              <input
                type="text"
                placeholder="Ex: Riscos na tampa traseira, sem parafusos na base, tela intacta"
                value={visualCondition}
                onChange={e => setVisualCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1 text-amber-800 flex items-center gap-1">
                <span>⚠️</span> Defeito Relatado pelo Cliente
              </label>
              <textarea
                rows={3}
                placeholder="Descreva exatamente o que o cliente informou que está ocorrendo..."
                value={reportedDefect}
                onChange={e => setReportedDefect(e.target.value)}
                className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1 text-blue-800 flex items-center gap-1">
                <span>🔍</span> Diagnóstico Técnico & Laudo Pericial
              </label>
              <textarea
                rows={3}
                placeholder="Avaliação constatada pela assistência técnica, causas e soluções propostas..."
                value={technicalDiagnosis}
                onChange={e => setTechnicalDiagnosis(e.target.value)}
                className="w-full bg-blue-50/40 border border-blue-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: SERVIÇOS E PEÇAS (ITENS) */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Itens: Serviços e Peças</h2>
                <p className="text-xs text-slate-500">Adicione mão de obra, reparos e peças com cálculo automático</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCatalogModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition border border-indigo-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Catálogo Padrão
              </button>
              <button
                type="button"
                onClick={() => addItemRow('service')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                + Serviço
              </button>
              <button
                type="button"
                onClick={() => addItemRow('part')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl transition border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                + Peça
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-2 w-24">Tipo</th>
                  <th className="py-2.5 px-2">Descrição</th>
                  <th className="py-2.5 px-2 w-20 text-center">Qtd</th>
                  <th className="py-2.5 px-2 w-28 text-right">Valor Unit. (R$)</th>
                  <th className="py-2.5 px-2 w-24 text-right">Desc. (R$)</th>
                  <th className="py-2.5 px-2 w-28 text-right">Subtotal</th>
                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <tr key={item.id} className="group hover:bg-slate-50/70 transition">
                    <td className="py-2 px-2">
                      <select
                        value={item.type}
                        onChange={e => updateItem(item.id, 'type', e.target.value as 'service' | 'part')}
                        className={`font-bold text-[10px] uppercase rounded-lg px-2 py-1 border ${
                          item.type === 'service' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="service">Serviço</option>
                        <option value="part">Peça</option>
                      </select>
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Ex: Troca de tela OLED / Mão de obra"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                        className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-1.5 text-slate-800 font-mono font-semibold focus:bg-white"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 font-mono focus:bg-white"
                      />
                    </td>

                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.discount}
                        onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 font-mono focus:bg-white"
                      />
                    </td>

                    <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.total)}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        disabled={items.length <= 1}
                        className="text-slate-300 hover:text-rose-600 disabled:opacity-30 transition p-1"
                        title="Remover Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL SUMMARY & PAYMENT BAR */}
          <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pix">PIX (Chave ou QR Code)</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="debit">Cartão de Débito</option>
                    <option value="cash">Dinheiro</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="transfer">Transferência Bancária</option>
                    <option value="installments">Faturado / Crediário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parcelamento</label>
                  <select
                    value={installments}
                    onChange={e => setInstallments(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 10, 12].map(n => (
                      <option key={n} value={n}>
                        {n === 1 ? 'À vista (1x)' : `${n}x de ${formatCurrency(grandTotal / n)}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Pagamento</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className={`w-full font-bold border rounded-xl px-3 py-2 ${
                      paymentStatus === 'paid' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="pending">Aguardando Pagamento</option>
                    <option value="partial">Pago Parcialmente</option>
                    <option value="paid">Totalmente Quitado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Instruções de Pagamento / Notas ao Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: Aceitamos PIX com 5% de desconto no balcão / chave PIX no rodapé"
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Serviços:</span>
                <span className="font-mono font-semibold">{formatCurrency(servicesSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Peças / Materiais:</span>
                <span className="font-mono font-semibold">{formatCurrency(partsSubtotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200">
                <span className="text-slate-600">Desconto Geral (R$):</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountTotal}
                  onChange={e => setDiscountTotal(parseFloat(e.target.value) || 0)}
                  className="w-28 text-right bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-emerald-700 font-bold"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Taxa Deslocamento / Frete (R$):</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={additionalFee}
                  onChange={e => setAdditionalFee(parseFloat(e.target.value) || 0)}
                  className="w-28 text-right bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                <span className="text-xs font-black uppercase text-slate-800">VALOR TOTAL DA OS:</span>
                <span className="text-xl font-black font-mono text-blue-700">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: GARANTIA & ASSINATURAS DIGITAIS */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Termo de Garantia & Assinaturas Digitais</h2>
                <p className="text-xs text-slate-500">Garantia legal conforme CDC e aceite digital na tela</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Prazo de Garantia (Dias)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={warrantyDays}
                  onChange={e => setWarrantyDays(parseInt(e.target.value, 10) || 0)}
                  className="w-24 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold font-mono focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-1">
                  {[30, 90, 180, 365].map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setWarrantyDays(d)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        warrantyDays === d ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Termo Legal de Garantia (Impresso no rodapé da OS)</label>
              <textarea
                rows={2}
                value={warrantyTerms}
                onChange={e => setWarrantyTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 text-[11px]"
              />
            </div>

            {/* Signature Box: Client */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block uppercase">Assinatura do Cliente</span>
                <span className="text-[10px] text-slate-500">Coletar aceite digital na tela</span>
              </div>

              <div className="my-3 h-20 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                {clientSignature ? (
                  <img src={clientSignature} alt="Assinatura Cliente" className="max-h-16 object-contain" />
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Sem assinatura digital</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureModal('client')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition"
                >
                  <PenTool className="w-3 h-3 text-blue-600" />
                  {clientSignature ? 'Alterar Assinatura' : 'Coletar Assinatura'}
                </button>
                {clientSignature && (
                  <button
                    type="button"
                    onClick={() => setClientSignature(undefined)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Signature Box: Technician */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block uppercase">Assinatura do Técnico</span>
                <span className="text-[10px] text-slate-500">Validação da assistência técnica</span>
              </div>

              <div className="my-3 h-20 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                {technicianSignature ? (
                  <img src={technicianSignature} alt="Assinatura Técnico" className="max-h-16 object-contain" />
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Sem assinatura digital</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureModal('technician')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition"
                >
                  <PenTool className="w-3 h-3 text-blue-600" />
                  {technicianSignature ? 'Alterar Assinatura' : 'Assinar como Técnico'}
                </button>
                {technicianSignature && (
                  <button
                    type="button"
                    onClick={() => setTechnicianSignature(undefined)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Notas Internas (Privadas da Empresa)</label>
              <textarea
                rows={4}
                placeholder="Anotações visíveis apenas para os técnicos e gestores da loja..."
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
          >
            Descartar Alterações
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(undefined, 'whatsapp')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              Salvar e WhatsApp
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(undefined, 'print')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              Salvar e Imprimir A4
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-xl shadow-md transition"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Ordem de Serviço'}
            </button>
          </div>
        </div>
      </form>

      {/* SIGNATURE MODAL */}
      {signatureModal && (
        <SignaturePadModal
          title={signatureModal === 'client' ? 'Assinatura do Cliente / Responsável' : 'Assinatura do Técnico Especialista'}
          initialSignature={signatureModal === 'client' ? clientSignature : technicianSignature}
          onSave={(dataUrl) => {
            if (signatureModal === 'client') setClientSignature(dataUrl);
            else setTechnicianSignature(dataUrl);
            setSignatureModal(null);
          }}
          onCancel={() => setSignatureModal(null)}
        />
      )}

      {/* CATALOG PICKER MODAL */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">Catálogo de Serviços e Peças Padrão</h3>
              </div>
              <button 
                onClick={() => setShowCatalogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pesquisar item por nome ou código..."
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px]">
                <button
                  type="button"
                  onClick={() => setCatalogFilter('all')}
                  className={`px-2 py-1 rounded-lg ${catalogFilter === 'all' ? 'bg-white font-bold shadow-xs' : 'text-slate-600'}`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogFilter('service')}
                  className={`px-2 py-1 rounded-lg ${catalogFilter === 'service' ? 'bg-white font-bold text-blue-700 shadow-xs' : 'text-slate-600'}`}
                >
                  Serviços
                </button>
                <button
                  type="button"
                  onClick={() => setCatalogFilter('part')}
                  className={`px-2 py-1 rounded-lg ${catalogFilter === 'part' ? 'bg-white font-bold text-amber-700 shadow-xs' : 'text-slate-600'}`}
                >
                  Peças
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {filteredCatalog.map(item => (
                <div
                  key={item.id}
                  onClick={() => addFromCatalog(item)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.type === 'service' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.type === 'service' ? 'Serviço' : 'Peça'}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      {item.category && <span className="text-[10px] text-slate-400">{item.category}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-900 block">{formatCurrency(item.defaultPrice)}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">+ Adicionar</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
