import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, language, setLanguage }) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: '📊' },
    { id: 'trips', label: t.trips, icon: '🚛' },
    { id: 'reports', label: t.reports, icon: '📋' },
    { id: 'gps', label: t.gps, icon: '📍' },
    { id: 'settings', label: t.settings, icon: '⚙️' },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 overflow-hidden ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar - Premium Dark Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col hidden lg:flex shadow-[20px_0_60px_rgba(0,0,0,0.05)] z-20">
        <div className="p-12 flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-2xl font-black shadow-2xl shadow-blue-500/20 ring-4 ring-white/5">
            TT
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">TruckTrack</h1>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1.5 opacity-80">Fleet Operations</p>
          </div>
        </div>
        
        <nav className="flex-1 mt-6 px-8 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-500 group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={`text-2xl transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-[0_0_15px_#fff] animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-700/30">
             <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center gap-4 px-5 py-4 text-slate-300 hover:text-white hover:bg-slate-700 rounded-2xl transition-all mb-3 group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform">🌐</span>
              <span className="font-black text-[10px] uppercase tracking-widest">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all group"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
              <span className="font-black text-[10px] uppercase tracking-widest">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-24 bg-white/70 backdrop-blur-xl border-b border-slate-100/80 px-12 flex items-center justify-between sticky top-0 z-50">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">
              System Console
            </h2>
            <h3 className="text-2xl font-black text-slate-900 capitalize tracking-tight">
              {t[activeTab as keyof typeof t] || activeTab}
            </h3>
          </div>
          
          <div className="flex items-center gap-10">
            <div className={`hidden sm:flex flex-col ${isRtl ? 'items-start' : 'items-end'}`}>
              <p className="text-sm font-black text-slate-900 tracking-tight">Operations Hub</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  Live & Encrypted
                </p>
              </div>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-white to-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-xl shadow-slate-200/20 group cursor-pointer transition-all hover:border-blue-200">
              <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;