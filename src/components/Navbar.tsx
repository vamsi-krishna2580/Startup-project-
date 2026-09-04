import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BarChart2, 
  History, 
  Network, 
  Server, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  Settings2,
  Menu,
  X
} from 'lucide-react';
import { getApiSettings } from '../api/startupApi';

interface NavbarProps {
  currentTab: 'home' | 'analyze' | 'results' | 'history' | 'architecture';
  onNavigate: (tab: 'home' | 'analyze' | 'results' | 'history' | 'architecture') => void;
  hasReport: boolean;
  onOpenBackendModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  hasReport,
  onOpenBackendModal
}) => {
  const [apiSettings, setApiSettings] = useState(getApiSettings());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setApiSettings(getApiSettings());
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'analyze', label: 'Analyze', icon: PlusCircle },
    ...(hasReport ? [{ id: 'results', label: 'Dashboard', icon: BarChart2 }] : []),
    { id: 'history', label: 'History', icon: History },
    { id: 'architecture', label: 'How It Works', icon: Network },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-xs border border-slate-800">
              <span className="font-mono text-blue-400 font-black">AI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  AI STARTUP VALIDATOR
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  v2.4
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Multi-Agent Capstone Architecture
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Backend Switcher Pill & CTA */}
          <div className="flex items-center gap-2.5">
            {/* Backend connection indicator pill */}
            <button
              id="btn-backend-status-pill"
              onClick={onOpenBackendModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-mono transition-colors cursor-pointer"
              title="Click to configure backend connection"
            >
              <span className={`w-2 h-2 rounded-full ${
                apiSettings.mode === 'api' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}></span>
              <span className="font-semibold text-[11px]">
                {apiSettings.mode === 'api' ? 'FastAPI Active' : apiSettings.mode === 'demo' ? 'Demo Mode' : 'Auto Engine'}
              </span>
              <Settings2 className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {currentTab !== 'analyze' && (
              <button
                id="btn-nav-analyze-cta"
                onClick={() => onNavigate('analyze')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
