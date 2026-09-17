import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Download, 
  Repeat, 
  SkipBack, 
  SkipForward, 
  Music,
  Mic2,
  ListMusic,
  X
} from 'lucide-react';

export default function AudioPlayer({ 
  currentTrack, 
  isPlaying, 
  setIsPlaying, 
  onNext, 
  onPrev, 
  onDownload,
  onClose,
  onOpenLyrics,
  isLyricsOpen,
  onTimeUpdate,
  seekTarget,
  onOpenQueue,
  isQueueOpen,
  queueCount = 0,
  isAutoplay = true,
  onNeedMoreTracks
}) {
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const hasRequestedMoreRef = useRef(false);

  // Reset flags when current track changes
  useEffect(() => {
    hasRequestedMoreRef.current = false;
  }, [currentTrack?.id]);

  // Sync seekTarget from external components (e.g., Karaoke lyrics click)
  useEffect(() => {
    if (seekTarget && typeof seekTarget.time === 'number' && audioRef.current) {
      audioRef.current.currentTime = seekTarget.time;
      setCurrentTime(seekTarget.time);
    }
  }, [seekTarget]);

  // When track changes, load new audio source
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setIsLoadingAudio(true);
      const streamUrl = `/api/stream?id=${encodeURIComponent(currentTrack.id || currentTrack.url)}`;
      audioRef.current.src = streamUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch((err) => {
          console.warn('Audio playback start warning:', err);
          setIsLoadingAudio(false);
        });
    }
  }, [currentTrack]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume update
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    const d = audioRef.current.duration;

    setCurrentTime(t);
    if (onTimeUpdate) {
      onTimeUpdate(t);
    }
    if (d && !isNaN(d)) {
      setDuration(d);
    }

    // Trigger smart recommendation preload if nearing end of track (within 15s)
    if (d > 0 && d - t <= 15 && isAutoplay && !hasRequestedMoreRef.current) {
      hasRequestedMoreRef.current = true;
      if (onNeedMoreTracks) {
        onNeedMoreTracks();
      }
    }
  };

  const handleTrackEnded = () => {
    if (isLooping) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (onNext) {
      onNext();
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-brand-500/30 bg-dark-bg/95 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.5)]">
      
      {/* Native audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setDuration(audioRef.current.duration);
          }
          setIsLoadingAudio(false);
        }}
        onEnded={handleTrackEnded}
        onError={() => setIsLoadingAudio(false)}
      />

      {/* Top thin progress scrubber bar */}
      <div className="relative w-full h-1.5 bg-dark-card cursor-pointer group">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-neon relative transition-all"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md shadow-brand-neon opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main player controls container */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Track Details */}
        <div className="flex items-center gap-3 min-w-0 max-w-[240px] sm:max-w-xs md:max-w-sm">
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-dark-surface shrink-0 border border-dark-border">
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

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-brand-300 transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {currentTrack.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls & Timers */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Prev Track */}
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="text-slate-400 hover:text-white transition-colors"
                title="Previous track"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Rewind 10s */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="text-slate-400 hover:text-white transition-colors"
              title="Rewind 10s"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              disabled={isLoadingAudio}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-500 text-dark-bg flex items-center justify-center shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              {isLoadingAudio ? (
                <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Forward 10s */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              className="text-slate-400 hover:text-white transition-colors"
              title="Forward 10s"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Next Track */}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                className="text-slate-400 hover:text-white transition-colors"
                title="Next track"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Loop Toggle */}
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1 rounded-lg transition-colors ${
                isLooping ? 'text-brand-neon bg-brand-500/20' : 'text-slate-400 hover:text-white'
              }`}
              title={isLooping ? 'Looping enabled' : 'Loop disabled'}
            >
              <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

          </div>

          {/* Time counters */}
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400 font-semibold">
            <span>{formatSeconds(currentTime)}</span>
            <span>/</span>
            <span>{formatSeconds(duration || currentTrack.duration)}</span>
          </div>
        </div>

        {/* Right: Queue, Lyrics, Volume & Instant Download */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Queue Button */}
          {onOpenQueue && (
            <button
              type="button"
              onClick={onOpenQueue}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isQueueOpen
                  ? 'bg-brand-500/20 text-brand-neon border-brand-500/60 shadow-md shadow-brand-500/20'
                  : 'bg-dark-card/80 text-slate-300 hover:text-white hover:bg-dark-card border-dark-border'
              }`}
              title="Open Smart Queue"
            >
              <ListMusic className="w-3.5 h-3.5 text-brand-neon" />
              <span className="hidden md:inline">Queue</span>
              {queueCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-brand-500/30 text-brand-neon text-[10px] font-bold">
                  {queueCount}
                </span>
              )}
            </button>
          )}

          {/* Karaoke Lyrics Button */}
          {onOpenLyrics && (
            <button
              type="button"
              onClick={onOpenLyrics}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isLyricsOpen
                  ? 'bg-brand-500/20 text-brand-neon border-brand-500/60 shadow-md shadow-brand-500/20'
                  : 'bg-dark-card/80 text-slate-300 hover:text-white hover:bg-dark-card border-dark-border'
              }`}
              title="Toggle Live Synchronized Karaoke Lyrics"
            >
              <Mic2 className="w-3.5 h-3.5 text-brand-neon" />
              <span className="hidden md:inline">Lyrics</span>
            </button>
          )}

          {/* Volume Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-14 sm:w-16 h-1 bg-dark-card rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Download Button */}
          <button
            type="button"
            onClick={() => onDownload(currentTrack, '320k')}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl glow-btn text-dark-bg font-extrabold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shrink-0"
            title="Download this track in 320kbps MP3"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">MP3</span>
          </button>

          {/* Close Player */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
