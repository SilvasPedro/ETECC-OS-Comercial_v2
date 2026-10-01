import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  Navigation,
  FileSpreadsheet,
  X,
  Filter
} from 'lucide-react';
import cepsCsvRaw from '../../data/ceps.csv?raw';
import { CepItem } from '../../types/mask';

export const ConsultaCepScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [copiedCep, setCopiedCep] = useState<string | null>(null);
  const [copiedMapsLink, setCopiedMapsLink] = useState<string | null>(null);

  // Parse CSV dataset into structured records, strictly ignoring header
  const { allItems, uniqueCities } = useMemo(() => {
    const lines = cepsCsvRaw.split(/\r?\n/);
    const items: CepItem[] = [];
    const citiesSet = new Set<string>();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 4) {
        const cep = parts[0].trim();
        const logradouro = parts[1].trim();
        const bairro = parts[2].trim();
        const cidade = parts.slice(3).join(',').trim();

        // Strict header filter: never include header row as data
        if (
          cep.toUpperCase() === 'CEP' || 
          logradouro.toUpperCase() === 'LOGRADOURO' || 
          cidade.toUpperCase() === 'CIDADE' ||
          bairro.toUpperCase() === 'BAIRRO'
        ) {
          continue;
        }

        if (cep && logradouro) {
          items.push({ cep, logradouro, bairro, cidade });
          if (cidade) {
            citiesSet.add(cidade);
          }
        }
      }
    }

    return {
      allItems: items,
      uniqueCities: Array.from(citiesSet).sort()
    };
  }, []);

  // Filter items by CEP/Street and City
  const filteredResults = useMemo(() => {
    const rawQuery = searchTerm.trim().toLowerCase();
    const cleanNumbers = searchTerm.replace(/\D/g, '');

    return allItems.filter(item => {
      // City Filter
      if (selectedCity !== 'all' && item.cidade.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      if (!rawQuery) return true;

      // If user typed digits, test matching CEP numbers
      if (cleanNumbers.length >= 3) {
        const itemCleanCep = item.cep.replace(/\D/g, '');
        if (itemCleanCep.includes(cleanNumbers)) {
          return true;
        }
      }

      // Match street name or neighborhood
      const matchLogradouro = item.logradouro.toLowerCase().includes(rawQuery);
      const matchBairro = item.bairro.toLowerCase().includes(rawQuery);
      const matchCepRaw = item.cep.toLowerCase().includes(rawQuery);

      return matchLogradouro || matchBairro || matchCepRaw;
    }).slice(0, 80); // Cap at 80 items for high performance rendering
  }, [allItems, searchTerm, selectedCity]);

  const handleCopyCep = (cep: string) => {
    navigator.clipboard.writeText(cep);
    setCopiedCep(cep);
    setTimeout(() => setCopiedCep(null), 2000);
  };

  const handleCopyMapsLink = (item: CepItem) => {
    const query = encodeURIComponent(`${item.logradouro}, ${item.bairro}, ${item.cidade} - SP, ${item.cep}`);
    const link = `https://www.google.com/maps/search/?api=1&query=${query}`;
    navigator.clipboard.writeText(link);
    setCopiedMapsLink(item.cep);
    setTimeout(() => setCopiedMapsLink(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e4022c]/10 text-[#e4022c] flex items-center justify-center font-bold shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Consulta de CEP & Endereços</h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#e4022c] text-white">
                Base Local CSV
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pesquise pelo CEP (ex: 11742-628) ou localize o CEP digitando o nome da rua
            </p>
          </div>
        </div>

        {/* Database Stats Pill */}
        <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <FileSpreadsheet className="w-4 h-4 text-[#e4022c]" />
          <span>{allItems.length.toLocaleString('pt-BR')} Ruas Catalogadas</span>
        </div>
      </div>

      {/* Search and Filters Bar with City Selection */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Digite o CEP (ex: 11742-628) ou nome da rua (ex: Gaivota, Savoy, Acre, Anchieta)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Selection Dropdown */}
          <div className="md:col-span-4 relative">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#e4022c] cursor-pointer"
              >
                <option value="all">Todas as Cidades ({uniqueCities.length})</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Atalhos rápidos:</span>
          {['Savoy', 'Gaivota', 'Cibratel', 'Belas Artes', 'Bopiranga', 'Suarão', 'Centro'].map(tag => (
            <button
              type="button"
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                searchTerm.toLowerCase() === tag.toLowerCase()
                  ? 'bg-[#e4022c] text-white border-[#e4022c] font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
          <span>
            {filteredResults.length === 0 
              ? 'Nenhum endereço encontrado para a pesquisa' 
              : `Exibindo ${filteredResults.length} resultado(s)${filteredResults.length === 80 ? ' (refine sua busca para mais)' : ''}:`}
          </span>
          {(searchTerm || selectedCity !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCity('all'); }}
              className="text-[#e4022c] hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Nenhum endereço encontrado</h3>
            <p className="text-xs text-slate-500 mt-1">
              Verifique a grafia da rua ou tente pesquisar apenas pelo início do nome (ex: "Gaivota" ou "Acre").
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredResults.map((item, idx) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${item.logradouro}, ${item.bairro}, ${item.cidade} - SP, ${item.cep}`
              )}`;

              const isCepCopied = copiedCep === item.cep;
              const isMapsCopied = copiedMapsLink === item.cep;

              return (
                <div
                  key={`${item.cep}-${idx}`}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-[#e4022c]/50 hover:shadow-sm transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* CEP Badge */}
                      <button
                        type="button"
                        onClick={() => handleCopyCep(item.cep)}
                        title="Clique para copiar o CEP"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e4022c]/10 hover:bg-[#e4022c]/20 text-[#e4022c] font-mono font-black text-xs transition"
                      >
                        <span>{item.cep}</span>
                        {isCepCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                      </button>

                      {/* Street Name */}
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                        {item.logradouro}
                      </h4>

                      {/* Neighborhood and City */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{item.bairro}</span>
                        <span>•</span>
                        <span>{item.cidade} - SP</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons for the OS Workflow */}
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCep(item.cep)}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 border ${
                        isCepCopied 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isCepCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>CEP Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#e4022c]" />
                          <span>Copiar CEP</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyMapsLink(item)}
                      title="Copia o link do Google Maps para colar no campo de Localização da O.S."
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 border ${
                        isMapsCopied 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isMapsCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3 h-3 text-blue-600" />
                          <span>Copiar Link Maps</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir no Google Maps"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
