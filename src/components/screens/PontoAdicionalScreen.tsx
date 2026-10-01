import React, { useState } from 'react';
import { Network, Cable, ArrowRightLeft, Cpu } from 'lucide-react';
import { PontoAdicionalData } from '../../types/mask';
import { formatMaskPontoAdicional, defaultBaseData } from '../../utils/maskTemplates';
import { CustomerFormFields } from '../CustomerFormFields';
import { MaskPreview } from '../MaskPreview';

const initialPontoData: PontoAdicionalData = {
  ...defaultBaseData,
  motivoSolicitacao: 'Cabo de rede para Home Office / PC Gamer',
  tipoSolucao: 'Ponto de Rede Cabeado (RJ45)',
  metragemEstimada: 'Até 20 metros',
  tipoCabo: 'CAT6 Homologado 100% Cobre',
  equipamentoInstalado: 'Tomada RJ45 fêmea de parede + Patch Cord 1.5m',
  comodoOrigem: 'Sala de Estar (Onde está o Roteador Principal)',
  comodoDestino: 'Escritório / Quarto dos Fundos',
  tipoPassagem: 'Tubulação interna existente'
};

export const PontoAdicionalScreen: React.FC = () => {
  const [data, setData] = useState<PontoAdicionalData>(initialPontoData);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const updateField = (field: keyof PontoAdicionalData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os campos desta máscara de Ponto Adicional?')) {
      setData(initialPontoData);
    }
  };

  const maskText = formatMaskPontoAdicional(data);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. Ponto Adicional / Cabeamento</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Infraestrutura de Rede
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Lançamento de cabos de rede UTP/CAT6, tomadas RJ45 de parede e pontos secundários
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

            {/* Ponto Adicional Specific Section */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Cable className="w-4 h-4 text-[#e4022c]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Especificações de Cabeamento & Ponto
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Motivo da Solicitação / Aplicação <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cabo de rede para PC de Home Office / Ponto para Smart TV do quarto"
                    value={data.motivoSolicitacao}
                    onChange={e => updateField('motivoSolicitacao', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Solução</label>
                  <select
                    value={data.tipoSolucao}
                    onChange={e => updateField('tipoSolucao', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Ponto de Rede Cabeado (RJ45)">Ponto de Rede Cabeado (RJ45)</option>
                    <option value="Repetidor Wi-Fi Mesh">Repetidor Wi-Fi Mesh Cabeado</option>
                    <option value="Ponto para Smart TV">Ponto para Smart TV</option>
                    <option value="Ponto para Home Office / PC">Ponto para Home Office / PC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Cabo</label>
                  <select
                    value={data.tipoCabo}
                    onChange={e => updateField('tipoCabo', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="CAT6 Homologado 100% Cobre">CAT6 Homologado 100% Cobre (Gigabit/10G)</option>
                    <option value="CAT5e Homologado">CAT5e Homologado 100% Cobre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Metragem Estimada de Cabo</label>
                  <select
                    value={data.metragemEstimada}
                    onChange={e => updateField('metragemEstimada', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Até 10 metros">Até 10 metros</option>
                    <option value="Até 15 metros">Até 15 metros</option>
                    <option value="Até 20 metros">Até 20 metros</option>
                    <option value="Até 30 metros">Até 30 metros</option>
                    <option value="Até 50 metros">Até 50 metros (Sob medida)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipo de Passagem do Cabo</label>
                  <select
                    value={data.tipoPassagem}
                    onChange={e => updateField('tipoPassagem', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Tubulação interna existente">Tubulação interna existente com guia/conduíte</option>
                    <option value="Canaleta aparente">Canaleta plástica aparente</option>
                    <option value="Pelo forro / laje">Pelo forro / laje / gesso</option>
                    <option value="A avaliar no local">A avaliar no local pelo instalador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cômodo de Origem (Roteador)</label>
                  <input
                    type="text"
                    placeholder="Ex: Sala de Estar / Rack"
                    value={data.comodoOrigem}
                    onChange={e => updateField('comodoOrigem', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Cômodo de Destino (Novo Ponto)</label>
                  <input
                    type="text"
                    placeholder="Ex: Quarto 2 / Escritório 2º Piso"
                    value={data.comodoDestino}
                    onChange={e => updateField('comodoDestino', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Equipamento / Conectores a Instalar no Ponto
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Tomada RJ45 fêmea de embutir na parede + Patch Cord 1.5m ou Conector Macho RJ45"
                    value={data.equipamentoInstalado}
                    onChange={e => updateField('equipamentoInstalado', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">
                  Orientações Técnicas para o Instalador de Cabeamento
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Levar passador de fio (guia de nylon) e conectorizador punch down. Testar taxa de transferência Gigabit na ponta."
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
            title="Ponto Adicional"
            maskText={maskText}
            onReset={handleReset}
            clientPhone={data.telefone1}
          />
        </div>
      </div>
    </div>
  );
};
