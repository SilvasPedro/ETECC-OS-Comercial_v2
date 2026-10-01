import React, { useState } from 'react';
import { Gamepad2, Zap, Shield, Cable } from 'lucide-react';
import { GamerData } from '../../types/mask';
import { formatMaskGamer, defaultBaseData } from '../../utils/maskTemplates';
import { CustomerFormFields } from '../CustomerFormFields';
import { MaskPreview } from '../MaskPreview';

const initialGamerData: GamerData = {
  ...defaultBaseData,
  plano: '600 Mega Gamer Pro (Baixa Latência)',
  ipFixoPublico: 'Sim (Habilitar)',
  roteadorGamer: 'Roteador Wi-Fi 6 de Alta Performance',
  jogosPlataformas: 'PC Gamer (CS2 / Valorant) e PlayStation 5',
  cabeamentoPcConsole: 'Sim (Passar cabo direto)',
  qosPrioridade: 'Sim (Baixa latência configurada)'
};

export const GamerScreen: React.FC = () => {
  const [data, setData] = useState<GamerData>(initialGamerData);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const updateField = (field: keyof GamerData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os campos desta máscara Gamer?')) {
      setData(initialGamerData);
    }
  };

  const maskText = formatMaskGamer(data);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. Gamer</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Alta Performance & Ping Reduzido
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instalação voltada para jogadores online, streamers e exigência de rotas otimizadas e IP público
            </p>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex lg:hidden items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`px-3 py-1.5 rounded-lg transition ${
              mobileTab === 'form' ? 'bg-white text-[#e4022c] font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Formulário
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              mobileTab === 'preview' ? 'bg-[#e4022c] text-white font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Ver Máscara Pronta
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className={`space-y-5 lg:col-span-7 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <CustomerFormFields data={data} onChange={updateField} />

            {/* Gamer Specific Section */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#e4022c]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Parâmetros de Rede Gamer & Desempenho
                </h4>
              </div>

              {/* Quick Gamer Plan Chips */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">
                  Plano Gamer Selecionado <span className="text-[#e4022c]">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    '500 Mega Gamer', 
                    '600 Mega Gamer Pro', 
                    '800 Mega Gamer Ultra', 
                    '1 Giga Gamer Dedicado'
                  ].map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => updateField('plano', p)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition ${
                        data.plano === p
                          ? 'bg-[#e4022c] text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={data.plano}
                  onChange={e => updateField('plano', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    IP Fixo / IP Público Válido
                  </label>
                  <select
                    value={data.ipFixoPublico}
                    onChange={e => updateField('ipFixoPublico', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Sim (Habilitar)">Sim (Habilitar IP Fixo/Público)</option>
                    <option value="Apenas IP Público Dinâmico">Apenas IP Público Dinâmico (Sem CGNAT)</option>
                    <option value="Não (CGNAT Padrão)">Não (CGNAT Padrão)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Passar Cabo Direto no PC/Console?
                  </label>
                  <select
                    value={data.cabeamentoPcConsole}
                    onChange={e => updateField('cabeamentoPcConsole', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Sim (Passar cabo direto)">Sim (Passar cabo de rede direto)</option>
                    <option value="Não (Apenas Wi-Fi)">Não (Apenas Wi-Fi)</option>
                    <option value="Cliente já possui cabo">Cliente já possui cabo passado</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Equipamento Fornecido</label>
                  <select
                    value={data.roteadorGamer}
                    onChange={e => updateField('roteadorGamer', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Roteador Wi-Fi 6 de Alta Performance">Roteador Wi-Fi 6 AX de Alta Performance</option>
                    <option value="ONU Wi-Fi 6 Mesh">ONU Wi-Fi 6 Mesh Integrada</option>
                    <option value="Cliente possui roteador próprio">Cliente possui roteador gamer próprio (Modo Bridge)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Jogos / Plataformas Principais do Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Counter-Strike 2, Valorant, Warzone, FIFA, PS5, Xbox Series X"
                    value={data.jogosPlataformas}
                    onChange={e => updateField('jogosPlataformas', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Priorização de Tráfego / QoS</label>
                  <select
                    value={data.qosPrioridade}
                    onChange={e => updateField('qosPrioridade', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Sim (Baixa latência configurada)">Sim (Configurar QoS e rota de baixa latência)</option>
                    <option value="Padrão">Padrão</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">
                  Observações Técnicas para o Instalador
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Medir ping e jitter nos servidores da Riot/Valve. Deixar canal Wi-Fi 5GHz limpo e sem interferência."
                  value={data.observacoes}
                  onChange={e => updateField('observacoes', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Mask Preview */}
        <div className={`lg:col-span-5 ${mobileTab === 'form' ? 'hidden lg:block' : 'block'}`}>
          <MaskPreview
            title="Gamer"
            maskText={maskText}
            onReset={handleReset}
            clientPhone={data.telefone1}
          />
        </div>
      </div>
    </div>
  );
};
