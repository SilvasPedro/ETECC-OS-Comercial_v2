/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Maximize2,
  Minimize2,
  Sun,
  Moon
} from 'lucide-react';
import { OSType } from './types/mask';
import { Sidebar } from './components/Sidebar';
import { ComodatoScreen } from './components/screens/ComodatoScreen';
import { SmartPreScreen } from './components/screens/SmartPreScreen';
import { GamerScreen } from './components/screens/GamerScreen';
import { ComboTVScreen } from './components/screens/ComboTVScreen';
import { AvaliacaoScreen } from './components/screens/AvaliacaoScreen';
import { ETrackerScreen } from './components/screens/ETrackerScreen';
import { ConsultaCepScreen } from './components/screens/ConsultaCepScreen';

export default function App() {
  const [currentType, setCurrentType] = useState<OSType>('comodato');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Soft Dark Mode State with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('os_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('os_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('os_dark_mode', 'false');
      }
    } catch (e) {
      console.warn(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const renderActiveScreen = () => {
    switch (currentType) {
      case 'comodato':
        return <ComodatoScreen />;
      case 'smart_pre':
        return <SmartPreScreen />;
      case 'gamer':
        return <GamerScreen />;
      case 'combo_tv':
        return <ComboTVScreen />;
      case 'avaliacao':
      case 'ponto_adicional':
        return <AvaliacaoScreen />;
      case 'e_tracker':
        return <ETrackerScreen />;
      case 'consulta_cep':
        return <ConsultaCepScreen />;
      default:
        return <ComodatoScreen />;
    }
  };

  const getTypeName = (type: OSType) => {
    switch (type) {
      case 'comodato': return 'Comodato';
      case 'smart_pre': return 'SMART-PRÉ';
      case 'gamer': return 'Gamer';
      case 'combo_tv': return 'Combo TV';
      case 'avaliacao': return 'Avaliação';
      case 'e_tracker': return 'E-Tracker';
      case 'ponto_adicional': return 'Avaliação';
      case 'consulta_cep': return 'Consulta de CEP';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 selection:bg-[#e4022c] selection:text-white transition-colors duration-200">
      {/* Collapsible Responsive Sidebar */}
      <Sidebar
        currentType={currentType}
        onSelectType={setCurrentType}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5 text-[#e4022c]" />
            </button>

            {/* Desktop Screen Title */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e4022c] animate-pulse"></span>
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight">
                Gerador de Máscara de O.S.
              </h1>
              <span className="hidden sm:inline text-xs font-semibold text-slate-400">•</span>
              <span className="hidden sm:inline text-xs font-bold text-[#e4022c] uppercase bg-[#e4022c]/10 px-2 py-0.5 rounded-md">
                {getTypeName(currentType)}
              </span>
            </div>
          </div>

          {/* Quick Header Type Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'comodato', label: 'Comodato' },
              { id: 'smart_pre', label: 'SMART-PRÉ' },
              { id: 'gamer', label: 'Gamer' },
              { id: 'combo_tv', label: 'Combo TV' },
              { id: 'avaliacao', label: 'Avaliação' },
              { id: 'e_tracker', label: 'E-Tracker' },
              { id: 'consulta_cep', label: 'Consultar CEP' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentType(tab.id as OSType)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentType === tab.id
                    ? 'bg-[#e4022c] text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Toolbar: Dark Mode Toggle, Version Badge & Sidebar Toggle */}
          <div className="flex items-center gap-2">
            {/* Soft Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro Suave'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Version Badge Reference (v1.0) */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-mono font-bold select-none"
              title="Versão do Sistema: v1.0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>v1.0</span>
            </div>

            {/* Sidebar Toggle Shortcut for Desktop */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
