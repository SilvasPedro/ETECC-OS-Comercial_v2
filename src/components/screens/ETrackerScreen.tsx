import React, { useState } from 'react';
import { 
  Car, 
  Calendar, 
  Clock, 
  Phone, 
  UserCheck, 
  Hash, 
  Cpu, 
  Radio, 
  Layers, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Share2, 
  Trash2, 
  AlertTriangle, 
  X,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import { ETrackerData } from '../../types/mask';
import { formatMaskETracker } from '../../utils/maskTemplates';
import { MaskPreview } from '../MaskPreview';
import { formatPhone } from '../../utils/formatters';

export const ETrackerScreen: React.FC = () => {
  const getInitialData = (): ETrackerData => ({
    data: '',
    periodo: 'Comercial',
    horarioApos: '',
    contato: '',
    titularInternetMesmoVeiculo: 'SIM',
    tipoVeiculo: 'CARRO',
    outroTipoVeiculo: '',
    quantidadeVeiculos: '1',
    numeroRastreador: '',
    numeroChipRastreador: '',
    numeroLinhaChipCliente: '',
    modeloRastreador: 'XT40'
  });

  const [data, setData] = useState<ETrackerData>(getInitialData);
  const [showPreview, setShowPreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  const updateField = (field: keyof ETrackerData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const confirmReset = () => {
    setData(getInitialData());
    setShowResetModal(false);
  };

  const maskText = formatMaskETracker(data);

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
    const cleanPhone = (data.contato || '').replace(/\D/g, '');
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
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. E-Tracker</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Rastreamento Veicular
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rastreador veicular de auto gestão via aplicativo
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
        {/* Form Column - EXACT 10 FIELDS IN ORDER */}
        <div className={`space-y-5 ${showPreview ? 'lg:col-span-7' : 'w-full'}`}>
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            {/* 1. DATA */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>1. DATA:</span>
                <span className="text-[#e4022c]">*</span>
              </label>
              <input
                type="date"
                required
                value={data.data}
                onChange={e => updateField('data', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 2. PERÍODO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>2. PERÍODO:</span>
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

            {/* 3. CONTATO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>3. CONTATO:</span>
                <span className="text-[#e4022c]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                value={data.contato}
                onChange={e => updateField('contato', formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 4. TITULAR DA INTERNET É O MESMO DO VEICULO: SIM / NÃO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>4. TITULAR DA INTERNET É O MESMO DO VEICULO:</span>
              </label>
              <div className="flex gap-2">
                {['SIM', 'NÃO'].map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => updateField('titularInternetMesmoVeiculo', opt as any)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                      data.titularInternetMesmoVeiculo === opt
                        ? opt === 'SIM' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. TIPO DO VEICULO: MOTO / CARRO / CAMINHÃO / OUTRO */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>5. TIPO DO VEICULO:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'MOTO', label: '🏍️ MOTO' },
                  { id: 'CARRO', label: '🚗 CARRO' },
                  { id: 'CAMINHÃO', label: '🚛 CAMINHÃO' },
                  { id: 'OUTRO', label: '⚙️ OUTRO' }
                ].map(v => (
                  <button
                    type="button"
                    key={v.id}
                    onClick={() => updateField('tipoVeiculo', v.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center border ${
                      data.tipoVeiculo === v.id
                        ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {data.tipoVeiculo === 'OUTRO' && (
                <div className="mt-2 pl-1 animate-in fade-in duration-150">
                  <input
                    type="text"
                    placeholder="Especifique o tipo de veículo (ex: Van, Trator, Barco, Náutico)..."
                    value={data.outroTipoVeiculo || ''}
                    onChange={e => updateField('outroTipoVeiculo', e.target.value)}
                    className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>
              )}
            </div>

            {/* 6. QUANTIDADE DE VEICULOS: 1 */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>6. QUANTIDADE DE VEICULOS:</span>
              </label>
              <div className="flex gap-1.5 mb-2">
                {['1', '2', '3', '4', '5+'].map(q => (
                  <button
                    type="button"
                    key={q}
                    onClick={() => updateField('quantidadeVeiculos', q)}
                    className={`text-xs py-1.5 px-3 rounded-lg border font-bold transition ${
                      data.quantidadeVeiculos === q
                        ? 'bg-[#e4022c] text-white border-[#e4022c]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {q} veículo{q !== '1' ? 's' : ''}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={data.quantidadeVeiculos}
                onChange={e => updateField('quantidadeVeiculos', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 7. NUMERO DO RASTREADOR */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>7. NUMERO DO RASTREADOR:</span>
              </label>
              <input
                type="text"
                placeholder="Digite o IMEI / ID do rastreador..."
                value={data.numeroRastreador}
                onChange={e => updateField('numeroRastreador', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 8. NUMERO DO CHIP DO RASTREADOR */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>8. NUMERO DO CHIP DO RASTREADOR:</span>
              </label>
              <input
                type="text"
                placeholder="ICCID do chip (ex: 8955...)"
                value={data.numeroChipRastreador}
                onChange={e => updateField('numeroChipRastreador', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 9. NUMERO DA LINHA DO CHIP (CLIENTE) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>9. NUMERO DA LINHA DO CHIP (CLIENTE):</span>
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000 (Linha M2M / Cliente)"
                value={data.numeroLinhaChipCliente}
                onChange={e => updateField('numeroLinhaChipCliente', formatPhone(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
              />
            </div>

            {/* 10. MODELO RASTREADOR: XT40 / Outro (Inserir nome) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#e4022c]" />
                <span>10. MODELO RASTREADOR:</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {['XT40', 'Outro'].map(mod => {
                  const isSelected = data.modeloRastreador.startsWith('XT40') 
                    ? mod === 'XT40' 
                    : mod === 'Outro';
                  return (
                    <button
                      type="button"
                      key={mod}
                      onClick={() => updateField('modeloRastreador', mod === 'XT40' ? 'XT40' : '')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mod === 'XT40' ? 'Padrão XT40' : 'Outro Modelo'}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="XT40 ou digite o nome do modelo..."
                value={data.modeloRastreador}
                onChange={e => updateField('modeloRastreador', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
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
              title="E-TRACKER"
              maskText={maskText}
              onReset={() => setShowResetModal(true)}
              clientPhone={data.contato}
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
                  <p className="text-[11px] text-slate-500">Confirmação de limpeza de E-Tracker</p>
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

            <div className="p-5 text-xs text-slate-600">
              <p>
                Deseja restaurar todos os campos desta O.S. de <strong>E-Tracker</strong> para os valores padrão?
              </p>
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
