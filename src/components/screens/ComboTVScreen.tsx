import React, { useState } from 'react';
import { Tv, PlayCircle, MonitorPlay, Film } from 'lucide-react';
import { ComboTVData } from '../../types/mask';
import { formatMaskComboTV, defaultBaseData } from '../../utils/maskTemplates';
import { CustomerFormFields } from '../CustomerFormFields';
import { MaskPreview } from '../MaskPreview';

const initialComboTVData: ComboTVData = {
  ...defaultBaseData,
  planoInternet: '500 Mega Fibra Ultra',
  pacoteTv: 'TV Full HD (Mais de 120 canais + Filmes)',
  qtdTvBoxes: '1 TV Box Android 4K',
  tipoAparelho: 'TV Box Android 4K',
  pontosTvInstalar: 'Ponto principal na sala',
  streamingIncluso: 'Canais ao vivo + Paramount+ e HBO Max',
  pontoPrincipal: 'Sala de Estar'
};

export const ComboTVScreen: React.FC = () => {
  const [data, setData] = useState<ComboTVData>(initialComboTVData);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const updateField = (field: keyof ComboTVData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os campos desta máscara Combo TV?')) {
      setData(initialComboTVData);
    }
  };

  const maskText = formatMaskComboTV(data);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. Combo TV</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Internet + Televisão
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Instalação combinada de Internet Banda Larga Fibra e TV Box / Streaming
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

            {/* Combo TV Specific Section */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#e4022c]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Pacote de TV & Equipamentos
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Plano de Internet Vinculado <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 500 Mega Fibra"
                    value={data.planoInternet}
                    onChange={e => updateField('planoInternet', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Pacote de TV Contratado <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: TV Essencial / TV Full / PlayHub"
                    value={data.pacoteTv}
                    onChange={e => updateField('pacoteTv', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Receptor</label>
                  <select
                    value={data.tipoAparelho}
                    onChange={e => updateField('tipoAparelho', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="TV Box Android 4K">TV Box Android 4K com Controle Remoto</option>
                    <option value="Aplicativo na Smart TV">Aplicativo direto na Smart TV (Samsung/LG/Android)</option>
                    <option value="Decodificador IP">Decodificador IP Dedicado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Qtd de Aparelhos / Boxes</label>
                  <select
                    value={data.qtdTvBoxes}
                    onChange={e => updateField('qtdTvBoxes', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="1 TV Box">1 TV Box (Ponto Principal)</option>
                    <option value="2 TV Boxes">2 TV Boxes (Principal + 1 Adicional)</option>
                    <option value="3 TV Boxes">3 TV Boxes</option>
                    <option value="Apenas Acesso via App">Apenas Acesso via App (Sem Box)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Local do Ponto Principal</label>
                  <input
                    type="text"
                    placeholder="Ex: Sala de Estar"
                    value={data.pontoPrincipal}
                    onChange={e => updateField('pontoPrincipal', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pontos Secundários a Instalar</label>
                  <input
                    type="text"
                    placeholder="Ex: Quarto Casal / Área Externa"
                    value={data.pontosTvInstalar}
                    onChange={e => updateField('pontosTvInstalar', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Streamings & Aplicativos Inclusos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Globoplay, Paramount+, HBO Max, Canais Premiere"
                    value={data.streamingIncluso}
                    onChange={e => updateField('streamingIncluso', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">
                  Observações de Instalação da TV
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Ajudar cliente a baixar o app na TV Samsung. TV da sala conectada via cabo de rede para evitar travamentos."
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
            title="Combo TV"
            maskText={maskText}
            onReset={handleReset}
            clientPhone={data.telefone1}
          />
        </div>
      </div>
    </div>
  );
};
