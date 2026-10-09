import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Zap, 
  Headphones, 
  Download, 
  Radio, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  Cpu, 
  Flame, 
  Layers, 
  Sparkles,
  ArrowRight,
  Disc3,
  Sliders,
  CheckCircle2,
  XCircle,
  Globe2
} from 'lucide-react';

const METRICS_DATA = [
  {
    id: 'streams',
    label: 'Total Tracks Streamed',
    count: 1482920,
    formatted: '1.48M+',
    subtext: 'High-definition live audio streams across mobile & desktop',
    icon: Headphones,
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'downloads',
    label: 'Lossless 320k Downloads',
    count: 854310,
    formatted: '854K+',
    subtext: 'Direct-to-storage MP3 conversions saved offline',
    icon: Download,
    color: 'from-brand-neon to-brand-500'
  },
  {
    id: 'latency',
    label: 'Average Stream Latency',
    count: 38,
    formatted: '< 38ms',
    subtext: 'Instant audio buffer initiation with zero pre-roll ads',
    icon: Zap,
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'fidelity',
    label: 'Audio Fidelity Score',
    count: 99.98,
    formatted: '99.98%',
    subtext: 'Full 22.05kHz Nyquist dynamic spectrum preservation',
    icon: ShieldCheck,
    color: 'from-violet-400 to-purple-500'
  },
  {
    id: 'countries',
    label: 'Global Listener Regions',
    count: 142,
    formatted: '142+',
    subtext: 'Listeners across Kerala, GCC, UK, US, Malaysia & worldwide',
    icon: Globe2,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'artists',
    label: 'Artists & Rappers Featured',
    count: 14250,
    formatted: '14.2K+',
    subtext: 'Empowering independent hip-hop & indie artists globally',
    icon: Flame,
    color: 'from-rose-400 to-pink-500'
  }
];

const GENRE_DISTRIBUTION = [
  { name: 'Malayalam Rap & Hip-Hop', percentage: 38, color: 'bg-emerald-400', count: '563,000+ plays' },
  { name: 'Indie Melody & Film Scores', percentage: 26, color: 'bg-cyan-400', count: '385,000+ plays' },
  { name: 'Lofi Beats & Chillout', percentage: 18, color: 'bg-purple-400', count: '266,000+ plays' },
  { name: 'Global Hits & Pop Charts', percentage: 18, color: 'bg-amber-400', count: '266,000+ plays' }
];

export default function PlatformMetricsSection({ onExploreTracks, onOpenStudio, onStartRadio }) {
  const [activeBitrateTab, setActiveBitrateTab] = useState('320k');
  const [comparisonSlider, setComparisonSlider] = useState(75); // 0 = 128k, 100 = 320k
  const [animatedCounts, setAnimatedCounts] = useState({
    streams: 0,
    downloads: 0,
    latency: 0,
    fidelity: 0,
    countries: 0,
    artists: 0
  });

  const sectionRef = useRef(null);

  // GSAP Counter Animation
  useEffect(() => {
    let startTime = null;
    const duration = 2000; // ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedCounts({
        streams: Math.floor(1482920 * ease),
        downloads: Math.floor(854310 * ease),
        latency: Math.floor(38 * ease),
        fidelity: (99.98 * ease).toFixed(2),
        countries: Math.floor(142 * ease),
        artists: Math.floor(14250 * ease)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div ref={sectionRef} className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
          <BarChart3 className="w-3.5 h-3.5 text-brand-neon" />
          <span>SoundPulse Real-Time Intelligence & Metrics</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Built for Pure <span className="bg-gradient-to-r from-brand-neon to-cyan-400 bg-clip-text text-transparent">Audio Performance</span> & Scale
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300">
          Discover how SoundPulse delivers ultra-low-latency streaming, studio-grade 320kbps MP3 encoding, and instant lossless conversion for millions of audio lovers worldwide.
        </p>
      </div>

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {METRICS_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className="glass-card rounded-2xl p-6 border border-white/10 hover:border-brand-500/40 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} p-0.5 flex items-center justify-center shadow-lg shadow-brand-500/20`}>
                  <div className="w-full h-full bg-dark-bg/80 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wider">
                  Live Metric
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1 font-mono">
                {item.id === 'fidelity' ? `${animatedCounts.fidelity}%` : 
                 item.id === 'latency' ? `< ${animatedCounts.latency}ms` :
                 item.id === 'countries' ? `${animatedCounts.countries}+` :
                 `${animatedCounts[item.id].toLocaleString()}+`}
              </div>

              <div className="text-sm font-bold text-slate-200 mb-1.5">{item.label}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.subtext}</p>

              {/* Ambient Glow */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Interactive Audio Fidelity Comparison Lab */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-brand-500/30 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5 text-brand-neon" />
            <span>Acoustic Fidelity Benchmark Lab</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Why 320kbps MP3s Sound Substantially Better
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Standard web streams compress audio down to 128kbps, cutting off high frequencies above 16kHz and smearing bass transients. SoundPulse encodes in true 320kbps CBR for pristine studio acoustic depth.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="bg-dark-bg/80 rounded-2xl p-6 border border-dark-border/80 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Interactive Audio Quality Inspector:</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-neon">
                {comparisonSlider > 50 ? '320kbps Studio Master' : '128kbps Standard Web Stream'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Drag slider to inspect frequency response</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={comparisonSlider}
            onChange={(e) => setComparisonSlider(Number(e.target.value))}
            className="w-full h-2.5 bg-dark-card rounded-lg appearance-none cursor-pointer accent-brand-neon mb-6"
          />

          {/* Live Frequency Response Graphic */}
          <div className="h-28 sm:h-36 bg-dark-surface/90 rounded-xl p-4 relative flex items-end justify-between gap-1 overflow-hidden border border-white/5">
            {Array.from({ length: 40 }).map((_, i) => {
              const freqHz = Math.floor(20 * Math.pow(1000, i / 39));
              const isHighFreq = i > 26; // Above 16kHz
              const isCutoff = comparisonSlider < 50 && isHighFreq;
              
              const baseHeight = Math.sin((i / 40) * Math.PI) * 75 + 20;
              const actualHeight = isCutoff ? baseHeight * 0.15 : baseHeight * (comparisonSlider > 50 ? 1 : 0.65);

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${actualHeight}%` }}
                    className={`w-full rounded-t-sm transition-all duration-200 ${
                      isCutoff
                        ? 'bg-rose-500/40'
                        : comparisonSlider > 50
                        ? 'bg-gradient-to-t from-brand-600 to-brand-neon'
                        : 'bg-slate-600'
                    }`}
                  />
                </div>
              );
            })}

            {/* Frequency Labels */}
            <div className="absolute top-2 left-4 text-[10px] font-mono text-slate-400">
              20Hz (Sub-Bass)
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-400">
              1kHz (Vocal Presence)
            </div>
            <div className="absolute top-2 right-4 text-[10px] font-mono text-slate-400">
              22.05kHz (Studio Air)
            </div>
          </div>
        </div>

        {/* 128k vs 320k Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 128kbps Standard Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            comparisonSlider <= 50 ? 'border-amber-500/60 bg-amber-950/10' : 'border-dark-border bg-dark-card/50 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-slate-200">128 kbps Standard</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">~2.8 MB / Track</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400 mb-4">
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Harsh cutoff at 16,000 Hz losing high-end sparkle</span>
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Phase smearing on rapid kick & 808 bass transients</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Small file size suitable for very low data bandwidth</span>
              </li>
            </ul>
          </div>

          {/* 320kbps Studio Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            comparisonSlider > 50 ? 'border-brand-neon bg-brand-950/20 shadow-xl shadow-brand-500/10' : 'border-dark-border bg-dark-card/50 opacity-70'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">320 kbps Studio Master</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-neon font-bold border border-brand-500/30">
                  SoundPulse Default
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono font-bold">~8.5 MB / Track</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Full 22,050 Hz Nyquist audio spectrum preservation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Punchy, uncompressed 808 bass kicks & crisp hi-hat transients</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-neon shrink-0" />
                <span>Studio reference quality for headphones, car audio, and monitors</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Genre Distribution & Platform Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        {/* Genre Breakdown */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-dark-border/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-brand-neon animate-spin" style={{ animationDuration: '8s' }} />
                <span>Community Genre Streaming Share</span>
              </h4>
              <p className="text-xs text-slate-400">Top listened categories on SoundPulse</p>
            </div>
          </div>

          <div className="space-y-5">
            {GENRE_DISTRIBUTION.map((g, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>{g.name}</span>
                  <span className="font-mono text-brand-300">{g.percentage}% ({g.count})</span>
                </div>
                <div className="h-3 w-full bg-dark-bg rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    style={{ width: `${g.percentage}%` }}
                    className={`h-full ${g.color} rounded-full transition-all duration-1000`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Performance Pipeline Specs */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-dark-border/80 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>High-Performance Pipeline Architecture</span>
            </h4>
            <p className="text-xs text-slate-400 mb-6">How SoundPulse delivers zero-lag audio</p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-card/60 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center shrink-0 text-brand-neon font-mono font-bold text-xs">
                  01
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Direct Stream-Pipe Proxy</h5>
                  <p className="text-[11px] text-slate-400">Bypasses server storage writes and streams directly to browser audio element.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-card/60 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold text-xs">
                  02
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">FFmpeg 6.0 Studio Transcoder</h5>
                  <p className="text-[11px] text-slate-400">High-speed dual-threaded constant bitrate 320k libmp3lame with ID3 tag injection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-card/60 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400 font-mono font-bold text-xs">
                  03
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Client-Side Karaoke LRC Engine</h5>
                  <p className="text-[11px] text-slate-400">Sub-millisecond timestamp synchronization with auto-scroll and lyrics translation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-dark-border/60 flex items-center justify-between mt-6">
            <span className="text-xs text-slate-400 font-medium">Ready to experience it live?</span>
            <button
              onClick={onExploreTracks}
              className="px-4 py-2 rounded-xl glow-btn text-dark-bg font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <span>Explore Songs Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Conversion Banner CTA */}
      <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-brand-950 via-dark-card to-dark-bg border border-brand-500/40 text-center relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-neon text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 1.4 Million+ Audio Explorers</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Start Streaming & Downloading in 320kbps Today
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-300 mb-6">
            No registration required. No intrusive advertisements. Just instant high-fidelity audio discovery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreTracks}
              className="px-6 py-3 rounded-xl glow-btn text-dark-bg font-extrabold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Headphones className="w-4 h-4" />
              <span>Browse 100k+ Tracks</span>
            </button>

            <button
              onClick={onStartRadio}
              className="px-5 py-3 rounded-xl bg-dark-surface hover:bg-dark-hover border border-brand-500/40 text-brand-300 hover:text-white font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Radio className="w-4 h-4 text-brand-neon" />
              <span>Tune into 8 Mood Radios</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

