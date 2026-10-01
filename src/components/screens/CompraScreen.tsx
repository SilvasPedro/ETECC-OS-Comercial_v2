import React, { useState } from 'react';
import { ShoppingCart, Tag, ShieldCheck } from 'lucide-react';
import { CompraData } from '../../types/mask';
import { formatMaskCompra, defaultBaseData } from '../../utils/maskTemplates';
import { CustomerFormFields } from '../CustomerFormFields';
import { MaskPreview } from '../MaskPreview';

const initialCompraData: CompraData = {
  ...defaultBaseData,
  plano: '500 Mega Fibra',
  itemComprado: 'Roteador Mesh Gigabit Wi-Fi 6 (Venda)',
  marcaModelo: 'TP-Link Deco M4 / Huawei AX3 Pro',
  serialMac: '',
  condicaoEntrega: 'Técnico leva no momento da instalação',
  garantia: '12 Meses (Garantia do Fabricante)',
  configuracaoDesejada: 'Manter mesmo SSID e Senha da rede existente'
};

export const CompraScreen: React.FC = () => {
  const [data, setData] = useState<CompraData>(initialCompraData);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const updateField = (field: keyof CompraData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('Deseja limpar todos os campos desta máscara?')) {
      setData(initialCompraData);
    }
  };

  const maskText = formatMaskCompra(data);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">O.S. de Compra</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Venda de Equipamento
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Entrega, instalação ou configuração de equipamentos adquiridos pelo cliente
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

            {/* Compra Specific Section */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#e4022c]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dados do Item Vendido & Entrega
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    Plano Vinculado (ou Venda Avulsa)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 500 Mega Fibra ou Apenas Venda Avulsa"
                    value={data.plano}
                    onChange={e => updateField('plano', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Item / Produto Vendido <span className="text-[#e4022c]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roteador Mesh Wi-Fi 6"
                    value={data.itemComprado}
                    onChange={e => updateField('itemComprado', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Marca / Modelo do Aparelho</label>
                  <input
                    type="text"
                    placeholder="Ex: TP-Link Deco M4 / Intelbras RX1500"
                    value={data.marcaModelo}
                    onChange={e => updateField('marcaModelo', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Número de Série / MAC (se houver)</label>
                  <input
                    type="text"
                    placeholder="Deixe em branco se o técnico for separar"
                    value={data.serialMac}
                    onChange={e => updateField('serialMac', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Forma de Entrega / Instalação</label>
                  <select
                    value={data.condicaoEntrega}
                    onChange={e => updateField('condicaoEntrega', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-[#e4022c]"
                  >
                    <option value="Técnico leva no momento da instalação">Técnico leva no momento da instalação</option>
                    <option value="Retirada no balcão">Retirada no balcão da loja</option>
                    <option value="Envio por entregador">Envio por entregador / Motoboy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Termo de Garantia</label>
                  <input
                    type="text"
                    placeholder="Ex: 12 meses fabricante"
                    value={data.garantia}
                    onChange={e => updateField('garantia', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Configuração Desejada</label>
                  <input
                    type="text"
                    placeholder="Ex: Configurar SSID 'Rede_Casa' e senha padrão"
                    value={data.configuracaoDesejada}
                    onChange={e => updateField('configuracaoDesejada', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-[#e4022c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-xs">
                  Observações da Venda / Orientações ao Técnico
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Equipamento pago na loja. Levar nota fiscal/termo de garantia para assinatura do cliente."
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
            title="Compra"
            maskText={maskText}
            onReset={handleReset}
            clientPhone={data.telefone1}
          />
        </div>
      </div>
    </div>
  );
};
