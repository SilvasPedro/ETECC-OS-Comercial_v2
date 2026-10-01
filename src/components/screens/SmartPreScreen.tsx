import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  UserCheck, 
  Compass, 
  Wifi, 
  Tag, 
  Home, 
  CheckCircle, 
  User, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Copy,
  Check,
  Share2,
  Trash2,
  AlertTriangle,
  X,
  Zap
} from 'lucide-react';
import { SmartPreData } from '../../types/mask';
import { formatMaskSmartPre } from '../../utils/maskTemplates';
import { MaskPreview } from '../MaskPreview';
import { formatPhone } from '../../utils/formatters';

const STORAGE_VENDEDOR_KEY = 'os_vendedor_nome';

export const SmartPreScreen: React.FC = () => {
  // Load saved seller name
  const getInitialVendedor = () => {
    try {
      return localStorage.getItem(STORAGE_VENDEDOR_KEY) || '';
    } catch {
      return '';
    }
  };

  const getInitialData = (sellerName = getInitialVendedor()): SmartPreData => ({
    dataInstalacao: '',
    periodo: 'Comercial',
    horarioApos: '',
    podeAdiantar: 'Não',
    localizacaoLink: '',
    pontoReferencia: '',
    postePadrao: 'Sim',
    telefone1: '',
    telefone2: '',
    titularAcompanha: 'Sim',
    ladoPraiaMorro: 'Praia',
    plano: '1Gbps - Sistema de Recargas',
    modalidade: 'KIT GIGA SMART-PRÉ',
    comodoInstalacao: 'IRÁ ESCOLHER COM TÉCNICO',
    taxaAtivacao: 'INSTALAÇÃO GRATUITA',
    vendedor: sellerName
  });

  const [data, setData] = useState<SmartPreData>(getInitialData);
  const [showPreview, setShowPreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  const updateVendedor = (val: string) => {
    setData(prev => ({ ...prev, vendedor: val }));
    try {
      localStorage.setItem(STORAGE_VENDEDOR_KEY, val);
    } catch (e) {
      console.warn(e);
    }
  };

  const updateField = (field: keyof SmartPreData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const confirmReset = () => {
    const currentVendedor = data.vendedor;
    setData(getInitialData(currentVendedor));
    setShowResetModal(false);
  };

  const maskText = formatMaskSmartPre(data);

  const handleCopyDirect = async () => {
    try {
      await navigator.clipboard.writeText(maskText);
      setCopiedDirect(true);
      setTimeout(() => setCopiedDirect(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = maskText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedDirect(true);
      setTimeout(() => setCopiedDirect(false), 2500);
    }
  };

  const handleWhatsAppDirect = () => {
    const cleanPhone = (data.telefone1 || '').replace(/\D/g, '');
    const phoneParam = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    const url = phoneParam 
      ? `https://wa.me/${phoneParam}?text=${encodeURIComponent(maskText)}`
      : `https://wa.me/?text=${encodeURIComponent(maskText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header with Preview Toggle */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. SMART-PRÉ</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Sistema de Recargas
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Cliente compra equipamento e faz recargas para uso
            </p>
          </div>
        </div>

        {/* Toggle Option for Real-time Preview (Disabled by default) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showPreview
                ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {showPreview ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Visualização Ativada</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-slate-500" />
                <span>Ativar Visualização em Tempo Real</span>
              </>
            )}
          </button>

          {/* Quick Copy */}
          <button
            type="button"
            onClick={handleCopyDirect}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              copiedDirect 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copiedDirect ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>Copiar Máscara</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-12 gap-6' : 'max-w-4xl mx-auto'} items-start`}>
        {/* Form Column - EXACT 15 FIELDS IN ORDER */}
        <div className={`space-y-5 ${showPreview ? 'lg:col-span-7' : 'w-full'}`}>
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            {/* 1. DATA DA INSTALAÇÃO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>1. Data da Instalação:</span>
                <span className="text-[#e4022c]">*</span>
              </label>
              <input
                type="date"
                required
                value={data.dataInstalacao}
                onChange={e => updateField('dataInstalacao', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 2. PERÍODO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>2. Período:</span>
                <span className="text-[#e4022c]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[
                  'Comercial',
                  'Primeira do Dia',
                  'Manhã',
                  'Tarde',
                  'Após'
                ].map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => updateField('periodo', p as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center border ${
                      data.periodo === p
                        ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {data.periodo === 'Após' && (
                <div className="mt-2.5 pl-1 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Informe o horário do agendamento:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 14h30 / 16h / Após às 15h"
                    value={data.horarioApos}
                    onChange={e => updateField('horarioApos', e.target.value)}
                    className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>
              )}
            </div>

            {/* 3. PODE ADIANTAR? */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                3. Pode Adiantar?
              </label>
              <div className="flex gap-2">
                {['Sim', 'Não'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => updateField('podeAdiantar', opt as any)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                      data.podeAdiantar === opt
                        ? opt === 'Sim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. LOCALIZAÇÃO (LINK GOOGLE) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>4. Localização (Link Google):</span>
              </label>
              <input
                type="text"
                placeholder="Cole o link do Google Maps (ex: https://maps.app.goo.gl/...)"
                value={data.localizacaoLink}
                onChange={e => updateField('localizacaoLink', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 5. PONTO DE REFERÊNCIA (OPCIONAL) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>5. Ponto de referência (Opcional):</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Próximo ao mercado / Portão marrom"
                value={data.pontoReferencia}
                onChange={e => updateField('pontoReferencia', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 6. POSTE PADRÃO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                6. Poste Padrão:
              </label>
              <div className="flex gap-2">
                {['Sim', 'Não'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => updateField('postePadrao', opt as any)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                      data.postePadrao === opt
                        ? 'bg-[#e4022c] text-white border-[#e4022c]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. TELEFONE 1 */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>7. Telefone 1:</span>
                <span className="text-[#e4022c]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                value={data.telefone1}
                onChange={e => updateField('telefone1', formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 8. TELEFONE 2 (OPCIONAL) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>8. Telefone 2 (Opcional):</span>
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000 (Recado / Secundário)"
                value={data.telefone2}
                onChange={e => updateField('telefone2', formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 9. TITULAR IRÁ ACOMPANHAR A INSTALAÇÃO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>9. Titular irá acompanhar a instalação:</span>
              </label>
              <div className="flex gap-2">
                {['Sim', 'Não'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => updateField('titularAcompanha', opt as any)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                      data.titularAcompanha === opt
                        ? 'bg-[#e4022c] text-white border-[#e4022c]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 10. LADO PRAIA OU MORRO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>10. Lado Praia ou Morro:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Praia', label: '🏖️ Lado Praia' },
                  { id: 'Morro', label: '⛰️ Lado Morro' }
                ].map(side => (
                  <button
                    type="button"
                    key={side.id}
                    onClick={() => updateField('ladoPraiaMorro', side.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                      data.ladoPraiaMorro === side.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {side.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 11. PLANO: 1Gbps - Sistema de Recargas (FIXO) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>11. Plano:</span>
                <span className="text-[10px] text-slate-400 font-normal">(Fixo)</span>
              </label>
              <div className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#e4022c]" />
                  <span>1Gbps - Sistema de Recargas</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#e4022c] bg-[#e4022c]/10 px-2 py-0.5 rounded">
                  Fixo
                </span>
              </div>
            </div>

            {/* 12. MODALIDADE: KIT GIGA SMART-PRÉ (Fixo) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>12. Modalidade:</span>
                <span className="text-[10px] text-slate-400 font-normal">(Fixo)</span>
              </label>
              <div className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 flex items-center justify-between select-none">
                <span>KIT GIGA SMART-PRÉ</span>
                <span className="text-[10px] uppercase font-bold text-[#e4022c] bg-[#e4022c]/10 px-2 py-0.5 rounded">
                  Padrão Fixo
                </span>
              </div>
            </div>

            {/* 13. COMODO DE INSTALAÇÃO (Texto Padrão: IRÁ ESCOLHER COM TÉCNICO) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>13. Comodo de Instalação:</span>
              </label>
              <input
                type="text"
                placeholder="IRÁ ESCOLHER COM TÉCNICO"
                value={data.comodoInstalacao}
                onChange={e => updateField('comodoInstalacao', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 14. TAXA DE ATIVAÇÃO (Texto Padrão: INSTALAÇÃO GRATUITA) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>14. Taxa de Ativação:</span>
              </label>
              <input
                type="text"
                placeholder="INSTALAÇÃO GRATUITA"
                value={data.taxaAtivacao}
                onChange={e => updateField('taxaAtivacao', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 15. VENDEDOR(A) - Esse campo NÃO deve ser apagado com o botão de limpar */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#e4022c]" />
                  <span>15. Vendedor(a):</span>
                </div>
                <span className="text-[10px] text-amber-800 font-semibold">
                  🔒 Permanente (Não apaga ao limpar campos)
                </span>
              </label>
              <input
                type="text"
                placeholder="Digite seu nome..."
                value={data.vendedor}
                onChange={e => updateVendedor(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* BOTTOM ACTIONS BAR & LIMPAR CAMPOS BUTTON */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                Limpar Campos
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
                >
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleCopyDirect}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition active:scale-[0.98] ${
                    copiedDirect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e4022c] hover:bg-[#c30225] text-white'
                  }`}
                >
                  {copiedDirect ? (
                    <>
                      <Check className="w-4 h-4" />
                      Máscara Copiada!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Máscara
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mask Preview Column (Shown ONLY if user activated it) */}
        {showPreview && (
          <div className="lg:col-span-5 animate-in fade-in duration-200 mt-6 lg:mt-0">
            <MaskPreview
              title="SMART-PRÉ"
              maskText={maskText}
              onReset={() => setShowResetModal(true)}
              clientPhone={data.telefone1}
            />
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL: LIMPAR CAMPOS */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Limpar todos os campos?</h3>
                  <p className="text-[11px] text-slate-500">Confirmação de limpeza do formulário</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-xs text-slate-600 space-y-2">
              <p>
                Todos os dados digitados nesta Ordem de Serviço de <strong>SMART-PRÉ</strong> serão restaurados para os valores padrão.
              </p>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                🔒 <strong>Importante:</strong> O campo <strong>Vendedor(a)</strong> ({data.vendedor || 'não informado'}) NÃO será apagado.
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e4022c] hover:bg-[#c30225] text-white shadow-xs transition"
              >
                Sim, Limpar Campos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
