import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, Hash, Search } from 'lucide-react';
import { BaseCustomerData } from '../types/mask';
import { formatDocument, formatPhone, formatCep, fetchAddressByCep } from '../utils/formatters';

interface CustomerFormFieldsProps {
  data: BaseCustomerData;
  onChange: (field: keyof BaseCustomerData, value: any) => void;
}

export const CustomerFormFields: React.FC<CustomerFormFieldsProps> = ({
  data,
  onChange
}) => {
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const handleCepBlur = async () => {
    if (!data.cep || data.cep.replace(/\D/g, '').length !== 8) return;
    setIsSearchingCep(true);
    const result = await fetchAddressByCep(data.cep);
    setIsSearchingCep(false);
    if (result) {
      if (result.address) onChange('endereco', result.address);
      if (result.neighborhood) onChange('bairro', result.neighborhood);
      if (result.city) onChange('cidade', result.city);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. AGENDAMENTO & PROTOCOLO */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#e4022c]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Agendamento & Atendimento
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Nº Protocolo / Atendimento</label>
            <input
              type="text"
              placeholder="Ex: 20261001-998"
              value={data.protocolo}
              onChange={e => onChange('protocolo', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Vendedor(a) / Atendente</label>
            <input
              type="text"
              placeholder="Ex: Pedro Souza"
              value={data.vendedor}
              onChange={e => onChange('vendedor', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Data do Agendamento</label>
            <input
              type="date"
              value={data.dataAgendamento}
              onChange={e => onChange('dataAgendamento', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Período Preferencial</label>
            <select
              value={data.periodo}
              onChange={e => onChange('periodo', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            >
              <option value="Manhã (08h às 12h)">Manhã (08h às 12h)</option>
              <option value="Tarde (13h às 18h)">Tarde (13h às 18h)</option>
              <option value="Comercial">Horário Comercial</option>
              <option value="Dia Todo">Dia Todo (Livre)</option>
              <option value="A Definir">A Definir</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. DADOS DO CLIENTE */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-[#e4022c]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Identificação do Assinante
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">
              Nome Completo do Cliente <span className="text-[#e4022c]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo de Oliveira"
              value={data.nomeCliente}
              onChange={e => onChange('nomeCliente', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">CPF ou CNPJ</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={data.cpfCnpj}
              onChange={e => onChange('cpfCnpj', formatDocument(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">
              Telefone 1 (WhatsApp de Contato) <span className="text-[#e4022c]">*</span>
            </label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={data.telefone1}
              onChange={e => onChange('telefone1', formatPhone(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">Telefone 2 (Recado / Secundário)</label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={data.telefone2}
              onChange={e => onChange('telefone2', formatPhone(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>
        </div>
      </div>

      {/* 3. ENDEREÇO DA INSTALAÇÃO */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#e4022c]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Endereço da Instalação / Atendimento
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1 flex items-center justify-between">
              <span>CEP</span>
              {isSearchingCep && <span className="text-[10px] text-[#e4022c] font-bold">Buscando...</span>}
            </label>
            <input
              type="text"
              placeholder="00000-000"
              value={data.cep}
              onChange={e => onChange('cep', formatCep(e.target.value))}
              onBlur={handleCepBlur}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <label className="block text-slate-600 font-semibold mb-1">Logradouro / Rua / Avenida</label>
            <input
              type="text"
              placeholder="Ex: Rua das Flores"
              value={data.endereco}
              onChange={e => onChange('endereco', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Número</label>
            <input
              type="text"
              placeholder="123"
              value={data.numero}
              onChange={e => onChange('numero', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Complemento / Apto</label>
            <input
              type="text"
              placeholder="Ex: Bloco B Apto 42"
              value={data.complemento}
              onChange={e => onChange('complemento', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Bairro</label>
            <input
              type="text"
              placeholder="Ex: Centro"
              value={data.bairro}
              onChange={e => onChange('bairro', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Cidade</label>
            <input
              type="text"
              placeholder="Ex: São Paulo"
              value={data.cidade}
              onChange={e => onChange('cidade', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Ponto de Referência</label>
            <input
              type="text"
              placeholder="Ex: Próximo à padaria Central"
              value={data.pontoReferencia}
              onChange={e => onChange('pontoReferencia', e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
