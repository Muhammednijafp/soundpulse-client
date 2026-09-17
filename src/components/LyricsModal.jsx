import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Mic2, 
  X, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Type, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  Play,
  RotateCcw
} from 'lucide-react';
import axios from 'axios';

export default function LyricsModal({
  track,
  currentTime = 0,
  onSeek,
  onClose,
  isPlaying = false
}) {
  const [lyricsData, setLyricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncedMode, setIsSyncedMode] = useState(true);
  const [fontSize, setFontSize] = useState('text-base'); // text-sm, text-base, text-lg, text-xl
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [parsedLyrics, setParsedLyrics] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Fetch lyrics on track change
  useEffect(() => {
    if (!track) return;

    let isCancelled = false;
    setIsLoading(true);
    setError(null);
    setLyricsData(null);
    setParsedLyrics([]);
    setActiveLineIndex(-1);

    const fetchLyrics = async () => {
      try {
        const titleParam = encodeURIComponent(track.title || '');
        const artistParam = encodeURIComponent(track.artist || '');
        const idParam = encodeURIComponent(track.id || '');
        const durationParam = track.duration || 0;

        const response = await axios.get(`/api/lyrics?title=${titleParam}&artist=${artistParam}&id=${idParam}&duration=${durationParam}`);
        
        if (isCancelled) return;

        if (response.data && response.data.lyrics) {
          const lData = response.data.lyrics;
          setLyricsData(lData);

          if (lData.syncedLyrics) {
            const parsed = parseLrc(lData.syncedLyrics);
            setParsedLyrics(parsed);
            setIsSyncedMode(true);
          } else if (lData.plainLyrics) {
            setIsSyncedMode(false);
          } else {
            setError('Lyrics are not available for this song yet.');
          }
        } else {
          setError('Lyrics not found.');
        }
      } catch (err) {
        console.error('Lyrics fetch error:', err);
        if (!isCancelled) {
          setError('Unable to load lyrics at this moment.');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchLyrics();

    return () => {
      isCancelled = true;
    };
  }, [track]);

  // Parse LRC formatted string into array of { time: seconds, text: string }
  const parseLrc = (lrcString) => {
    if (!lrcString) return [];
    const lines = lrcString.split('\n');
    const result = [];
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

    lines.forEach((line) => {
      const match = [...line.matchAll(timeRegex)];
      const text = line.replace(timeRegex, '').trim();
      if (match.length > 0 && text) {
        match.forEach((m) => {
          const min = parseInt(m[1], 10);
          const sec = parseInt(m[2], 10);
          const ms = m[3] ? parseFloat('0.' + m[3]) : 0;
          const totalSec = min * 60 + sec + ms;
          result.push({ time: totalSec, text: text });
        });
      }
    });

    result.sort((a, b) => a.time - b.time);
    return result;
  };

  // Update active line index based on current playback time
  useEffect(() => {
    if (!isSyncedMode || parsedLyrics.length === 0) return;

    let index = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (currentTime >= parsedLyrics[i].time - 0.3) {
        index = i;
      } else {
        break;
      }
    }

    setActiveLineIndex(index);
  }, [currentTime, parsedLyrics, isSyncedMode]);

  // Auto-scroll to keep active line centered
  useEffect(() => {
    if (isSyncedMode && activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLineIndex, isSyncedMode]);

  const handleCopy = () => {
    const textToCopy = lyricsData?.plainLyrics || 
      parsedLyrics.map(l => l.text).join('\n') || 
      '';
    if (textToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const cycleFontSize = () => {
    if (fontSize === 'text-sm') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-lg');
    else if (fontSize === 'text-lg') setFontSize('text-xl');
    else setFontSize('text-sm');
  };

  if (!track) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div 
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-2xl max-h-[88vh] rounded-3xl'
        } glass-panel border border-brand-500/30 flex flex-col shadow-2xl overflow-hidden bg-dark-bg/95`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-dark-border/80 flex items-center justify-between shrink-0 bg-dark-surface/60 backdrop-blur-md">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-card shrink-0 border border-brand-500/30">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white truncate">
                  {track.title}
                </span>
                {lyricsData?.hasSynced && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/40 uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-brand-neon" /> Synced
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-300 truncate">
                {track.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            
            {/* Synced / Plain view toggle (if synced available) */}
            {lyricsData?.hasSynced && (
              <button
                type="button"
                onClick={() => setIsSyncedMode(!isSyncedMode)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSyncedMode
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-dark-surface hover:bg-dark-card text-slate-400 border-dark-border'
                }`}
                title="Toggle Karaoke Synced vs Plain View"
              >
                {isSyncedMode ? 'Karaoke Sync' : 'Plain Text'}
              </button>
            )}

            {/* Font Size Button */}
            <button
              type="button"
              onClick={cycleFontSize}
              className="p-2 rounded-xl bg-dark-surface hover:bg-dark-card border border-dark-border text-slate-300 hover:text-white transition-colors"
              title="Change font size"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl bg-dark-surface hover:bg-dark-card border border-dark-border text-slate-300 hover:text-white transition-colors"
              title="Copy lyrics"
            >
              {isCopied ? <Check className="w-4 h-4 text-brand-neon" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:block p-2 rounded-xl bg-dark-surface hover:bg-dark-card border border-dark-border text-slate-300 hover:text-white transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors"
              title="Close lyrics"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Content Body */}
        <div 
          ref={lyricsContainerRef}
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 custom-scrollbar space-y-4 text-center select-text"
        >
          
          {/* Loading state */}
          {isLoading && (
            <div className="py-24 text-center">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-white">Searching and aligning song lyrics...</p>
              <p className="text-xs text-slate-400 mt-1">Checking synchronized lyric databases</p>
            </div>
          )}

          {/* Error / Not Found */}
          {error && !isLoading && (
            <div className="py-20 text-center max-w-sm mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Mic2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Lyrics Not Available</h4>
              <p className="text-xs text-slate-400 mb-6">
                {error}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-dark-surface hover:bg-dark-card border border-dark-border text-xs font-bold text-slate-300 hover:text-white"
              >
                Close Lyrics
              </button>
            </div>
          )}

          {/* Synchronized Karaoke Mode */}
          {!isLoading && !error && isSyncedMode && parsedLyrics.length > 0 && (
            <div className="space-y-6 py-8">
              {parsedLyrics.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                const isPast = idx < activeLineIndex;

                return (
                  <p
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => {
                      if (onSeek) onSeek(line.time);
                    }}
                    className={`cursor-pointer transition-all duration-300 font-bold leading-relaxed px-4 py-2 rounded-2xl ${fontSize} ${
                      isActive
                        ? 'text-brand-neon scale-105 sm:scale-110 drop-shadow-[0_0_20px_rgba(0,245,155,0.4)] bg-brand-500/10 border border-brand-500/30'
                        : isPast
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={`Click to jump to ${Math.floor(line.time / 60)}:${Math.floor(line.time % 60).toString().padStart(2, '0')}`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          )}

          {/* Plain Text Mode */}
          {!isLoading && !error && (!isSyncedMode || parsedLyrics.length === 0) && (
            <div className="py-6 whitespace-pre-line text-slate-200 leading-relaxed max-w-xl mx-auto font-medium">
              <p className={fontSize}>
                {lyricsData?.plainLyrics || parsedLyrics.map(l => l.text).join('\n')}
              </p>
            </div>
          )}

        </div>

        {/* Footer Hint */}
        {!isLoading && !error && (
          <div className="px-5 py-3 border-t border-dark-border/60 bg-dark-surface/40 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <Mic2 className="w-3.5 h-3.5 text-brand-neon" />
              <span>{isSyncedMode ? 'Click any lyric line to jump audio' : 'Full Song Lyrics'}</span>
            </div>
            <span>Source: {lyricsData?.source || 'SoundPulse'}</span>
          </div>
        )}

      </div>
    </div>
  );
}