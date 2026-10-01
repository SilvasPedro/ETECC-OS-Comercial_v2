import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Clock, 
  Tv, 
  Cable, 
  Download, 
  FileCheck, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Share2, 
  Trash2, 
  AlertTriangle, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { AvaliacaoTVData, AvaliacaoCabeamentoData } from '../../types/mask';
import { formatMaskAvaliacaoTV, formatMaskAvaliacaoCabeamento } from '../../utils/maskTemplates';
import { MaskPreview } from '../MaskPreview';

export const AvaliacaoScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tv' | 'cabeamento'>('tv');
  const [showPreview, setShowPreview] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  // Subtype 1: Avaliação - Cabeamento TV
  const initialTVData: AvaliacaoTVData = {
    data: '',
    periodo: 'Comercial',
    horarioApos: '',
    combo: 'TIP',
    clienteBaixouApp: 'Sim',
    quantasTvs: '1',
    tvSmart: 'Sim',
    termoAceito: 'Sim'
  };

  // Subtype 2: Avaliação Cabeamento
  const initialCabeamentoData: AvaliacaoCabeamentoData = {
    data: '',
    periodo: 'Comercial',
    horarioApos: '',
    servico: 'Ponto Adicional',
    isento: 'Não',
    equipamento: 'Comodato',
    plano: ''
  };

  const [tvData, setTvData] = useState<AvaliacaoTVData>(initialTVData);
  const [cabeamentoData, setCabeamentoData] = useState<AvaliacaoCabeamentoData>(initialCabeamentoData);

  const updateTvField = (field: keyof AvaliacaoTVData, value: any) => {
    setTvData(prev => ({ ...prev, [field]: value }));
  };

  const updateCabeamentoField = (field: keyof AvaliacaoCabeamentoData, value: any) => {
    setCabeamentoData(prev => {
      const updated = { ...prev, [field]: value };
      // Rule: Se selecionado cabeamento Gamer preencher automaticamente com Plano Gamer
      if (field === 'servico') {
        if (value === 'Cabeamento Plano Gamer') {
          updated.plano = 'Plano Gamer';
        } else if (prev.plano === 'Plano Gamer') {
          updated.plano = '';
        }
      }
      return updated;
    });
  };

  const confirmReset = () => {
    if (activeTab === 'tv') {
      setTvData(initialTVData);
    } else {
      setCabeamentoData(initialCabeamentoData);
    }
    setShowResetModal(false);
  };

  const currentMaskText = activeTab === 'tv'
    ? formatMaskAvaliacaoTV(tvData)
    : formatMaskAvaliacaoCabeamento(cabeamentoData);

  const handleCopyDirect = async () => {
    try {
      await navigator.clipboard.writeText(currentMaskText);
      setCopiedDirect(true);
      setTimeout(() => setCopiedDirect(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = currentMaskText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedDirect(true);
      setTimeout(() => setCopiedDirect(false), 2500);
    }
  };

  const handleWhatsAppDirect = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(currentMaskText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header with Preview Toggle */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. de Avaliação</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Vistoria Técnica
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Formulário especializado para avaliação de Cabeamento TV e Cabeamento de Rede
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

      {/* Switch Selector Tabs between the 2 Avaliação sub-modes */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('tv')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border ${
            activeTab === 'tv'
              ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-sm'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>1. Avaliação - Cabeamento TV</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cabeamento')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold transition-all border ${
            activeTab === 'cabeamento'
              ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-sm'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <Cable className="w-4 h-4" />
          <span>2. Avaliação Cabeamento</span>
        </button>
      </div>

      {/* Main Container */}
      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-12 gap-6' : 'max-w-4xl mx-auto'} items-start`}>
        {/* Form Column */}
        <div className={`space-y-5 ${showPreview ? 'lg:col-span-7' : 'w-full'}`}>
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
            {/* SUB-MODE 1: AVALIAÇÃO - CABEAMENTO TV */}
            {activeTab === 'tv' ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e4022c]"></span>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Formulário de Avaliação - Cabeamento TV
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    7 Campos
                  </span>
                </div>

                {/* 1. DATA */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Data:</span>
                    <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={tvData.data}
                    onChange={e => updateTvField('data', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                {/* 2. PERÍODO */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Período:</span>
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
                        onClick={() => updateTvField('periodo', p as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center border ${
                          tvData.periodo === p
                            ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {tvData.periodo === 'Após' && (
                    <div className="mt-2.5 pl-1 animate-in fade-in duration-150">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Informe o horário da avaliação:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 14h30 / 16h / Após às 15h"
                        value={tvData.horarioApos}
                        onChange={e => updateTvField('horarioApos', e.target.value)}
                        className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                      />
                    </div>
                  )}
                </div>

                {/* 3. COMBO: TIP / Sky+ */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Combo:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['TIP', 'Sky+'].map(comboOpt => (
                      <button
                        type="button"
                        key={comboOpt}
                        onClick={() => updateTvField('combo', comboOpt as any)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                          tvData.combo === comboOpt
                            ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {comboOpt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. CLIENTE BAIXOU APP: Sim / Não */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Cliente baixou App:</span>
                  </label>
                  <div className="flex gap-2">
                    {['Sim', 'Não'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => updateTvField('clienteBaixouApp', opt as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                          tvData.clienteBaixouApp === opt
                            ? opt === 'Sim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. QUANTAS TV'S */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Quantas TV's:</span>
                  </label>
                  <div className="flex gap-1.5 mb-2">
                    {['1', '2', '3', '4', '5+'].map(q => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => updateTvField('quantasTvs', q)}
                        className={`text-xs py-1.5 px-3 rounded-lg border font-bold transition ${
                          tvData.quantasTvs === q
                            ? 'bg-[#e4022c] text-white border-[#e4022c]'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {q} TV{q !== '1' ? 's' : ''}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: 1 / 2 / 3 TV's"
                    value={tvData.quantasTvs}
                    onChange={e => updateTvField('quantasTvs', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                {/* 6. TV SMART? Sim / Não */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>TV Smart?</span>
                  </label>
                  <div className="flex gap-2">
                    {['Sim', 'Não'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => updateTvField('tvSmart', opt as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                          tvData.tvSmart === opt
                            ? opt === 'Sim' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. TERMO ACEITO: Sim / Não */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Termo Aceito:</span>
                  </label>
                  <div className="flex gap-2">
                    {['Sim', 'Não'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => updateTvField('termoAceito', opt as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                          tvData.termoAceito === opt
                            ? opt === 'Sim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-700 text-white border-rose-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* SUB-MODE 2: AVALIAÇÃO CABEAMENTO */
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e4022c]"></span>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Formulário de Avaliação Cabeamento
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    6 Campos
                  </span>
                </div>

                {/* 1. DATA */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Data:</span>
                    <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={cabeamentoData.data}
                    onChange={e => updateCabeamentoField('data', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                {/* 2. PERÍODO */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Período:</span>
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
                        onClick={() => updateCabeamentoField('periodo', p as any)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center border ${
                          cabeamentoData.periodo === p
                            ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {cabeamentoData.periodo === 'Após' && (
                    <div className="mt-2.5 pl-1 animate-in fade-in duration-150">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Informe o horário da avaliação:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 14h30 / 16h / Após às 15h"
                        value={cabeamentoData.horarioApos}
                        onChange={e => updateCabeamentoField('horarioApos', e.target.value)}
                        className="w-full bg-amber-50/70 border border-amber-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                      />
                    </div>
                  )}
                </div>

                {/* 3. SERVIÇO: Ponto Adicional / Cabeamento Plano Gamer */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs flex items-center gap-1.5">
                    <Cable className="w-3.5 h-3.5 text-[#e4022c]" />
                    <span>Serviço:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'Ponto Adicional', label: '🔌 Ponto Adicional' },
                      { id: 'Cabeamento Plano Gamer', label: '🎮 Cabeamento Plano Gamer' }
                    ].map(serv => (
                      <button
                        type="button"
                        key={serv.id}
                        onClick={() => updateCabeamentoField('servico', serv.id as any)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                          cabeamentoData.servico === serv.id
                            ? 'bg-[#e4022c] text-white border-[#e4022c] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {serv.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. ISENTO: Sim / Não */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                    Isento:
                  </label>
                  <div className="flex gap-2">
                    {['Sim', 'Não'].map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => updateCabeamentoField('isento', opt as any)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${
                          cabeamentoData.isento === opt
                            ? opt === 'Sim' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-800 text-white border-slate-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. EQUIPAMENTO: Comodato / Do cliente */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5 text-xs">
                    Equipamento:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Comodato', 'Do cliente'].map(eq => (
                      <button
                        type="button"
                        key={eq}
                        onClick={() => updateCabeamentoField('equipamento', eq as any)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border ${
                          cabeamentoData.equipamento === eq
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. PLANO: (Auto preenchido com Plano Gamer se selecionado cabeamento Gamer) */}
                <div>
                  <label className="block text-slate-800 font-bold mb-1 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#e4022c]" />
                      <span>Plano:</span>
                    </div>
                    {cabeamentoData.servico === 'Cabeamento Plano Gamer' && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ⚡ Preenchido automaticamente: Plano Gamer
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="Digite ou selecione o plano..."
                    value={cabeamentoData.plano}
                    onChange={e => updateCabeamentoField('plano', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {['Plano Gamer', '600Mbps RES', '800Mbps RES', '1Gbps RES'].map(pChip => (
                      <button
                        type="button"
                        key={pChip}
                        onClick={() => updateCabeamentoField('plano', pChip)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition"
                      >
                        {pChip}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

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
              title={activeTab === 'tv' ? 'AVALIAÇÃO TV' : 'AVALIAÇÃO CABEAMENTO'}
              maskText={currentMaskText}
              onReset={() => setShowResetModal(true)}
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
                  <h3 className="font-bold text-slate-900 text-sm">Limpar formulário de avaliação?</h3>
                  <p className="text-[11px] text-slate-500">Confirmação de limpeza</p>
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
                Deseja restaurar todos os campos desta avaliação para os valores iniciais?
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
                Sim, Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
