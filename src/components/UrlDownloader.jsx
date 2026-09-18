import React, { useState } from 'react';
import { 
  Link2, 
  ClipboardPaste, 
  Play, 
  Download, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Sparkles, 
  Layers, 
  Music,
  AlertCircle
} from 'lucide-react';
import axios from '../api.js';

export default function UrlDownloader({ onPlayTrack, onStartDownload }) {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackInfo, setTrackInfo] = useState(null);
  const [error, setError] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState('320k');

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrlInput(text);
          fetchUrlInfo(text);
        }
      }
    } catch (err) {
      console.warn('Clipboard access denied or unavailable:', err);
    }
  };

  const fetchUrlInfo = async (urlToFetch) => {
    const target = urlToFetch || urlInput;
    if (!target || !target.trim()) return;

    setIsLoading(true);
    setError(null);
    setTrackInfo(null);

    try {
      const response = await axios.post('/api/info', { url: target.trim() });
      if (response.data && response.data.track) {
        setTrackInfo(response.data.track);
      } else {
        setError('No metadata could be found for this URL.');
      }
    } catch (err) {
      console.error('Error parsing URL:', err);
      setError(err.response?.data?.error || 'Unable to retrieve track info from this URL. Please verify the link.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!trackInfo) return;
    onStartDownload(trackInfo, selectedBitrate);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Link2 className="w-3.5 h-3.5 text-brand-accent" />
          <span>Direct URL Converter & Inspector</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
          Paste Any Song or Music Video Link
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Copy any YouTube or music video link and paste it here to inspect title, artist, length, and download pristine MP3 audio to your device.
        </p>
      </div>

      {/* URL Input Box */}
      <div className="relative glass-panel rounded-2xl p-3 border border-dark-border mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Link2 className="w-5 h-5 text-brand-400 mr-2 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste link here (e.g. https://www.youtube.com/watch?v=...)"
              className="w-full py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm sm:text-base font-medium"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="text-xs text-slate-500 hover:text-slate-300 px-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="flex-1 sm:flex-none px-3.5 py-3 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-4 h-4 text-brand-400" />
              <span>Paste</span>
            </button>

            <button
              type="button"
              onClick={() => fetchUrlInfo()}
              disabled={isLoading || !urlInput.trim()}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl glow-btn text-dark-bg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Inspect Song</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to process URL</p>
            <p className="text-xs text-red-300/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Song Details Showcase Card */}
      {trackInfo && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-brand-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-neon uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Song Identified Successfully</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Thumbnail */}
            <div className="md:col-span-5 relative group rounded-2xl overflow-hidden shadow-2xl border border-dark-border aspect-video md:aspect-square bg-dark-surface">
              <img
                src={trackInfo.thumbnail}
                alt={trackInfo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="px-2.5 py-1 rounded-md bg-dark-bg/90 text-slate-200 text-xs font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  {trackInfo.durationFormatted}
                </span>
              </div>
            </div>

            {/* Song Meta & Controls */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug line-clamp-2">
                  {trackInfo.title}
                </h3>
                
                <p className="text-brand-300 font-semibold text-base mb-4 flex items-center gap-2">
                  <Music className="w-4 h-4 text-brand-400" />
                  <span>{trackInfo.artist || trackInfo.channel}</span>
                </p>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-xs text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trackInfo.viewsFormatted} views</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-dark-card border border-dark-border text-xs text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: {trackInfo.durationFormatted}</span>
                  </div>
                </div>

                {/* Quality / Bitrate Selector */}
                <div className="mb-6 p-4 rounded-2xl bg-dark-card/70 border border-dark-border">
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-neon" />
                    <span>Select Audio Quality (Bitrate):</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { rate: '320k', label: '320 kbps', sub: 'Studio MP3' },
                      { rate: '192k', label: '192 kbps', sub: 'High Quality' },
                      { rate: '128k', label: '128 kbps', sub: 'Standard' }
                    ].map((item) => (
                      <button
                        key={item.rate}
                        type="button"
                        onClick={() => setSelectedBitrate(item.rate)}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          selectedBitrate === item.rate
                            ? 'bg-brand-500/20 border-brand-neon text-brand-300 font-bold shadow-sm'
                            : 'bg-dark-surface/60 border-dark-border text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                        <div className="text-[10px] opacity-75">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onPlayTrack(trackInfo)}
                  className="flex-1 py-3 px-4 rounded-xl bg-dark-surface hover:bg-dark-hover border border-brand-500/40 text-brand-300 font-bold text-sm flex items-center justify-center gap-2 hover:border-brand-neon transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Preview</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 rounded-xl glow-btn text-dark-bg font-extrabold text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download {selectedBitrate} MP3</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

