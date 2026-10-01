/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, 
  Layers, 
  PackageCheck, 
  ShoppingCart, 
  Gamepad2, 
  Tv, 
  Network,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { OSType } from './types/mask';
import { Sidebar } from './components/Sidebar';
import { ComodatoScreen } from './components/screens/ComodatoScreen';
import { CompraScreen } from './components/screens/CompraScreen';
import { GamerScreen } from './components/screens/GamerScreen';
import { ComboTVScreen } from './components/screens/ComboTVScreen';
import { PontoAdicionalScreen } from './components/screens/PontoAdicionalScreen';

export default function App() {
  const [currentType, setCurrentType] = useState<OSType>('comodato');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveScreen = () => {
    switch (currentType) {
      case 'comodato':
        return <ComodatoScreen />;
      case 'compra':
        return <CompraScreen />;
      case 'gamer':
        return <GamerScreen />;
      case 'combo_tv':
        return <ComboTVScreen />;
      case 'ponto_adicional':
        return <PontoAdicionalScreen />;
      default:
        return <ComodatoScreen />;
    }
  };

  const getTypeName = (type: OSType) => {
    switch (type) {
      case 'comodato': return 'Comodato';
      case 'compra': return 'Compra';
      case 'gamer': return 'Gamer';
      case 'combo_tv': return 'Combo TV';
      case 'ponto_adicional': return 'Ponto Adicional / Cabeamento';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900 selection:bg-[#e4022c] selection:text-white">
      {/* Collapsible Responsive Sidebar */}
      <Sidebar
        currentType={currentType}
        onSelectType={setCurrentType}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5 text-[#e4022c]" />
            </button>

            {/* Desktop Screen Title */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e4022c] animate-pulse"></span>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Gerador de Máscara de O.S.
              </h1>
              <span className="hidden sm:inline text-xs font-semibold text-slate-400">•</span>
              <span className="hidden sm:inline text-xs font-bold text-[#e4022c] uppercase bg-[#e4022c]/10 px-2 py-0.5 rounded-md">
                {getTypeName(currentType)}
              </span>
            </div>
          </div>

          {/* Quick Header Type Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'comodato', label: 'Comodato' },
              { id: 'compra', label: 'Compra' },
              { id: 'gamer', label: 'Gamer' },
              { id: 'combo_tv', label: 'Combo TV' },
              { id: 'ponto_adicional', label: 'Ponto Adicional' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentType(tab.id as OSType)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentType === tab.id
                    ? 'bg-[#e4022c] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sidebar Toggle Shortcut for Desktop */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              title={sidebarCollapsed ? 'Expandir Menu Lateral' : 'Recolher Menu Lateral'}
            >
              {sidebarCollapsed ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#e4022c]" />
                  <span>Tela Cheia</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#e4022c]" />
                  <span>Tela Recolhida</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Screen Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
