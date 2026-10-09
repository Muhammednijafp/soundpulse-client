import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Play, Pause, Activity, Zap, Compass, Disc3, Music, Volume2, ShieldCheck, Flame } from 'lucide-react';

export default function AudioVisualizerHero({ 
  currentTrack, 
  isPlaying, 
  onPlaySample, 
  onExploreClick, 
  onLaunchStudioClick 
}) {
  const canvasRef = useRef(null);
  const [visualMode, setVisualMode] = useState('quantum'); // 'quantum', 'galaxy', 'spectrum', 'vortex'
  const [colorScheme, setColorScheme] = useState('neon'); // 'neon', 'cyber', 'sunset', 'aurora'
  const [isHovered, setIsHovered] = useState(false);
  const [sensitivity, setSensitivity] = useState(1.2);
  const mousePos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const pulseRipples = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle pool for Galaxy & Quantum modes
    const particleCount = 120;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      radius: 40 + Math.random() * 160,
      baseRadius: 40 + Math.random() * 160,
      size: 1.5 + Math.random() * 3,
      speed: 0.005 + Math.random() * 0.012,
      offset: Math.random() * Math.PI * 2,
      z: Math.random() * 200 - 100,
      alpha: 0.3 + Math.random() * 0.7
    }));

    const render = () => {
      time += 0.02;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;
      const mouseOffsetX = (mousePos.current.x - 0.5) * 60;
      const mouseOffsetY = (mousePos.current.y - 0.5) * 40;

      // Clear with dark trail
      ctx.clearRect(0, 0, width, height);

      // Color paletting
      let primaryColor = '#00f59b';
      let secondaryColor = '#06b6d4';
      let accentColor = '#8b5cf6';

      if (colorScheme === 'cyber') {
        primaryColor = '#00f0ff';
        secondaryColor = '#ff0055';
        accentColor = '#ffe600';
      } else if (colorScheme === 'sunset') {
        primaryColor = '#ff5e62';
        secondaryColor = '#ff9966';
        accentColor = '#ff007f';
      } else if (colorScheme === 'aurora') {
        primaryColor = '#10b981';
        secondaryColor = '#6366f1';
        accentColor = '#ec4899';
      }

      const activeMultiplier = isPlaying ? 1.6 : (isHovered ? 1.2 : 0.8);
      const intensity = sensitivity * activeMultiplier;

      // 1. Draw Shockwave Ripples
      pulseRipples.current = pulseRipples.current.filter(ripple => {
        ripple.radius += 3.5;
        ripple.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 245, 155, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        return ripple.alpha > 0.02;
      });

      // 2. Render Selected Mode
      if (visualMode === 'quantum') {
        // Quantum 3D Sine Waveform Grid
        const waveCount = 5;
        const points = 60;

        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const wAlpha = 0.2 + (w / waveCount) * 0.6;
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, primaryColor + '00');
          gradient.addColorStop(0.5, (w % 2 === 0 ? primaryColor : secondaryColor) + Math.floor(wAlpha * 255).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, accentColor + '00');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5 + (w * 0.8);

          for (let p = 0; p <= points; p++) {
            const x = (p / points) * width;
            const progress = (p / points);
            const freq1 = Math.sin(progress * 8 + time * 2 + w) * 25 * intensity;
            const freq2 = Math.cos(progress * 14 - time * 1.5 + w * 0.5) * 15 * intensity;
            const freq3 = Math.sin(progress * 4 + time + mousePos.current.x * 3) * 20;
            const envelope = Math.sin(progress * Math.PI); // Windowing curve
            const y = centerY + mouseOffsetY + (freq1 + freq2 + freq3) * envelope + (w - waveCount / 2) * 22;

            if (p === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Floating ambient particles along wave
        particles.slice(0, 40).forEach(pt => {
          pt.angle += pt.speed * activeMultiplier;
          const x = centerX + Math.cos(pt.angle + pt.offset) * (width * 0.4) + mouseOffsetX;
          const y = centerY + Math.sin(pt.angle * 2 + time) * 45 * intensity + mouseOffsetY;
          
          ctx.beginPath();
          ctx.arc(x, y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = primaryColor + 'cc';
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

      } else if (visualMode === 'galaxy') {
        // Cosmic 3D Particle Galaxy
        particles.forEach(pt => {
          pt.angle += pt.speed * activeMultiplier;
          const dynamicRadius = pt.baseRadius * (1 + Math.sin(time * 2 + pt.offset) * 0.15 * intensity);
          
          // 3D projection
          const rotX = Math.cos(pt.angle) * dynamicRadius;
          const rotY = Math.sin(pt.angle) * dynamicRadius * 0.45; // Elliptical perspective
          
          const projX = centerX + rotX + mouseOffsetX;
          const projY = centerY + rotY + mouseOffsetY;

          ctx.beginPath();
          ctx.arc(projX, projY, pt.size * (isPlaying ? 1.3 : 1), 0, Math.PI * 2);
          ctx.fillStyle = (pt.radius > 110 ? secondaryColor : primaryColor) + Math.floor(pt.alpha * 220).toString(16).padStart(2, '0');
          ctx.shadowColor = primaryColor;
          ctx.shadowBlur = isPlaying ? 12 : 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Glowing Core Orb
        const coreGradient = ctx.createRadialGradient(
          centerX + mouseOffsetX, centerY + mouseOffsetY, 2,
          centerX + mouseOffsetX, centerY + mouseOffsetY, 50 * intensity
        );
        coreGradient.addColorStop(0, primaryColor + 'cc');
        coreGradient.addColorStop(0.5, secondaryColor + '44');
        coreGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX + mouseOffsetX, centerY + mouseOffsetY, 60 * intensity, 0, Math.PI * 2);
        ctx.fill();

      } else if (visualMode === 'spectrum') {
        // High-Definition Studio Spectrum Bars
        const barCount = 48;
        const barWidth = (width * 0.75) / barCount;
        const startX = (width - (barCount * barWidth)) / 2;

        for (let i = 0; i < barCount; i++) {
          const normIdx = i / barCount;
          const beat1 = Math.sin(normIdx * 6 + time * 3) * 0.5 + 0.5;
          const beat2 = Math.cos(normIdx * 12 - time * 2) * 0.3 + 0.3;
          const barHeight = (beat1 * 80 + beat2 * 50 + 10) * intensity;

          const x = startX + i * barWidth + mouseOffsetX * 0.3;
          const y = centerY + mouseOffsetY;

          const grad = ctx.createLinearGradient(x, y - barHeight, x, y + barHeight);
          grad.addColorStop(0, primaryColor);
          grad.addColorStop(0.5, secondaryColor);
          grad.addColorStop(1, accentColor);

          ctx.fillStyle = grad;
          ctx.fillRect(x, y - barHeight / 2, barWidth - 3, barHeight);

          // Top peak dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y - (barHeight / 2) - 4, barWidth - 3, 2);
        }

      } else if (visualMode === 'vortex') {
        // Neon Cyber Vortex
        const ringCount = 8;
        for (let r = 0; r < ringCount; r++) {
          const ringProgress = (r / ringCount);
          const rRadius = (30 + r * 28) * (1 + Math.sin(time + r * 0.4) * 0.1 * intensity);
          
          ctx.beginPath();
          ctx.ellipse(
            centerX + mouseOffsetX * (1 - ringProgress * 0.5),
            centerY + mouseOffsetY * (1 - ringProgress * 0.5),
            rRadius,
            rRadius * 0.5,
            time * (r % 2 === 0 ? 0.3 : -0.3),
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = (r % 2 === 0 ? primaryColor : secondaryColor) + Math.floor((0.2 + (1 - ringProgress) * 0.7) * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [visualMode, colorScheme, isPlaying, isHovered, sensitivity]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePos.current.targetX = (e.clientX - rect.left) / rect.width;
    mousePos.current.targetY = (e.clientY - rect.top) / rect.height;
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pulseRipples.current.push({ x, y, radius: 10, alpha: 1.0 });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-brand-500/30 glass-panel shadow-2xl mb-12 group">
      
      {/* 3D Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mousePos.current.targetX = 0.5;
          mousePos.current.targetY = 0.5;
        }}
        onClick={handleCanvasClick}
        className="w-full h-80 sm:h-96 md:h-[440px] block cursor-crosshair relative z-10 transition-all duration-300"
      />

      {/* Floating Hero Content Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 sm:p-8 md:p-10">
        
        {/* Top Header Badge & Live Audio Status */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-bg/85 backdrop-blur-md border border-brand-500/40 shadow-lg shadow-brand-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-brand-neon' : 'bg-brand-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPlaying ? 'bg-brand-neon' : 'bg-brand-500'}`} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isPlaying ? 'Live Audio Stream Active' : 'SoundPulse 3D Audio Visualizer'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 font-mono font-bold">
              320kbps HD
            </span>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-dark-bg/80 backdrop-blur-md border border-dark-border/80">
            <button
              onClick={() => setVisualMode('quantum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                visualMode === 'quantum'
                  ? 'bg-brand-500 text-dark-bg shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              Quantum Wave
            </button>
            <button
              onClick={() => setVisualMode('galaxy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                visualMode === 'galaxy'
                  ? 'bg-brand-500 text-dark-bg shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              Galaxy 3D
            </button>
            <button
              onClick={() => setVisualMode('spectrum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                visualMode === 'spectrum'
                  ? 'bg-brand-500 text-dark-bg shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              Spectrum
            </button>
            <button
              onClick={() => setVisualMode('vortex')}
              className={`hidden sm:inline-block px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                visualMode === 'vortex'
                  ? 'bg-brand-500 text-dark-bg shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-dark-card'
              }`}
            >
              Vortex
            </button>
          </div>
        </div>

        {/* Center / Bottom Hero Banner & CTAs */}
        <div className="pointer-events-auto max-w-2xl bg-gradient-to-t from-dark-bg/95 via-dark-bg/80 to-transparent p-4 sm:p-6 rounded-2xl -mx-4 -mb-4 sm:mx-0 sm:mb-0">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-brand-neon" />
            <span>Lossless Studio Audio Stream & Converter</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Experience Music in <span className="bg-gradient-to-r from-brand-neon via-brand-300 to-cyan-400 bg-clip-text text-transparent">Ultra-Fidelity 320kbps</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 mb-5 max-w-xl">
            Stream unlimited tracks, explore Malayalam rap culture, and download direct-to-device studio MP3s with zero audio compression loss.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreClick}
              className="px-5 py-2.5 rounded-xl glow-btn text-dark-bg font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Explore 100k+ Tracks</span>
            </button>

            <button
              onClick={onLaunchStudioClick}
              className="px-4 py-2.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-brand-500/40 text-brand-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105"
            >
              <Activity className="w-4 h-4 text-brand-neon" />
              <span>Launch 3D Sound Studio</span>
            </button>
          </div>
        </div>

      </div>

      {/* Micro Info bar at the bottom */}
      <div className="bg-dark-surface/90 border-t border-dark-border/80 px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 relative z-20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Bitrate: 320kbps CBR / 48kHz Stereo</span>
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline">Click & drag on canvas to manipulate 3D acoustic fields</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Palette:</span>
          {['neon', 'cyber', 'sunset', 'aurora'].map((scheme) => (
            <button
              key={scheme}
              onClick={() => setColorScheme(scheme)}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                colorScheme === scheme ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
              } ${
                scheme === 'neon' ? 'bg-emerald-400' :
                scheme === 'cyber' ? 'bg-cyan-400' :
                scheme === 'sunset' ? 'bg-rose-500' : 'bg-indigo-400'
              }`}
              title={`Switch palette to ${scheme}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

