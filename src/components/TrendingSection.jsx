import React, { useState } from 'react';
import { Sparkles, Flame, Radio, Disc } from 'lucide-react';
import SongCard from './SongCard.jsx';

const TRENDING_TABS = [
  { id: 'mhr', label: '🎤 Malayalam Rap (MHR)', query: 'mhr malayalam rapper songs' },
  { id: 'malayalam', label: '🔥 Latest Malayalam Hits', query: 'latest malayalam songs 2025' },
  { id: 'indie', label: '⚡ Indian Indie & Rap', query: 'indian indie hip hop songs' },
  { id: 'global', label: '🌍 Global Viral Tracks', query: 'global viral top hits' }
];

export default function TrendingSection({ 
  currentTrack, 
  isPlaying, 
  onPlayTrack, 
  onDownloadTrack,
  onSwitchQuery 
}) {
  const [activeCategory, setActiveCategory] = useState(TRENDING_TABS[0].id);

  const handleTabSelect = (tab) => {
    setActiveCategory(tab.id);
    onSwitchQuery(tab.query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Curated Charts & Playlists</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trending & Featured Music
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {TRENDING_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSelect(tab)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-brand-500 text-dark-bg shadow-md shadow-brand-500/20 font-bold'
                  : 'bg-dark-surface hover:bg-dark-card border border-dark-border text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

