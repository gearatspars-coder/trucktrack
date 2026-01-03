
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
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden lg:flex">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shadow-blue-500/20">
            TT
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">TruckTrack</h1>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Fleet Monitor</p>
          </div>
        </div>
        
        <nav className="flex-1 mt-4 px-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
              {activeTab === item.id && (
                <div className={`ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]`}></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
             <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all mb-2"
            >
              <span className="text-lg">🌐</span>
              <span className="font-bold text-xs uppercase tracking-widest">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <span className="text-lg">🚪</span>
              <span className="font-bold text-xs uppercase tracking-widest">{t.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-50">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Current Module
            </h2>
            <h3 className="text-xl font-black text-slate-900 capitalize">
              {t[activeTab as keyof typeof t] || activeTab}
            </h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`hidden sm:block ${isRtl ? 'text-left' : 'text-right'}`}>
              <p className="text-sm font-black text-slate-900">Operations Control</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Live
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 shadow-inner">
              <span className="text-xl">👤</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
