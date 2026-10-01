import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';
import { Client, WorkOrder } from '../types/os';
import { 
  formatDocument, 
  formatPhone, 
  formatCep, 
  fetchAddressByCep,
  formatCurrency,
  formatDate
} from '../utils/formatters';

interface ClientsManagerProps {
  clients: Client[];
  orders: WorkOrder[];
  onSaveClient: (client: Client) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
  onSelectClientForNewOS: (client: Client) => void;
  onViewOrder: (order: WorkOrder) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  clients,
  orders,
  onSaveClient,
  onDeleteClient,
  onSelectClientForNewOS,
  onViewOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewHistoryClient, setViewHistoryClient] = useState<Client | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const openNewModal = () => {
    setEditingClient(null);
    setName('');
    setDocument('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setZipCode('');
    setAddress('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name || '');
    setDocument(client.document || '');
    setPhone(client.phone || '');
    setWhatsapp(client.whatsapp || client.phone || '');
    setEmail(client.email || '');
    setZipCode(client.zipCode || '');
    setAddress(client.address || '');
    setNumber(client.number || '');
    setComplement(client.complement || '');
    setNeighborhood(client.neighborhood || '');
    setCity(client.city || '');
    setState(client.state || '');
    setNotes(client.notes || '');
    setIsModalOpen(true);
  };

  const handleCepBlur = async () => {
    if (!zipCode || zipCode.replace(/\D/g, '').length !== 8) return;
    setIsSearchingCep(true);
    const data = await fetchAddressByCep(zipCode);
    setIsSearchingCep(false);
    if (data) {
      if (data.address) setAddress(data.address);
      if (data.neighborhood) setNeighborhood(data.neighborhood);
      if (data.city) setCity(data.city);
      if (data.state) setState(data.state);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const clientToSave: Client = {
      id: editingClient ? editingClient.id : `cli-${Date.now()}`,
      name,
      document,
      phone,
      whatsapp: whatsapp || phone,
      email,
      zipCode,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      notes,
      createdAt: editingClient ? editingClient.createdAt : new Date().toISOString()
    };

    await onSaveClient(clientToSave);
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(c => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.document || '').includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  });

  const getClientOrders = (clientId?: string, clientName?: string) => {
    if (!clientId && !clientName) return [];
    return orders.filter(
      o => (clientId && o.client.id === clientId) || 
           (clientName && o.client.name.toLowerCase() === clientName.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar cliente por Nome, CPF/CNPJ, Telefone ou Cidade..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhum cliente encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Cadastre seus clientes para agilizar a criação de novas Ordens de Serviço.</p>
          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => {
            const clientOrders = getClientOrders(client.id, client.name);
            const totalSpent = clientOrders
              .filter(o => o.status !== 'cancelled')
              .reduce((acc, curr) => acc + (Number(curr.financial?.total) || 0), 0);

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{client.name}</h4>
                      {client.document && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {formatDocument(client.document)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir cadastro de ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 my-3">
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatPhone(client.phone)}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {(client.address || client.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {client.address}{client.number ? `, ${client.number}` : ''} {client.city ? `• ${client.city}/${client.state}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => setViewHistoryClient(client)}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      {clientOrders.length} OS emitida(s)
                    </button>
                    {totalSpent > 0 && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Total: {formatCurrency(totalSpent)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectClientForNewOS(client)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition border border-indigo-100"
                  >
                    + Criar OS
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD / EDIT CLIENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingClient ? 'Editar Cadastro de Cliente' : 'Novo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nome Completo / Razão Social <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Mendes"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={document}
                    onChange={e => setDocument(formatDocument(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone Principal</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={whatsapp}
                    onChange={e => setWhatsapp(formatPhone(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Endereço</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CEP</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={zipCode}
                      onChange={e => setZipCode(formatCep(e.target.value))}
                      onBlur={handleCepBlur}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Logradouro / Rua</label>
                    <input
                      type="text"
                      placeholder="Rua, Avenida..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Número</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={number}
                      onChange={e => setNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bairro</label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={e => setNeighborhood(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Cidade / UF</label>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="col-span-2 bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-slate-800"
                      />
                      <input
                        type="text"
                        placeholder="UF"
                        maxLength={2}
                        value={state}
                        onChange={e => setState(e.target.value.toUpperCase())}
                        className="uppercase bg-slate-50 border border-slate-300 rounded-xl px-1 py-2 text-slate-800 text-center font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  placeholder="Informações adicionais sobre preferências ou restrições do cliente..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CLIENT HISTORY */}
      {viewHistoryClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Histórico de Atendimentos</h3>
                <p className="text-xs text-slate-500">{viewHistoryClient.name}</p>
              </div>
              <button
                onClick={() => setViewHistoryClient(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {getClientOrders(viewHistoryClient.id, viewHistoryClient.name).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhuma Ordem de Serviço registrada para este cliente ainda.
                </div>
              ) : (
                getClientOrders(viewHistoryClient.id, viewHistoryClient.name).map(order => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setViewHistoryClient(null);
                      onViewOrder(order);
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600">{order.number}</span>
                        <span className="text-slate-500">• {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="text-slate-800 font-semibold mt-0.5">
                        {order.equipment.type}: {order.equipment.brand} {order.equipment.model}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">{formatCurrency(order.financial?.total)}</div>
                      <span className="text-[10px] uppercase font-bold text-indigo-600">Ver Detalhes →</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const c = viewHistoryClient;
                  setViewHistoryClient(null);
                  onSelectClientForNewOS(c);
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              >
                + Nova OS para {viewHistoryClient.name.split(' ')[0]}
              </button>
              <button
                onClick={() => setViewHistoryClient(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
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
