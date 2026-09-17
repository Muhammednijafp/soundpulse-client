import React, { useState } from 'react';
import { Search, X, Flame, Sparkles, Mic, Music2, ArrowRight } from 'lucide-react';

const POPULAR_TAGS = [
  { label: '🎤 MHR Malayalam Rap', query: 'mhr malayalam rapper songs' },
  { label: '🔥 Dabzee & Joker', query: 'dabzee joker malayalam songs' },
  { label: '⚡ Hanumankind', query: 'hanumankind rap songs' },
  { label: '✨ Fejo & ThirumaLi', query: 'fejo thirumali malayalam rap' },
  { label: '🌴 Sushin Shyam Hits', query: 'sushin shyam malayalam songs' },
  { label: '🎶 Arijit Singh Hits', query: 'arijit singh best songs' },
  { label: '🎵 Malayalam Melody Hits', query: 'latest malayalam songs 2025 2026' },
  { label: '🎧 Lofi & Chillhop', query: 'lofi chill beats songs' }
];

export default function SearchSection({ onSearch, currentQuery, isLoading }) {
  const [searchInput, setSearchInput] = useState(currentQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleTagClick = (query) => {
    setSearchInput(query);
    onSearch(query);
  };

  const clearInput = () => {
    setSearchInput('');
  };

  return (
    <section className="relative pt-6 pb-10 text-center">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4">
        
        {/* Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
          <span>Unlimited Free High-Quality MP3 Downloader</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Find Any Song, Artist or <span className="bg-gradient-to-r from-brand-neon to-brand-400 bg-clip-text text-transparent">Malayalam Rapper</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
          Type any singer, rapper, or song name (like <span className="text-brand-300 font-semibold">MHR</span>) to preview live and download studio-quality 320kbps MP3s straight to your device.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden glass-panel border border-brand-500/30 focus-within:border-brand-neon focus-within:ring-2 focus-within:ring-brand-500/20 transition-all duration-300">
            <div className="pl-5 text-slate-400">
              <Search className="w-6 h-6 text-brand-400" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by artist (e.g. MHR), song title, or album..."
              className="w-full py-4 pl-3.5 pr-28 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base sm:text-lg font-medium"
            />

            {searchInput && (
              <button
                type="button"
                onClick={clearInput}
                className="p-2 text-slate-400 hover:text-white mr-1 transition-colors"
                title="Clear text"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-xl glow-btn text-dark-bg font-bold text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Artist & Preset Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Popular:
          </span>
          {POPULAR_TAGS.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => handleTagClick(tag.query)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-dark-surface/80 hover:bg-brand-500/20 border border-dark-border hover:border-brand-500/40 text-slate-300 hover:text-brand-300 transition-all duration-200"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}

