import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, Loader2, Music, Sparkles, X, FolderDown, AlertCircle, RefreshCw, Key } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getApiUrl } from '../api.js';

function getCleanId(track) {
  if (!track) return '';
  const str = typeof track === 'string' ? track : String(track.id || track.videoId || track.url || '');
  if (!str) return '';
  if (str.includes('v=')) return str.split('v=')[1]?.split('&')[0] || str;
  if (str.includes('youtu.be/')) return str.split('youtu.be/')[1]?.split('?')[0] || str;
  const parts = str.split('/');
  return parts[parts.length - 1] || str;
}

export default function DownloadProgressModal({ 
  downloadingTrack, 
  bitrate, 
  onClose 
}) {
  const [step, setStep] = useState(1); // 1: Preparing, 2: Transcoding MP3, 3: Saving to Device
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const startDownload = async () => {
    if (!downloadingTrack) return;

    setStep(1);
    setIsCompleted(false);
    setErrorMessage(null);

    const cleanId = getCleanId(downloadingTrack);
    const targetBitrate = bitrate || '320k';

    try {
      setStep(2);
      const downloadUrl = getApiUrl(`/api/download?id=${encodeURIComponent(cleanId)}&bitrate=${encodeURIComponent(targetBitrate)}`);

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        let errText = 'Download server error.';
        try {
          const errJson = await response.json();
          errText = errJson.error || errText;
        } catch (e) {
          errText = `HTTP Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errText);
      }

      setStep(3);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const filename = `${(downloadingTrack.title || 'song').replace(/[\\/:*?"<>|]/g, '')} - ${targetBitrate}.mp3`;

      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

      setIsCompleted(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f59b', '#06b6d4', '#34d399', '#ffffff']
        });
      } catch (err) {}

    } catch (err) {
      console.error('Download error:', err);
      setErrorMessage(err.message || 'Unable to download track at this time.');
    }
  };

  useEffect(() => {
    if (downloadingTrack) {
      startDownload();
    }
  }, [downloadingTrack, bitrate]);

  if (!downloadingTrack) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md glass-panel rounded-3xl border border-brand-500/40 p-6 sm:p-7 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thumbnail preview */}
        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border border-brand-500/30 mb-4 shadow-xl bg-dark-surface relative">
          <img
            src={downloadingTrack.thumbnail}
            alt={downloadingTrack.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {errorMessage ? (
              <AlertCircle className="w-8 h-8 text-rose-400" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-brand-neon" />
            ) : (
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            )}
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-white line-clamp-1 mb-1">
          {downloadingTrack.title}
        </h3>
        <p className="text-xs text-brand-300 font-medium mb-6">
          {downloadingTrack.artist || 'Unknown Artist'} • <span className="text-slate-300 font-bold">{bitrate || '320k'} MP3</span>
        </p>

        {/* Error State View */}
        {errorMessage ? (
          <div className="text-left mb-6 bg-red-950/30 rounded-2xl p-4 border border-red-500/30">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Download Notice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {errorMessage.includes("bot") || errorMessage.includes("Sign in") ? (
                <span>
                  YouTube requires authentication on cloud servers. Set <code className="bg-dark-bg px-1.5 py-0.5 rounded text-brand-300 font-mono text-[11px]">YOUTUBE_COOKIES</code> in your <strong>Render Dashboard</strong> environment variables to enable unlimited 320kbps downloads.
                </span>
              ) : (
                errorMessage
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startDownload}
                className="px-3 py-1.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Download</span>
              </button>
            </div>
          </div>
        ) : (
          /* Multi-step progress timeline */
          <div className="space-y-3 text-left mb-6 bg-dark-card/60 rounded-2xl p-4 border border-dark-border">
            <div className="flex items-center gap-3 text-xs">
              {step > 1 ? (
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
              )}
              <span className={step >= 1 ? 'text-white font-medium' : 'text-slate-500'}>
                1. Connecting to high-definition audio source
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {step > 2 ? (
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
              ) : step === 2 ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span className={step >= 2 ? 'text-white font-medium' : 'text-slate-500'}>
                2. Transcoding to {bitrate || '320kbps'} MP3 & ID3 tagging
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
              ) : step === 3 ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              )}
              <span className={isCompleted ? 'text-brand-300 font-bold' : 'text-slate-500'}>
                3. Saving MP3 file into your device's Downloads folder
              </span>
            </div>
          </div>
        )}

        {/* Status notification */}
        {isCompleted && (
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs text-brand-300 flex items-center justify-center gap-2 mb-4">
            <FolderDown className="w-4 h-4 text-brand-neon" />
            <span>Download completed! Saved to your device.</span>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-dark-border text-slate-300 hover:text-white font-bold text-xs transition-colors"
        >
          {isCompleted ? 'Done' : 'Close'}
        </button>

      </div>
    </div>
  );
}
