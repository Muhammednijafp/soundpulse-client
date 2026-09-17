import React from 'react';
import { 
  Radio, 
  Sparkles, 
  X, 
  Trash2, 
  Shuffle, 
  Plus, 
  ListMusic, 
  Disc3, 
  Loader2 
} from 'lucide-react';

export default function DjQueueDrawer({
  isOpen,
  onClose,
  queue = [],
  currentIndex = 0,
  currentTrack,
  isPlaying,
  onPlayTrackAtIndex,
  onRemoveTrackAtIndex,
  onClearQueue,
  onShuffleQueue,
  isAutoplay,
  onToggleAutoplay,
  onAddRecommendations,
  isLoadingRecommendations
}) {
  if (!isOpen) return null;

  const upNextTracks = queue.slice(currentIndex + 1);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div 
        className="relative w-full max-w-md h-full glass-panel border-l border-brand-500/30 flex flex-col bg-dark-bg/95 shadow-2xl z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-dark-border/80 flex items-center justify-between bg-dark-surface/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-neon flex items-center justify-center text-dark-bg shadow-md">
              <Radio className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Smart Queue</span>
                <span className="px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-neon text-[10px] font-bold">
                  {queue.length} Tracks
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Manage playback queue and smart recommendations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
          
          {/* Autoplay Settings Box */}
          <div className="p-4 rounded-2xl bg-dark-surface/90 border border-brand-500/30 flex items-center justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
                <span>Endless Smart Autoplay</span>
              </div>
              <p className="text-[10px] text-slate-400">Auto-discovers and queues similar songs when queue ends</p>
            </div>

            <button
              type="button"
              onClick={onToggleAutoplay}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isAutoplay ? 'bg-brand-500' : 'bg-dark-card border border-dark-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAutoplay ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Currently Playing Card */}
          {currentTrack && (
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-300 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-neon animate-ping" />
                <span>Now Playing</span>
              </div>

              <div className="p-3 rounded-2xl glass-card border border-brand-500/50 flex items-center gap-3 shadow-lg shadow-brand-500/10">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-dark-surface shrink-0 border border-brand-500/40">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 p-1">
                      <span className="w-1 h-3 bg-brand-neon rounded-full animate-wave-1" />
                      <span className="w-1 h-4 bg-brand-neon rounded-full animate-wave-2" />
                      <span className="w-1 h-2 bg-brand-neon rounded-full animate-wave-3" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] text-brand-300 truncate">
                    {currentTrack.artist || 'Unknown Artist'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-brand-neon" />
                <span>Up Next ({upNextTracks.length})</span>
              </div>

              {queue.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onShuffleQueue}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-card transition-colors text-[10px] flex items-center gap-1"
                    title="Shuffle upcoming tracks"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClearQueue}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-card transition-colors text-[10px] flex items-center gap-1"
                    title="Clear upcoming queue"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            {/* Queue items */}
            {upNextTracks.length === 0 ? (
              <div className="p-6 rounded-2xl glass-panel border border-dark-border text-center">
                <Disc3 className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-300 font-bold mb-1">Queue is empty</p>
                <p className="text-[11px] text-slate-400 mb-4">
                  {isAutoplay 
                    ? 'Smart Autoplay is ON — similar tracks will be added automatically!' 
                    : 'Turn on Autoplay or click below to add similar songs.'}
                </p>

                {onAddRecommendations && (
                  <button
                    type="button"
                    onClick={onAddRecommendations}
                    disabled={isLoadingRecommendations}
                    className="px-3 py-2 rounded-xl glow-btn text-dark-bg font-bold text-xs inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isLoadingRecommendations ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Discovering Songs...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+ Add 5 Similar Songs</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {upNextTracks.map((track, i) => {
                  const actualIndex = currentIndex + 1 + i;
                  return (
                    <div
                      key={`${track.id}-${actualIndex}`}
                      className="group p-2 rounded-xl glass-panel border border-dark-border/70 hover:border-brand-500/40 flex items-center justify-between gap-2.5 transition-all"
                    >
                      <div 
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        onClick={() => onPlayTrackAtIndex(actualIndex)}
                      >
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-dark-card shrink-0 border border-dark-border">
                          <img
                            src={track.thumbnail}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
                            {track.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {track.artist || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">
                          {track.durationFormatted}
                        </span>

                        <button
                          type="button"
                          onClick={() => onRemoveTrackAtIndex(actualIndex)}
                          className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Add More Similar Songs Button */}
                {onAddRecommendations && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onAddRecommendations}
                      disabled={isLoadingRecommendations}
                      className="w-full py-2.5 rounded-xl bg-dark-surface hover:bg-dark-card border border-brand-500/30 text-brand-300 hover:text-brand-neon font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {isLoadingRecommendations ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Finding Smart Recommendations...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add More Similar Songs</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
