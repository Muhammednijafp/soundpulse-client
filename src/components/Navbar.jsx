import React from 'react';
import { 
  Music, 
  Link2, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Headphones, 
  Smartphone, 
  QrCode, 
  Radio, 
  Activity, 
  BarChart3,
  Flame,
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenLegal, onOpenQr }) {
  const NAV_ITEMS = [
    { id: 'search', label: 'Explore & Search', icon: Search },
    { id: 'studio', label: '3D Sound Studio', icon: Activity, badge: 'New' },
    { id: 'metrics', label: 'Platform Analytics', icon: BarChart3 },
    { id: 'radio', label: 'Mood Radio', icon: Radio },
    { id: 'url', label: 'Paste URL', icon: Link2 },
    { id: 'trending', label: 'Trending Hits', icon: Sparkles }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-dark-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('search')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-neon flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <Music className="w-6 h-6 text-dark-bg stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                SoundPulse
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                320k HD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Free Music & Lossless MP3 Downloader</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-dark-surface/80 border border-dark-border/60">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                  isActive
                    ? 'bg-brand-500 text-dark-bg font-bold shadow-md shadow-brand-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-dark-card/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-dark-bg' : 'text-brand-neon'}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-brand-500/20 text-brand-neon rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Open on Mobile + Legal */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Open on Phone QR Trigger */}
          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/40 text-brand-300 hover:text-brand-neon transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Scan QR Code to open on mobile phone"
          >
            <Smartphone className="w-4 h-4 text-brand-neon" />
            <span className="hidden sm:inline">Open on Phone</span>
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
          </button>

          {/* Legal Modal Trigger */}
          <button
            onClick={onOpenLegal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-300 hover:text-brand-300 transition-colors"
            title="Legal information & Fair Use disclaimer"
          >
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span className="hidden md:inline">Legal</span>
          </button>
        </div>

      </div>

      {/* Mobile & Tablet navigation horizontal scroll bar */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-dark-border/50 px-2 py-1.5 bg-dark-surface/95 scrollbar-none gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                isActive ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-brand-neon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
