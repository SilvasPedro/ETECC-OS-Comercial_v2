import React from 'react';
import { 
  FileText, 
  Plus, 
  Users, 
  Sparkles, 
  Settings, 
  Layers, 
  Database,
  CloudCheck,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { CompanyProfile } from '../types/os';
import { firebaseConfig } from '../services/firebase';

export type NavTab = 'orders' | 'new_order' | 'clients' | 'catalog' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  ordersCount: number;
  clientsCount: number;
  company: CompanyProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  ordersCount,
  clientsCount,
  company
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 app-header shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => onTabChange('orders')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                  Gerador de OS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  Comercial
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[180px] sm:max-w-none">
                {company.tradeName || company.name}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                currentTab === 'orders'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ordens de Serviço</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                currentTab === 'orders' ? 'bg-blue-200 text-blue-900 font-bold' : 'bg-slate-200 text-slate-700'
              }`}>
                {ordersCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('clients')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                currentTab === 'clients'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                currentTab === 'clients' ? 'bg-blue-200 text-blue-900 font-bold' : 'bg-slate-200 text-slate-700'
              }`}>
                {clientsCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                currentTab === 'catalog'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Catálogo</span>
            </button>

            <button
              onClick={() => onTabChange('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                currentTab === 'settings'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Empresa & Firebase</span>
            </button>
          </nav>

          {/* Right Area: Firebase status + Action Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Pill */}
            <div 
              onClick={() => onTabChange('settings')}
              title={`Conectado ao Firebase: ${firebaseConfig.projectId}`}
              className="hidden lg:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700 px-2.5 py-1 rounded-full text-[11px] font-semibold transition border border-slate-200"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[10px] text-slate-500">Firebase:</span>
              <span className="font-mono text-[10px] text-slate-800 font-bold truncate max-w-[110px]">
                {firebaseConfig.projectId}
              </span>
            </div>

            {/* New OS Action Button */}
            <button
              onClick={() => onTabChange('new_order')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova OS</span>
              <span className="sm:hidden">Nova</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            <button
              onClick={() => {
                onTabChange('orders');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                currentTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Ordens de Serviço
              </span>
              <span className="font-mono text-[11px]">{ordersCount}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('clients');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                currentTab === 'clients' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clientes
              </span>
              <span className="font-mono text-[11px]">{clientsCount}</span>
            </button>

            <button
              onClick={() => {
                onTabChange('catalog');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                currentTab === 'catalog' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Catálogo de Serviços e Peças
            </button>

            <button
              onClick={() => {
                onTabChange('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                currentTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              Empresa & Firebase ({firebaseConfig.projectId})
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
