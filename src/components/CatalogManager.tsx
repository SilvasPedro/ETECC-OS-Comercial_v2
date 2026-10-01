import React, { useState } from 'react';
import { Plus, Search, Sparkles, Edit3, Trash2, Tag, DollarSign, Check, X } from 'lucide-react';
import { CatalogItem } from '../types/os';
import { formatCurrency } from '../utils/formatters';

interface CatalogManagerProps {
  items: CatalogItem[];
  onSaveItem: (item: CatalogItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({
  items,
  onSaveItem,
  onDeleteItem
}) => {
  const [filterType, setFilterType] = useState<'all' | 'service' | 'part'>('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState<'service' | 'part'>('service');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');

  const openNew = () => {
    setEditingItem(null);
    setName('');
    setType('service');
    setCode(`SRV-${String(items.length + 1).padStart(2, '0')}`);
    setPrice(100);
    setCategory('Geral');
    setIsModalOpen(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setCode(item.code || '');
    setPrice(item.defaultPrice);
    setCategory(item.category || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: CatalogItem = {
      id: editingItem ? editingItem.id : `cat-${Date.now()}`,
      name,
      type,
      code,
      defaultPrice: Number(price) || 0,
      category
    };

    await onSaveItem(saved);
    setIsModalOpen(false);
  };

  const filtered = items.filter(it => {
    if (filterType !== 'all' && it.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return it.name.toLowerCase().includes(q) || (it.code || '').toLowerCase().includes(q) || (it.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar serviço ou peça cadastrada..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${filterType === 'all' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('service')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${filterType === 'service' ? 'bg-white font-bold shadow-xs text-blue-600' : 'text-slate-600'}`}
            >
              Serviços
            </button>
            <button
              onClick={() => setFilterType('part')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${filterType === 'part' ? 'bg-white font-bold shadow-xs text-amber-600' : 'text-slate-600'}`}
            >
              Peças
            </button>
          </div>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Item no Catálogo
        </button>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  item.type === 'service' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.type === 'service' ? 'Serviço' : 'Peça'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remover "${item.name}" do catálogo?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">{item.name}</h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                {item.code && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{item.code}</span>}
                {item.category && <span>{item.category}</span>}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Preço Padrão:</span>
              <span className="font-mono font-black text-sm text-slate-900">
                {formatCurrency(item.defaultPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? 'Editar Item do Catálogo' : 'Adicionar ao Catálogo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="service">Serviço / Mão de Obra</option>
                    <option value="part">Peça / Insumo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Código (Opcional)</label>
                  <input
                    type="text"
                    placeholder="SRV-01"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nome do Serviço ou Peça <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Formatação com Backup de Dados"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preço Sugerido (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Manutenção, Software"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
