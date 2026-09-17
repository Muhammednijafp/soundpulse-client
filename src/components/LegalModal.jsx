import React from 'react';
import { ShieldCheck, Scale, AlertTriangle, CheckCircle2, Heart, X, ExternalLink } from 'lucide-react';

export default function LegalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel rounded-3xl border border-brand-500/40 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-dark-card hover:bg-dark-hover border border-dark-border text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
            <Scale className="w-6 h-6 text-brand-neon" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Legal, Fair Use & Compliance Policy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Understanding copyright, personal tool architecture, and artist rights
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-sm text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <h3 className="text-brand-300 font-bold flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-neon" />
              Is SoundPulse Legal & Permissible?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              <strong>Yes.</strong> This software is an open-source format-shifting and audio indexer designed for personal usage, educational research, Creative Commons music discovery, and offline backup of permissible content — following the same architectural standards as widely accepted open tools like <em>yt-dlp</em>, <em>VLC Media Player</em>, <em>Seal</em>, and <em>NewPipe</em>.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              1. Personal Offline Use & Fair Use
            </h4>
            <p className="text-xs text-slate-400">
              Under international copyright treaties and Fair Use provisions (such as 17 U.S.C. § 107 and Section 52 of the Indian Copyright Act), creating personal copies of publicly accessible media for private study, critique, or personal non-commercial offline consumption is recognized.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              2. Commercial Restrictions & Redistribution
            </h4>
            <p className="text-xs text-slate-400">
              Users are strictly prohibited from redistributing, selling, or commercially broadcasting downloaded audio files without acquiring appropriate synchronization, mechanical, or master licenses from the respective rights holders and record labels.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              3. Support the Artists (MHR, Indie & Global Creators)
            </h4>
            <p className="text-xs text-slate-400">
              We strongly encourage music fans to support independent artists and record labels by purchasing official merch, attending concerts, and streaming through licensed services like Spotify, Apple Music, and YouTube Music.
            </p>
          </div>

        </div>

        {/* Footer Button */}
        <div className="mt-8 pt-4 border-t border-dark-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl glow-btn text-dark-bg font-bold text-sm"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}

