import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  Play, 
  Flame, 
  Moon, 
  Coffee, 
  Heart, 
  HeartHandshake, 
  Mic2, 
  Disc3, 
  Headphones, 
  Music, 
  Layers, 
  Sliders,
  ChevronRight,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import SongCard from './SongCard.jsx';

const ICON_MAP = {
  Moon: Moon,
  Flame: Flame,
  Coffee: Coffee,
  Sparkles: Sparkles,
  HeartHandshake: HeartHandshake,
  Mic2: Mic2,
  Disc3: Disc3,
  Heart: Heart,
};

export default function MoodRadioSection({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayStationQueue,
  onDownloadTrack,
  isAutoplay,
  onToggleAutoplay
}) {
  const [stations, setStations] = useState([]);
  const [activeMood, setActiveMood] = useState('late_night');
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stations and initial tracks
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const fetchMoodTracks = async () => {
      try {
        const response = await axios.get(`/api/radio/tracks?mood=${activeMood}&limit=16`);
        if (!isCancelled && response.data) {
          if (response.data.stations) {
            setStations(response.data.stations);
          }
          if (response.data.tracks) {
            setTracks(response.data.tracks);
          }
        }
      } catch (err) {
        console.error('Mood radio fetch error:', err);
        if (!isCancelled) {
          setError('Failed to load mood station tracks.');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchMoodTracks();

    return () => {
      isCancelled = true;
    };
  }, [activeMood]);

  const activeStation = stations.find(s => s.id === activeMood) || stations[0];

  const handleStartStation = () => {
    if (tracks && tracks.length > 0 && onPlayStationQueue) {
      onPlayStationQueue(tracks, 0, activeStation?.title);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-brand-500/30 p-6 sm:p-10 mb-10 bg-gradient-to-r from-dark-surface via-dark-bg to-dark-surface shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-brand-neon/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Radio className="w-4 h-4 text-brand-neon animate-pulse" />
              <span>Smart Mood Radio & Non-Stop DJ Flow</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Infinite Vibe Stations with <span className="bg-gradient-to-r from-brand-300 via-brand-neon to-brand-400 bg-clip-text text-transparent">Smart Autoplay</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Select your mood to stream endless curated tracks. Continuous playback with smart recommendations tailored to your vibe.
            </p>

            {/* Quick DJ Stats / Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartStation}
                disabled={isLoading || tracks.length === 0}
                className="px-6 py-3 rounded-2xl glow-btn text-dark-bg font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play {activeStation?.title || 'Station'} Non-Stop</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-dark-card/90 border border-dark-border text-xs text-slate-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-neon animate-ping" />
                <span>Smart Autoplay: <strong className={isAutoplay ? "text-brand-neon" : "text-slate-400"}>{isAutoplay ? "ON" : "OFF"}</strong></span>
              </div>
            </div>
          </div>

          {/* Active Station Banner Card */}
          {activeStation && (
            <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-3xl bg-dark-card/80 border border-brand-500/40 w-72 text-center shadow-xl">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${activeStation.color} flex items-center justify-center mb-4 shadow-lg text-white`}>
                {(() => {
                  const IconComp = ICON_MAP[activeStation.icon] || Radio;
                  return <IconComp className="w-8 h-8 stroke-[2.2]" />;
                })()}
              </div>
              <span className="text-xs uppercase font-bold text-brand-300 tracking-wider mb-1">
                {activeStation.badge}
              </span>
              <h3 className="text-lg font-bold text-white mb-1">
                {activeStation.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {activeStation.subtitle}
              </p>
              <div className="text-[11px] font-mono text-slate-400 bg-dark-surface px-3 py-1 rounded-full border border-dark-border">
                {tracks.length} HD tracks loaded
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mood Stations Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-neon" />
              <span>Select Vibe Station</span>
            </h2>
            <p className="text-xs text-slate-400">
              Pick a vibe to immediately switch radio channels
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stations.map((station) => {
            const isCurrent = activeMood === station.id;
            const IconComp = ICON_MAP[station.icon] || Radio;

            return (
              <div
                key={station.id}
                onClick={() => setActiveMood(station.id)}
                className={`group relative p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isCurrent
                    ? 'glass-card border-brand-500 shadow-xl shadow-brand-500/20 scale-[1.02]'
                    : 'glass-panel border-dark-border/80 hover:border-brand-500/50 hover:scale-[1.01]'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-brand-neon text-dark-bg text-[10px] font-extrabold uppercase tracking-wider shadow-md shadow-brand-neon/30 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> Active
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${station.color} flex items-center justify-center mb-3 text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6 stroke-[2.3]" />
                </div>

                <div className="text-[10px] uppercase font-bold text-brand-300 tracking-wider mb-0.5">
                  {station.badge}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {station.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {station.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Station Tracks Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-dark-border/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-brand-neon" />
              <span>{activeStation?.title || 'Radio'} Tracklist</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isLoading ? 'Fetching tracks...' : `Showing ${tracks.length} continuous tracks ready for DJ mix`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartStation}
            disabled={isLoading || tracks.length === 0}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 hover:text-brand-neon text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play All in DJ Mode</span>
          </button>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
                <div className="rounded-xl aspect-video bg-dark-card mb-4" />
                <div className="h-4 bg-dark-card rounded-md w-3/4 mb-2" />
                <div className="h-3 bg-dark-card rounded-md w-1/2 mb-4" />
                <div className="h-8 bg-dark-card rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error notice */}
        {error && !isLoading && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Tracks List */}
        {!isLoading && tracks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {tracks.map((track) => (
              <SongCard
                key={track.id}
                track={track}
                isCurrent={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                onPlay={onPlayTrack}
                onDownload={onDownloadTrack}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

