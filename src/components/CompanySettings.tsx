import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Upload, 
  QrCode,
  MapPin,
  ShieldCheck,
  Sparkles,
  Server
} from 'lucide-react';
import { CompanyProfile, WorkOrder, Client, CatalogItem } from '../types/os';
import { 
  formatDocument, 
  formatPhone, 
  formatCep, 
  fetchAddressByCep 
} from '../utils/formatters';
import { 
  checkFirebaseHealth, 
  firebaseConfig,
  getLocalWorkOrders,
  getLocalClients
} from '../services/firebase';
import { seedInitialDataIfEmpty, initialSampleOrders, initialSampleClients } from '../utils/mockData';

interface CompanySettingsProps {
  company: CompanyProfile;
  orders: WorkOrder[];
  clients: Client[];
  catalog: CatalogItem[];
  onSaveCompany: (updated: CompanyProfile) => Promise<void>;
  onRestoreData: (orders: WorkOrder[], clients: Client[]) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  company,
  orders,
  clients,
  catalog,
  onSaveCompany,
  onRestoreData
}) => {
  const [profile, setProfile] = useState<CompanyProfile>(company);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Firebase status state
  const [fbStatus, setFbStatus] = useState<{ ok: boolean; message: string; checking: boolean }>({
    ok: true,
    message: 'Firebase configurado: geradoroscomercial',
    checking: false
  });

  useEffect(() => {
    handleCheckFirebase();
  }, []);

  const handleCheckFirebase = async () => {
    setFbStatus(prev => ({ ...prev, checking: true }));
    const res = await checkFirebaseHealth();
    setFbStatus({ ok: res.ok, message: res.message, checking: false });
  };

  const handleCepBlur = async () => {
    if (!profile.zipCode || profile.zipCode.replace(/\D/g, '').length !== 8) return;
    setIsSearchingCep(true);
    const data = await fetchAddressByCep(profile.zipCode);
    setIsSearchingCep(false);
    if (data) {
      setProfile(prev => ({
        ...prev,
        address: data.address || prev.address,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSaveCompany(profile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Export Complete Backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      company: profile,
      orders,
      clients,
      catalog
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_os_comercial_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.company) {
          setProfile(json.company);
          await onSaveCompany(json.company);
        }
        if (Array.isArray(json.orders) && Array.isArray(json.clients)) {
          onRestoreData(json.orders, json.clients);
          alert('Backup restaurado com sucesso!');
        }
      } catch (err) {
        alert('Falha ao processar arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSampleData = () => {
    if (confirm('Deseja recarregar as ordens e clientes de exemplo? Seus dados atuais serão complementados.')) {
      onRestoreData(initialSampleOrders, initialSampleClients);
      alert('Dados de exemplo restaurados com sucesso!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* FIREBASE STATUS CARD */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Integração Firebase Cloud</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  {firebaseConfig.projectId}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{fbStatus.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={fbStatus.checking}
              onClick={handleCheckFirebase}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition border border-white/10 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fbStatus.checking ? 'animate-spin' : ''}`} />
              Testar Conexão
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Projeto Firebase</span>
            <span className="font-mono font-semibold text-white">{firebaseConfig.projectId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Ordens no Sistema</span>
            <span className="font-mono font-semibold text-white">{orders.length} OS registradas</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Clientes na Base</span>
            <span className="font-mono font-semibold text-white">{clients.length} cadastrados</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Catálogo Padrão</span>
            <span className="font-mono font-semibold text-white">{catalog.length} itens</span>
          </div>
        </div>
      </div>

      {/* COMPANY DETAILS FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Dados da Minha Empresa</h2>
              <p className="text-xs text-slate-500">Informações impressas no cabeçalho e rodapé da Ordem de Serviço</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Dados da empresa e configurações salvas com sucesso!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nome Fantasia (Marca Comercial) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: TechAssist Pro Soluções"
              value={profile.tradeName || ''}
              onChange={e => setProfile({ ...profile, tradeName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Razão Social Oficial <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Oficina & Serviços Comerciais Tech Ltda"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">CNPJ ou CPF da Empresa</label>
            <input
              type="text"
              placeholder="00.000.000/0001-00"
              value={profile.document}
              onChange={e => setProfile({ ...profile, document: formatDocument(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Inscrição Estadual (IE)</label>
            <input
              type="text"
              placeholder="Ex: 123.456.789.000 ou Isento"
              value={profile.ie || ''}
              onChange={e => setProfile({ ...profile, ie: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Telefone Fixo</label>
            <input
              type="text"
              placeholder="(11) 3456-7890"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: formatPhone(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">WhatsApp Comercial</label>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={profile.whatsapp}
              onChange={e => setProfile({ ...profile, whatsapp: formatPhone(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">E-mail Comercial</label>
            <input
              type="email"
              placeholder="contato@minhaempresa.com.br"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo URL */}
          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">URL do Logotipo da Empresa (Opcional)</label>
            <input
              type="url"
              placeholder="https://exemplo.com/logo.png"
              value={profile.logoUrl || ''}
              onChange={e => setProfile({ ...profile, logoUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Deixe em branco para usar o monograma corporativo gerado automaticamente.
            </p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Endereço Comercial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>CEP</span>
                {isSearchingCep && <span className="text-[10px] text-blue-600 font-bold">Consultando...</span>}
              </label>
              <input
                type="text"
                placeholder="00000-000"
                value={profile.zipCode}
                onChange={e => setProfile({ ...profile, zipCode: formatCep(e.target.value) })}
                onBlur={handleCepBlur}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Logradouro / Avenida / Rua</label>
              <input
                type="text"
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Número</label>
              <input
                type="text"
                value={profile.number}
                onChange={e => setProfile({ ...profile, number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Complemento / Sala</label>
              <input
                type="text"
                value={profile.complement || ''}
                onChange={e => setProfile({ ...profile, complement: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bairro</label>
              <input
                type="text"
                value={profile.neighborhood}
                onChange={e => setProfile({ ...profile, neighborhood: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Cidade</label>
              <input
                type="text"
                value={profile.city}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">UF (Estado)</label>
              <input
                type="text"
                maxLength={2}
                value={profile.state}
                onChange={e => setProfile({ ...profile, state: e.target.value.toUpperCase() })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-bold uppercase text-center"
              />
            </div>
          </div>
        </div>

        {/* PIX & WARRANTY */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configurações de Pagamento PIX & Garantia Padrão</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Chave PIX da Empresa</label>
              <input
                type="text"
                placeholder="Ex: 12.345.678/0001-90 ou financeiro@empresa.com.br"
                value={profile.pixKey || ''}
                onChange={e => setProfile({ ...profile, pixKey: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-blue-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Essa chave será impressa na OS para que o cliente realize o pagamento via QR Code ou Copia e Cola.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tipo de Chave</label>
              <select
                value={profile.pixKeyType || 'cnpj'}
                onChange={e => setProfile({ ...profile, pixKeyType: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="cnpj">CNPJ</option>
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Chave Aleatória</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-semibold mb-1">Termo de Garantia Padrão (Código de Defesa do Consumidor)</label>
              <textarea
                rows={3}
                value={profile.defaultWarrantyTerms}
                onChange={e => setProfile({ ...profile, defaultWarrantyTerms: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-[11px]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-slate-700 font-semibold mb-1">Mensagem de Rodapé Padrão</label>
              <input
                type="text"
                value={profile.defaultNotes || ''}
                onChange={e => setProfile({ ...profile, defaultNotes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {/* BACKUP & RESTORE SECTION */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Backup & Segurança dos Dados</h3>
        <p className="text-xs text-slate-500 mb-4">Exporte uma cópia completa dos seus atendimentos ou recupere um backup anterior.</p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            Exportar Backup Completo (JSON)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer">
            <Upload className="w-4 h-4" />
            Restaurar Backup (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetSampleData}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Recarregar Dados de Exemplo
          </button>
        </div>
      </div>
    </div>
  );
};
