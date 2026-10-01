import React from 'react';
import { 
  PackageCheck, 
  CreditCard, 
  Gamepad2, 
  Tv, 
  ClipboardCheck, 
  Car,
  Search,
  ChevronLeft, 
  ChevronRight,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { OSType } from '../types/mask';

interface SidebarProps {
  currentType: OSType;
  onSelectType: (type: OSType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

interface MenuItemDef {
  id: OSType;
  label: string;
  icon: React.ReactNode;
  desc: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentType,
  onSelectType,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  isDarkMode,
  onToggleDarkMode
}) => {
  // 1. Group of O.S. Masks (WITHOUT badges like Pré, TOP, Novo)
  const osMenuItems: MenuItemDef[] = [
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
      desc: 'Cliente compra equipamento e faz recargas para uso'
    },
    {
      id: 'gamer',
      label: 'Gamer',
      icon: <Gamepad2 className="w-5 h-5 shrink-0" />,
      desc: 'Plano de 1Gbps com ExitLAG e cabeamentos.'
    },
    {
      id: 'combo_tv',
      label: 'Combo TV',
      icon: <Tv className="w-5 h-5 shrink-0" />,
      desc: 'Internet + TV Box ou IPTV'
    },
    {
      id: 'avaliacao',
      label: 'Avaliação',
      icon: <ClipboardCheck className="w-5 h-5 shrink-0" />,
      desc: 'Cabeamento TV e Ponto Adicional / Gamer'
    },
    {
      id: 'e_tracker',
      label: 'E-Tracker',
      icon: <Car className="w-5 h-5 shrink-0" />,
      desc: 'Rastreador veicular de auto gestão via app'
    }
  ];

  // 2. Separate Tools & Utilities Group (WITHOUT badges)
  const toolMenuItems: MenuItemDef[] = [
    {
      id: 'consulta_cep',
      label: 'Consultar CEP',
      icon: <Search className="w-5 h-5 shrink-0" />,
      desc: 'Pesquisa por CEP, rua e bairro no CSV'
    }
  ];

  const handleSelect = (id: OSType) => {
    onSelectType(id);
    onCloseMobile();
  };

  const renderMenuItem = (item: MenuItemDef) => {
    const isActive = currentType === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={`w-full group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left relative ${
          isActive
            ? 'bg-[#e4022c] text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
        }`}
        title={isCollapsed && !mobileOpen ? `${item.label} - ${item.desc}` : undefined}
      >
        <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#e4022c] group-hover:scale-110 transition-transform'}`}>
          {item.icon}
        </span>

        {(!isCollapsed || mobileOpen) && (
          <div className="flex-1 min-w-0 pr-2">
            <span className={`text-xs font-bold truncate block ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
              {item.label}
            </span>
            <p className={`text-[11px] truncate mt-0.5 leading-tight ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
              {item.desc}
            </p>
          </div>
        )}

        {/* Small Active Indicator for collapsed state */}
        {isCollapsed && !mobileOpen && isActive && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"></span>
        )}
      </button>
    );
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
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Uses exact app favicon */}
              <img 
                src="/favicon.svg" 
                alt="Logo" 
                className="w-10 h-10 rounded-xl shrink-0 shadow-xs object-contain" 
              />
              {(!isCollapsed || mobileOpen) && (
                <div className="overflow-hidden transition-opacity duration-200">
                  <h1 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-tight tracking-tight uppercase">
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
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Máscaras de O.S. */}
          <div className="p-3 space-y-1">
            {(!isCollapsed || mobileOpen) && (
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Máscaras de O.S.
              </div>
            )}
            {osMenuItems.map(renderMenuItem)}
          </div>

          {/* Section 2: Utilitários & Consulta (Separated from O.S.) */}
          <div className="p-3 pt-1 space-y-1 border-t border-slate-100 dark:border-slate-800 mt-2">
            {(!isCollapsed || mobileOpen) && (
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Ferramentas & Consulta</span>
              </div>
            )}
            {toolMenuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Sidebar Footer with Dark Mode Toggle, Version v1.0 and Collapse Toggle */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 space-y-2">
          {/* Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition text-xs font-semibold"
            title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro Suave'}
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              {(!isCollapsed || mobileOpen) && (
                <span>{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
              )}
            </div>
            {(!isCollapsed || mobileOpen) && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {isDarkMode ? 'Escuro' : 'Claro'}
              </span>
            )}
          </button>

          {/* Version Reference v1.0 & Collapse Button */}
          <div className="flex items-center justify-between pt-1">
            {/* Version Reference v1.0 */}
            {(!isCollapsed || mobileOpen) ? (
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>v1.0</span>
              </div>
            ) : (
              <div className="mx-auto text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                v1.0
              </div>
            )}

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
              title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
