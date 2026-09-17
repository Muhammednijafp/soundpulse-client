import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Download, 
  Clock, 
  Eye, 
  Check, 
  Share2, 
  Music, 
  ChevronDown 
} from 'lucide-react';

export default function SongCard({ 
  track, 
  isPlaying, 
  isCurrent, 
  onPlay, 
  onDownload 
}) {
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (track.url && navigator.clipboard) {
      navigator.clipboard.writeText(track.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadClick = (e, bitrate) => {
    e.stopPropagation();
    setShowQualityMenu(false);
    onDownload(track, bitrate);
  };

  return (
    <div className={`group glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
      isCurrent ? 'ring-2 ring-brand-500 bg-dark-card/90 shadow-xl shadow-brand-500/10' : ''
    }`}>
      
      {/* Top Thumbnail Section */}
      <div className="relative rounded-xl overflow-hidden aspect-video mb-3.5 bg-dark-surface">
        <img
          src={track.thumbnail}
          alt={track.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-dark-bg/85 backdrop-blur-md text-slate-200 text-[11px] font-mono font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3 text-brand-400" />
          <span>{track.durationFormatted}</span>
        </div>

        {/* Play Overlay Button */}
        <div 
          onClick={() => onPlay(track)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-brand-500 text-dark-bg flex items-center justify-center shadow-lg shadow-brand-500/40 hover:scale-110 active:scale-95 transition-transform">
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Active Audio Wave Indicator */}
        {isCurrent && isPlaying && (
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-dark-bg/90 backdrop-blur-md border border-brand-500/40 flex items-center gap-1">
            <span className="w-1 h-3 bg-brand-neon rounded-full animate-wave-1" />
            <span className="w-1 h-4 bg-brand-neon rounded-full animate-wave-2" />
            <span className="w-1 h-2.5 bg-brand-neon rounded-full animate-wave-3" />
            <span className="text-[10px] font-bold text-brand-300 ml-1">PLAYING</span>
          </div>
        )}
      </div>

      {/* Track Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 
            title={track.title}
            onClick={() => onPlay(track)}
            className="font-bold text-sm sm:text-base text-white hover:text-brand-300 line-clamp-2 cursor-pointer transition-colors leading-tight mb-1"
          >
            {track.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-medium text-slate-300 truncate max-w-[170px]" title={track.artist}>
              {track.artist}
            </span>
            {track.viewsFormatted && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                <Eye className="w-3 h-3" />
                {track.viewsFormatted}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Play + Download Menu + Share */}
        <div className="pt-2 border-t border-dark-border/60 flex items-center gap-2 relative">
          
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => onPlay(track)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isCurrent
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'bg-dark-surface hover:bg-dark-hover text-slate-200 border border-dark-border'
            }`}
          >
            {isCurrent && isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Download Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowQualityMenu(!showQualityMenu);
              }}
              className="py-2 px-3 rounded-xl glow-btn text-dark-bg font-bold text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
              title="Download MP3"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>MP3</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Quality selection popup menu */}
            {showQualityMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQualityMenu(false);
                  }} 
                />
                <div className="absolute right-0 bottom-full mb-2 w-48 rounded-xl glass-panel border border-brand-500/30 p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Select Audio Quality
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDownloadClick(e, '320k')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-brand-500/20 hover:text-brand-300 flex items-center justify-between transition-colors font-medium"
                  >
                    <span>320 kbps (Studio MP3)</span>
                    <span className="text-[10px] px-1 bg-brand-500/20 text-brand-400 rounded">Best</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDownloadClick(e, '192k')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-brand-500/20 hover:text-brand-300 flex items-center justify-between transition-colors font-medium"
                  >
                    <span>192 kbps (High Quality)</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDownloadClick(e, '128k')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-brand-500/20 hover:text-brand-300 flex items-center justify-between transition-colors font-medium"
                  >
                    <span>128 kbps (Fast DL)</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Copy / Share Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy song link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-brand-neon" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

        </div>
      </div>

    </div>
  );
}

