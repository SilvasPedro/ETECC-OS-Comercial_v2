import React from 'react';
import { 
  PackageCheck, 
  CreditCard, 
  Gamepad2, 
  Tv, 
  Network, 
  Search,
  ChevronLeft, 
  ChevronRight,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { OSType } from '../types/mask';

interface SidebarProps {
  currentType: OSType;
  onSelectType: (type: OSType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentType,
  onSelectType,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const menuItems: { id: OSType; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
    {
      id: 'comodato',
      label: 'Comodato',
      icon: <PackageCheck className="w-5 h-5 shrink-0" />,
      desc: 'Instalação com equipamento em comodato'
    },
    {
      id: 'smart_pre',
      label: 'SMART-PRÉ',
      icon: <CreditCard className="w-5 h-5 shrink-0" />,
      desc: 'Cliente compra equipamento e faz recargas para uso',
      badge: 'PRÉ'
    },
    {
      id: 'gamer',
      label: 'Gamer',
      icon: <Gamepad2 className="w-5 h-5 shrink-0" />,
      desc: 'Alta performance, IP fixo e baixa latência',
      badge: 'TOP'
    },
    {
      id: 'combo_tv',
      label: 'Combo TV',
      icon: <Tv className="w-5 h-5 shrink-0" />,
      desc: 'Internet + TV Box ou IPTV'
    },
    {
      id: 'ponto_adicional',
      label: 'Ponto Adicional / Cabeamento',
      icon: <Network className="w-5 h-5 shrink-0" />,
      desc: 'Extensão de cabo de rede RJ45 e Mesh'
    },
    {
      id: 'consulta_cep',
      label: 'Consultar CEP',
      icon: <Search className="w-5 h-5 shrink-0" />,
      desc: 'Pesquisa por CEP, rua e bairro no CSV',
      badge: 'CSV'
    }
  ];

  const handleSelect = (id: OSType) => {
    onSelectType(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#e4022c] text-white flex items-center justify-center font-black shadow-sm shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="overflow-hidden transition-opacity duration-200">
                  <h1 className="font-extrabold text-sm text-slate-900 leading-tight tracking-tight uppercase">
                    Máscaras de O.S.
                  </h1>
                  <span className="text-[10px] font-bold text-[#e4022c] tracking-wider uppercase block">
                    Comercial & Técnica
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1.5">
            {(!isCollapsed || mobileOpen) && (
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tipos de Ordem de Serviço
              </div>
            )}

            {menuItems.map(item => {
              const isActive = currentType === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative group ${
                    isActive
                      ? 'bg-[#e4022c] text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-[#e4022c] group-hover:scale-110 transition-transform'}`}>
                    {item.icon}
                  </div>

                  {(!isCollapsed || mobileOpen) && (
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                            isActive ? 'bg-white text-[#e4022c]' : 'bg-[#e4022c] text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] line-clamp-1 block ${
                        isActive ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {item.desc}
                      </span>
                    </div>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && !isCollapsed && (
                    <div className="absolute right-0 top-2 bottom-2 w-1 bg-white/40 rounded-l"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer & Collapse Toggle */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold transition"
            title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#e4022c]" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-[#e4022c]" />
                <span>Recolher Menu Lateral</span>
              </>
            )}
          </button>

          {(!isCollapsed || mobileOpen) && (
            <div className="mt-2 text-center text-[10px] text-slate-400">
              Gerador de Máscaras • <span className="font-bold text-[#e4022c]">ISP Telecom</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
