import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import SearchSection from './components/SearchSection.jsx';
import MoodRadioSection from './components/MoodRadioSection.jsx';
import UrlDownloader from './components/UrlDownloader.jsx';
import SongCard from './components/SongCard.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import TrendingSection from './components/TrendingSection.jsx';
import LegalModal from './components/LegalModal.jsx';
import DownloadProgressModal from './components/DownloadProgressModal.jsx';
import LyricsModal from './components/LyricsModal.jsx';
import MobileQrModal from './components/MobileQrModal.jsx';
import DjQueueDrawer from './components/DjQueueDrawer.jsx';
import { Music, Sparkles, AlertCircle, Headphones, Disc3, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('mhr malayalam rapper songs');
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Audio Player & Smart Queue State
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [seekTarget, setSeekTarget] = useState(null);

  // Smart Queue & Autoplay State
  const [queue, setQueue] = useState([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Lyrics & Mobile QR Modal State
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Download State
  const [downloadingTrack, setDownloadingTrack] = useState(null);
  const [downloadBitrate, setDownloadBitrate] = useState('320k');

  // Legal Modal State
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // Initial load: fetch default featured tracks (MHR Malayalam Rap)
  useEffect(() => {
    handleSearch('mhr malayalam rapper songs');
  }, []);

  // Perform search
  const handleSearch = async (query) => {
    if (!query || !query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}&limit=16`);
      if (response.data && response.data.tracks) {
        setTracks(response.data.tracks);
      } else {
        setTracks([]);
      }
    } catch (err) {
      console.error('Search request failed:', err);
      setError('Unable to load tracks at this time. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Play single track handler
  const handlePlayTrack = (track, customQueue = null, index = -1) => {
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    let targetQueue = customQueue || queue;
    if (!customQueue && targetQueue.length === 0) {
      targetQueue = tracks.length > 0 ? tracks : [track];
    }

    let targetIndex = index;
    if (targetIndex === -1) {
      targetIndex = targetQueue.findIndex(t => t.id === track.id);
      if (targetIndex === -1) {
        targetQueue = [track, ...targetQueue];
        targetIndex = 0;
      }
    }

    setQueue(targetQueue);
    setCurrentQueueIndex(targetIndex);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Play full station queue handler
  const handlePlayStationQueue = (stationTracks, startIndex = 0) => {
    if (!stationTracks || stationTracks.length === 0) return;
    setQueue(stationTracks);
    setCurrentQueueIndex(startIndex);
    setCurrentTrack(stationTracks[startIndex]);
    setIsPlaying(true);
  };

  // Smart Autoplay: Fetch similar tracks given current song
  const handleFetchRecommendations = async (autoAdvance = false) => {
    if (!currentTrack || isLoadingRecommendations) return;
    setIsLoadingRecommendations(true);

    try {
      const excludeIds = queue.map(t => t.id).filter(Boolean).join(',');
      const titleParam = encodeURIComponent(currentTrack.title || '');
      const artistParam = encodeURIComponent(currentTrack.artist || '');
      const idParam = encodeURIComponent(currentTrack.id || '');

      const response = await axios.get(
        `/api/radio/recommendations?id=${idParam}&title=${titleParam}&artist=${artistParam}&exclude=${excludeIds}&limit=6`
      );

      if (response.data && response.data.recommendations && response.data.recommendations.length > 0) {
        const newTracks = response.data.recommendations;
        const updatedQueue = [...queue, ...newTracks];
        setQueue(updatedQueue);

        if (autoAdvance) {
          const nextIdx = currentQueueIndex + 1;
          if (nextIdx < updatedQueue.length) {
            setCurrentQueueIndex(nextIdx);
            setCurrentTrack(updatedQueue[nextIdx]);
            setIsPlaying(true);
          }
        }
      }
    } catch (err) {
      console.warn('DJ recommendation fetch warning:', err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Next Track in Queue (with DJ Autoplay fallback)
  const handleNextTrack = async () => {
    if (currentQueueIndex < queue.length - 1) {
      const nextIdx = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIdx);
      setCurrentTrack(queue[nextIdx]);
      setIsPlaying(true);
    } else if (isAutoplay && currentTrack) {
      await handleFetchRecommendations(true);
    } else if (queue.length > 0) {
      setCurrentQueueIndex(0);
      setCurrentTrack(queue[0]);
      setIsPlaying(true);
    }
  };

  // Previous Track in Queue
  const handlePrevTrack = () => {
    if (currentQueueIndex > 0) {
      const prevIdx = currentQueueIndex - 1;
      setCurrentQueueIndex(prevIdx);
      setCurrentTrack(queue[prevIdx]);
      setIsPlaying(true);
    }
  };

  // Queue actions
  const handlePlayTrackAtIndex = (index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentQueueIndex(index);
      setCurrentTrack(queue[index]);
      setIsPlaying(true);
    }
  };

  const handleRemoveTrackAtIndex = (index) => {
    const updated = queue.filter((_, i) => i !== index);
    setQueue(updated);
    if (index < currentQueueIndex) {
      setCurrentQueueIndex(currentQueueIndex - 1);
    }
  };

  const handleClearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setCurrentQueueIndex(0);
    } else {
      setQueue([]);
      setCurrentQueueIndex(0);
    }
  };

  const handleShuffleQueue = () => {
    const played = queue.slice(0, currentQueueIndex + 1);
    const upcoming = [...queue.slice(currentQueueIndex + 1)];
    for (let i = upcoming.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
    }
    setQueue([...played, ...upcoming]);
  };

  // Start Download handler
  const handleStartDownload = (track, bitrate = '320k') => {
    setDownloadingTrack(track);
    setDownloadBitrate(bitrate);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col justify-between pb-28">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenLegal={() => setIsLegalOpen(true)} 
        onOpenQr={() => setIsQrOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Tab 1: Search & Explore */}
        {activeTab === 'search' && (
          <div>
            <SearchSection 
              onSearch={handleSearch} 
              currentQuery={searchQuery}
              isLoading={isLoading} 
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              
              {/* Search Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Disc3 className="w-5 h-5 text-brand-neon animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Results for <span className="text-brand-300 capitalize">"{searchQuery}"</span></span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Showing {tracks.length} high-definition tracks with 320kbps MP3 downloads
                  </p>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-center gap-3 mb-8">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading Skeletons */}
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

              {/* Results Song Grid */}
              {!isLoading && tracks.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {tracks.map((track, i) => (
                    <SongCard
                      key={track.id}
                      track={track}
                      isCurrent={currentTrack?.id === track.id}
                      isPlaying={isPlaying}
                      onPlay={(t) => handlePlayTrack(t, tracks, i)}
                      onDownload={handleStartDownload}
                    />
                  ))}
                </div>
              )}

              {/* No Results Found */}
              {!isLoading && tracks.length === 0 && !error && (
                <div className="text-center py-16 glass-panel rounded-3xl border border-dark-border max-w-lg mx-auto">
                  <Headphones className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">No songs found</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Try searching for different keywords like "mhr songs", "malayalam rap", or an artist name.
                  </p>
                  <button
                    onClick={() => handleSearch('mhr malayalam rapper songs')}
                    className="px-4 py-2 rounded-xl glow-btn text-dark-bg font-bold text-xs"
                  >
                    Show MHR Songs
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Smart Mood Radio */}
        {activeTab === 'radio' && (
          <MoodRadioSection
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={(t) => handlePlayTrack(t)}
            onPlayStationQueue={handlePlayStationQueue}
            onDownloadTrack={handleStartDownload}
            isAutoplay={isAutoplay}
            onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
          />
        )}

        {/* Tab 3: Paste URL Downloader */}
        {activeTab === 'url' && (
          <UrlDownloader 
            onPlayTrack={(t) => handlePlayTrack(t)}
            onStartDownload={handleStartDownload}
          />
        )}

        {/* Tab 4: Trending & Featured */}
        {activeTab === 'trending' && (
          <div>
            <TrendingSection
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={(t) => handlePlayTrack(t)}
              onDownloadTrack={handleStartDownload}
              onSwitchQuery={(query) => {
                handleSearch(query);
                setActiveTab('search');
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {tracks.map((track, i) => (
                  <SongCard
                    key={track.id}
                    track={track}
                    isCurrent={currentTrack?.id === track.id}
                    isPlaying={isPlaying}
                    onPlay={(t) => handlePlayTrack(t, tracks, i)}
                    onDownload={handleStartDownload}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border/60 py-8 px-4 text-center text-xs text-slate-500 bg-dark-surface/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-brand-neon" />
            <span className="font-bold text-slate-300">SoundPulse MP3 Engine</span>
            <span>• Built for Malayalam & Global Music Discovery</span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsLegalOpen(true)} 
              className="hover:text-brand-300 flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal & Fair Use Policy</span>
            </button>
            <span>•</span>
            <span>Local Device Storage Direct Download</span>
          </div>
        </div>
      </footer>

      {/* Fixed Sticky Audio Player */}
      <AudioPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onDownload={handleStartDownload}
        onOpenLyrics={() => setIsLyricsOpen(!isLyricsOpen)}
        isLyricsOpen={isLyricsOpen}
        onTimeUpdate={(time) => setPlayerCurrentTime(time)}
        seekTarget={seekTarget}
        onOpenQueue={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
        isQueueOpen={isQueueDrawerOpen}
        queueCount={queue.length}
        isAutoplay={isAutoplay}
        onNeedMoreTracks={() => handleFetchRecommendations(false)}
        onClose={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
          setIsLyricsOpen(false);
          setIsQueueDrawerOpen(false);
        }}
      />

      {/* Smart Queue Drawer */}
      <DjQueueDrawer
        isOpen={isQueueDrawerOpen}
        onClose={() => setIsQueueDrawerOpen(false)}
        queue={queue}
        currentIndex={currentQueueIndex}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayTrackAtIndex={handlePlayTrackAtIndex}
        onRemoveTrackAtIndex={handleRemoveTrackAtIndex}
        onClearQueue={handleClearQueue}
        onShuffleQueue={handleShuffleQueue}
        isAutoplay={isAutoplay}
        onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
        onAddRecommendations={() => handleFetchRecommendations(false)}
        isLoadingRecommendations={isLoadingRecommendations}
      />

      {/* Karaoke Live Lyrics Modal */}
      {isLyricsOpen && currentTrack && (
        <LyricsModal
          track={currentTrack}
          currentTime={playerCurrentTime}
          isPlaying={isPlaying}
          onSeek={(time) => setSeekTarget({ time, ts: Date.now() })}
          onClose={() => setIsLyricsOpen(false)}
        />
      )}

      {/* 1-Scan Open on Phone QR Code Modal */}
      <MobileQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />

      {/* Download Progress & Confetti Modal */}
      <DownloadProgressModal
        downloadingTrack={downloadingTrack}
        bitrate={downloadBitrate}
        onClose={() => setDownloadingTrack(null)}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

    </div>
  );
}
