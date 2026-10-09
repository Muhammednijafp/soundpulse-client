import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sparkles, 
  Sliders, 
  Volume2, 
  Play, 
  Pause, 
  Disc3, 
  Flame, 
  Layers, 
  Music, 
  Zap, 
  RotateCcw, 
  Download,
  ArrowRight,
  Maximize2
} from 'lucide-react';

const EQ_PRESETS = {
  flat: { name: 'Flat Studio Reference', values: [0, 0, 0, 0, 0] },
  bass: { name: '🚀 Bass Beast (808s & Rap)', values: [8, 5, -1, 2, 4] },
  vocal: { name: '🎙️ Crisp Vocals & Lyrics', values: [-2, 1, 6, 4, 3] },
  club: { name: '⚡ Club & EDM Pump', values: [7, 3, -2, 5, 6] },
  acoustic: { name: '🎸 Acoustic & Melody', values: [2, 3, 2, 4, 5] },
};

const SAMPLE_TRACKS = [
  { id: '1', title: 'MHR - Malayalam Rap Anthem', artist: 'MHR', query: 'mhr malayalam rapper songs' },
  { id: '2', title: 'Dabzee - Manavalan Thug', artist: 'Dabzee', query: 'dabzee joker malayalam songs' },
  { id: '3', title: 'Hanumankind - Big Dawgs', artist: 'Hanumankind', query: 'hanumankind rap songs' },
  { id: '4', title: 'Sushin Shyam - Aavesham Theme', artist: 'Sushin Shyam', query: 'sushin shyam aavesham songs' }
];

export default function SoundStudioLab({ currentTrack, isPlaying, onPlayTrack, onSearchAndPlay, onStartDownload }) {
  const canvasRef = useRef(null);
  const [visualMode, setVisualMode] = useState('quantum'); // 'quantum', 'galaxy', 'spectrum', 'vortex'
  const [theme, setTheme] = useState('neon'); // 'neon', 'cyber', 'sunset', 'aurora'
  const [eqValues, setEqValues] = useState([4, 2, 0, 3, 5]); // 60Hz, 250Hz, 1kHz, 4kHz, 14kHz
  const [activePreset, setActivePreset] = useState('bass');
  const [sensitivity, setSensitivity] = useState(1.4);
  const [particleDensity, setParticleDensity] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Color definitions
    const getColors = () => {
      if (theme === 'cyber') return { p: '#00f0ff', s: '#ff007f', a: '#ffe600' };
      if (theme === 'sunset') return { p: '#ff4b2b', s: '#ff416c', a: '#fbc531' };
      if (theme === 'aurora') return { p: '#10b981', s: '#6366f1', a: '#ec4899' };
      return { p: '#00f59b', s: '#06b6d4', a: '#8b5cf6' };
    };

    const render = () => {
      time += 0.025;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;

      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;
      const mouseX = (mousePos.current.x - 0.5) * 80;
      const mouseY = (mousePos.current.y - 0.5) * 50;

      ctx.clearRect(0, 0, w, h);

      const colors = getColors();
      const bassBoost = (eqValues[0] + 12) / 24; // 0 to 1
      const trebleBoost = (eqValues[4] + 12) / 24;
      const activeFactor = isPlaying ? 1.8 : 1.0;
      const intensity = sensitivity * activeFactor * (0.8 + bassBoost * 0.6);

      if (visualMode === 'quantum') {
        // Multi-layered undulating 3D sine fields
        const waves = 7;
        const resolution = 80;

        for (let i = 0; i < waves; i++) {
          ctx.beginPath();
          const alpha = 0.15 + (i / waves) * 0.7;
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.5, i % 2 === 0 ? colors.p : colors.s);
          grad.addColorStop(1, 'transparent');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8 + i * 0.6;

          for (let p = 0; p <= resolution; p++) {
            const normX = p / resolution;
            const x = normX * w;
            const sine1 = Math.sin(normX * (6 + i) + time * 2.2 + i * 0.5) * (30 * intensity);
            const sine2 = Math.cos(normX * (14 - i) - time * 1.8) * (18 * intensity * trebleBoost);
            const windowCurve = Math.sin(normX * Math.PI); // tapering envelope
            const y = cy + mouseY + (sine1 + sine2) * windowCurve + (i - waves / 2) * 20;

            if (p === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Particle sparks
        for (let pt = 0; pt < particleDensity; pt++) {
          const ptTime = time * 0.5 + pt * 0.2;
          const ptX = (Math.sin(ptTime * 0.8 + pt) * 0.45 + 0.5) * w + mouseX * 0.5;
          const ptY = (Math.cos(ptTime * 1.2 + pt * 2) * 0.35 + 0.5) * h + mouseY * 0.5;
          const ptSize = (Math.sin(ptTime * 2 + pt) * 1.5 + 2);

          ctx.beginPath();
          ctx.arc(ptX, ptY, Math.max(1, ptSize), 0, Math.PI * 2);
          ctx.fillStyle = (pt % 3 === 0 ? colors.a : colors.p) + 'bb';
          ctx.fill();
        }

      } else if (visualMode === 'galaxy') {
        // Orbiting 3D Particle Galaxy
        for (let i = 0; i < particleDensity; i++) {
          const angle = (i / particleDensity) * Math.PI * 2 + time * 0.3;
          const dist = 50 + (i * 2.2) * (1 + Math.sin(time * 2 + i) * 0.1 * bassBoost);
          
          const px = cx + Math.cos(angle) * dist + mouseX;
          const py = cy + Math.sin(angle) * (dist * 0.45) + mouseY;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? colors.p : colors.s;
          ctx.shadowColor = colors.p;
          ctx.shadowBlur = isPlaying ? 10 : 4;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Center Pulse Core
        const coreGrad = ctx.createRadialGradient(cx + mouseX, cy + mouseY, 0, cx + mouseX, cy + mouseY, 70 * intensity);
        coreGrad.addColorStop(0, colors.p + 'aa');
        coreGrad.addColorStop(0.6, colors.s + '33');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx + mouseX, cy + mouseY, 70 * intensity, 0, Math.PI * 2);
        ctx.fill();

      } else if (visualMode === 'spectrum') {
        // 64-band Precision Spectrum
        const bands = 64;
        const bWidth = (w * 0.85) / bands;
        const startX = (w - (bands * bWidth)) / 2;

        for (let i = 0; i < bands; i++) {
          const norm = i / bands;
          const freqBand = Math.floor(norm * 5); // map to 5-band EQ
          const eqGain = (eqValues[Math.min(4, freqBand)] + 12) / 24;

          const h1 = Math.sin(norm * 8 + time * 3) * 0.5 + 0.5;
          const h2 = Math.cos(norm * 16 - time * 2) * 0.3 + 0.3;
          const barH = (h1 * 90 + h2 * 60 + 15) * intensity * (0.5 + eqGain);

          const bx = startX + i * bWidth + mouseX * 0.2;
          const by = cy + mouseY;

          const grad = ctx.createLinearGradient(bx, by - barH, bx, by + barH);
          grad.addColorStop(0, colors.p);
          grad.addColorStop(0.5, colors.s);
          grad.addColorStop(1, colors.a);

          ctx.fillStyle = grad;
          ctx.fillRect(bx, by - barH / 2, bWidth - 2.5, barH);
        }

      } else if (visualMode === 'vortex') {
        // 3D Cyber Vortex Rings
        const rings = 12;
        for (let r = 0; r < rings; r++) {
          const rRadius = (20 + r * 22) * (1 + Math.sin(time + r * 0.5) * 0.15 * intensity);
          const rRot = time * (r % 2 === 0 ? 0.4 : -0.4);

          ctx.beginPath();
          ctx.ellipse(cx + mouseX * (1 - r / rings), cy + mouseY * (1 - r / rings), rRadius, rRadius * 0.55, rRot, 0, Math.PI * 2);
          ctx.strokeStyle = (r % 2 === 0 ? colors.p : colors.s) + Math.floor((0.15 + (1 - r / rings) * 0.8) * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [visualMode, theme, eqValues, sensitivity, particleDensity, isPlaying]);

  const handleApplyPreset = (presetKey) => {
    setActivePreset(presetKey);
    setEqValues([...EQ_PRESETS[presetKey].values]);
  };

  const handleSliderChange = (index, value) => {
    const updated = [...eqValues];
    updated[index] = Number(value);
    setEqValues(updated);
    setActivePreset('custom');
  };

  const EQ_BANDS = [
    { label: '60 Hz', desc: 'Sub-Bass', index: 0 },
    { label: '250 Hz', desc: 'Punch & Warmth', index: 1 },
    { label: '1 kHz', desc: 'Vocals & Mid', index: 2 },
    { label: '4 kHz', desc: 'Presence', index: 3 },
    { label: '14 kHz', desc: 'Air & Treble', index: 4 }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Studio Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Activity className="w-3.5 h-3.5 text-brand-neon" />
          <span>3D Acoustic Engine & Equalizer Lab</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          SoundPulse <span className="bg-gradient-to-r from-brand-neon via-brand-300 to-cyan-400 bg-clip-text text-transparent">3D Sound Studio</span>
        </h2>
        
        <p className="text-sm sm:text-base text-slate-300">
          Manipulate real-time spatial waveforms, sculpt frequency dynamics with 5-band studio equalization, and visualize acoustic resonance in ultra-high frame rates.
        </p>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Left / Center 8 Cols: Interactive 3D Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="relative rounded-3xl overflow-hidden border border-brand-500/30 glass-panel shadow-2xl">
            
            {/* 3D Visualizer Canvas */}
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => {
                const rect = canvasRef.current.getBoundingClientRect();
                mousePos.current.targetX = (e.clientX - rect.left) / rect.width;
                mousePos.current.targetY = (e.clientY - rect.top) / rect.height;
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                mousePos.current.targetX = 0.5;
                mousePos.current.targetY = 0.5;
              }}
              className="w-full h-80 sm:h-[420px] block cursor-crosshair bg-dark-bg/90"
            />

            {/* Canvas Overlay Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg/85 backdrop-blur-md border border-brand-500/30 text-xs font-bold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
                <span>3D Visualizer: {visualMode.toUpperCase()}</span>
              </div>

              {/* Mode Controls */}
              <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-dark-bg/85 backdrop-blur-md border border-dark-border">
                {['quantum', 'galaxy', 'spectrum', 'vortex'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVisualMode(mode)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                      visualMode === mode
                        ? 'bg-brand-500 text-dark-bg shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-dark-card'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Color Scheme & Micro Controls */}
            <div className="bg-dark-surface/90 border-t border-dark-border/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <span className="text-slate-400 font-medium">Theme:</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'neon', name: 'Emerald Neon', color: 'bg-emerald-400' },
                    { id: 'cyber', name: 'Cyberpunk', color: 'bg-cyan-400' },
                    { id: 'sunset', name: 'Solar Sunset', color: 'bg-rose-500' },
                    { id: 'aurora', name: 'Deep Aurora', color: 'bg-indigo-400' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
                        theme === t.id
                          ? 'border-brand-neon bg-brand-500/20 text-brand-300'
                          : 'border-dark-border text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${t.color}`} />
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Sensitivity:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                    className="w-20 h-1.5 bg-dark-card rounded-lg appearance-none cursor-pointer accent-brand-neon"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Quick Audition Sample Tracks */}
          <div className="glass-panel rounded-2xl p-5 border border-dark-border/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Audition Test Tracks</span>
              </span>
              <span className="text-[11px] text-slate-400">Click any track to test live visual resonance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {SAMPLE_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSearchAndPlay(t.query)}
                  className="p-3 rounded-xl bg-dark-card hover:bg-brand-500/10 border border-dark-border hover:border-brand-500/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div className="font-bold text-xs text-white group-hover:text-brand-300 line-clamp-1 mb-1">
                    {t.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{t.artist}</span>
                    <Play className="w-3 h-3 text-brand-neon group-hover:scale-125 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: 5-Band Equalizer Simulator */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="glass-panel rounded-3xl p-6 border border-brand-500/30 flex-1 flex flex-col justify-between">
            <div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-neon" />
                  <h3 className="font-bold text-base text-white">5-Band Studio EQ</h3>
                </div>
                <button
                  onClick={() => handleApplyPreset('flat')}
                  className="p-1.5 rounded-lg bg-dark-surface hover:bg-dark-hover text-slate-400 hover:text-slate-200 transition-colors"
                  title="Reset to Flat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Preset Selector */}
              <div className="mb-6">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  EQ Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(EQ_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => handleApplyPreset(key)}
                      className={`p-2 rounded-xl text-left text-xs font-semibold transition-all ${
                        activePreset === key
                          ? 'bg-brand-500 text-dark-bg font-bold shadow-md'
                          : 'bg-dark-card hover:bg-dark-hover text-slate-300 border border-dark-border'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vertical Slider Faders */}
              <div className="bg-dark-bg/80 rounded-2xl p-5 border border-dark-border/80 mb-6">
                <div className="flex items-center justify-between gap-3 h-48">
                  {EQ_BANDS.map((band) => (
                    <div key={band.index} className="flex-1 flex flex-col items-center justify-between h-full">
                      <span className="text-[11px] font-mono font-bold text-brand-300">
                        {eqValues[band.index] > 0 ? `+${eqValues[band.index]}` : eqValues[band.index]}dB
                      </span>

                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={eqValues[band.index]}
                        onChange={(e) => handleSliderChange(band.index, e.target.value)}
                        className="h-28 w-2 bg-dark-card rounded-lg appearance-none cursor-pointer accent-brand-neon [writing-mode:bt-lr] [-webkit-appearance:slider-vertical]"
                      />

                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-200">{band.label}</div>
                        <div className="text-[9px] text-slate-500">{band.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Download in 320k Studio MP3 CTA */}
            <div className="p-4 rounded-2xl bg-brand-950/30 border border-brand-500/30">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-brand-neon">
                <Zap className="w-4 h-4" />
                <span>Lossless 320k Direct Audio Stream</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3">
                All songs previewed with these dynamics are exported directly in 320kbps CBR MP3.
              </p>
              <button
                onClick={() => onSearchAndPlay('mhr malayalam rapper songs')}
                className="w-full py-2.5 rounded-xl glow-btn text-dark-bg font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Search & Download Songs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

