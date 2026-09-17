import React from 'react';
import { Music, Link2, Sparkles, ShieldCheck, Search, Headphones, Info, Smartphone, QrCode, Radio } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenLegal, onOpenQr }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-dark-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('search')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-neon flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
            <Music className="w-6 h-6 text-dark-bg stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                SoundPulse
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
                MP3 Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Free Music Search & MP3 Downloader</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-dark-surface/80 border border-dark-border/60">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-brand-500 text-dark-bg shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-dark-card/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('radio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'radio'
                ? 'bg-brand-500 text-dark-bg shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-dark-card/60'
            }`}
          >
            <Radio className="w-4 h-4 text-brand-neon" />
            <span>Mood Radio</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'url'
                ? 'bg-brand-500 text-dark-bg shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-dark-card/60'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Paste Song URL</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'trending'
                ? 'bg-brand-500 text-dark-bg shadow-md shadow-brand-500/25'
                : 'text-slate-300 hover:text-white hover:bg-dark-card/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Trending Hits</span>
          </button>
        </nav>

        {/* Action Buttons: Open on Mobile + Legal */}
        <div className="flex items-center gap-2 sm:gap-3">
          
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
            <span className="hidden lg:inline">Legal</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex items-center justify-around border-t border-dark-border/50 px-2 py-2 bg-dark-surface/95">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium ${
            activeTab === 'search' ? 'text-brand-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button
          onClick={() => setActiveTab('radio')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium ${
            activeTab === 'radio' ? 'text-brand-400' : 'text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Radio</span>
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium ${
            activeTab === 'url' ? 'text-brand-400' : 'text-slate-400'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>URL</span>
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium ${
            activeTab === 'trending' ? 'text-brand-400' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Trends</span>
        </button>
        <button
          onClick={onOpenQr}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-brand-300"
        >
          <QrCode className="w-4 h-4 text-brand-neon" />
          <span>QR</span>
        </button>
      </div>
    </header>
  );
}

