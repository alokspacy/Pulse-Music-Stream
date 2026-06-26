'use client';

import { useEffect, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayerStore, usePlayerAction } from '@/store/playerStore';
import { getAudioAnalyser } from '@/lib/hooks/useAudio';
import { CoverImage } from '../ui/CoverImage';
import { cn } from '@/lib/utils';

interface VisualizerViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisualizerView({ isOpen, onClose }: VisualizerViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const track = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const { togglePlay, next, previous } = usePlayerAction();

  // Escape key support to exit fullscreen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Visualizer drawing loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles array for ambient space effect
    const particlesCount = 80;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    const colors = ['#a855f7', '#d946ef', '#c084fc', '#f472b6', '#818cf8'];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const analyser = getAudioAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    let rotationAngle = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      animationRef.current = requestAnimationFrame(draw);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Mock data when paused or not connected to audio context
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = isPlaying
            ? Math.sin(Date.now() / 200 + i) * 30 + 40
            : 0;
        }
      }

      // Calculate average bass level (first 10 bins)
      let bassSum = 0;
      for (let i = 0; i < 10; i++) {
        bassSum += dataArray[i];
      }
      const bassAvg = bassSum / 10;
      const bassFactor = bassAvg / 255; // 0 to 1

      // Clear with fading effect to create trailing glows
      ctx.fillStyle = `rgba(12, 11, 14, ${0.12 + (1 - bassFactor) * 0.08})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.16 + (bassAvg * 0.12);

      // 1. Draw dynamic ambient radial glow pulsing with the bass
      const radialGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.7,
        centerX,
        centerY,
        baseRadius * 2.5
      );
      radialGlow.addColorStop(0, `rgba(168, 85, 247, ${0.18 * bassFactor})`);
      radialGlow.addColorStop(0.5, `rgba(217, 70, 239, ${0.06 * bassFactor})`);
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw soundwave particles
      particles.forEach((p) => {
        // Speed up particles based on audio levels
        const multiplier = 1 + bassFactor * 4;
        p.x += p.speedX * multiplier;
        p.y += p.speedY * multiplier;

        // Wrap around borders
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + bassFactor * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.2 + bassFactor * 0.5;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Draw circular equalizer spectrum ring
      const numBars = 120;
      rotationAngle += 0.002 + bassFactor * 0.006;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngle);

      for (let i = 0; i < numBars; i++) {
        const angle = (i * Math.PI * 2) / numBars;
        
        // Use symmetric data array index mapping for cleaner circles
        const dataIdx = Math.floor(Math.abs(Math.sin(angle)) * (bufferLength / 2));
        const value = dataArray[dataIdx];
        const barHeight = (value / 255) * 80 + 3;

        const xStart = Math.cos(angle) * baseRadius;
        const yStart = Math.sin(angle) * baseRadius;
        const xEnd = Math.cos(angle) * (baseRadius + barHeight);
        const yEnd = Math.sin(angle) * (baseRadius + barHeight);

        // Color gradient for the bars
        const hue = (i * 360) / numBars;
        ctx.strokeStyle = `hsla(${270 + Math.sin(rotationAngle + i * 0.05) * 45}, 85%, 65%, ${0.65 + bassFactor * 0.35})`;
        ctx.lineWidth = Math.max(1.5, (baseRadius * Math.PI) / numBars);
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Draw horizontal reflection waveforms at the bottom
      const waveBars = 45;
      const waveWidth = canvas.width / waveBars;
      for (let i = 0; i < waveBars; i++) {
        const val = dataArray[i % (bufferLength / 3)] || 5;
        const height = (val / 255) * 60;
        
        ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.fillRect(
          i * waveWidth + waveWidth * 0.1,
          canvas.height - height - 10,
          waveWidth * 0.8,
          height
        );

        ctx.fillStyle = 'rgba(217, 70, 239, 0.3)';
        ctx.fillRect(
          i * waveWidth + waveWidth * 0.1,
          canvas.height - height * 0.4 - 10,
          waveWidth * 0.8,
          height * 0.4
        );
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0c0b0e] text-white">
      {/* Visualizer Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-none" />

      {/* Header bar */}
      <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 bg-linear-to-b from-black/60 to-transparent">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pulse-accent-bright">
            Now Playing
          </span>
          <span className="text-sm font-medium text-white/70">
            {track ? track.album : 'Pulse Music'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white/5 p-2.5 text-white/70 transition hover:scale-[1.04] hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      </header>

      {/* Main layout contents */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
        {/* Floating Album card */}
        <div className="group relative flex flex-col items-center">
          <div
            className={cn(
              "relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-in-out border-4 border-black/40 ring-8 ring-white/5",
              isPlaying ? "animate-[spin_20s_linear_infinite]" : ""
            )}
          >
            {track ? (
              <CoverImage
                src={track.coverUrl}
                alt={track.album}
                size={320}
                shape="square"
                sizes="(max-width: 768px) 256px, 320px"
              />
            ) : (
              <div className="h-full w-full bg-bg-elevated-base" />
            )}
            {/* Center spindle hole of the vinyl disc */}
            <div className="absolute inset-0 m-auto h-12 w-12 rounded-full border border-black/20 bg-[#0c0b0e] shadow-inner flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-black/40" />
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        {track ? (
          <div className="text-center max-w-lg">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {track.title}
            </h2>
            <p className="mt-1 text-sm md:text-base font-medium text-pulse-accent-bright drop-shadow-sm">
              {track.artist}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold">No song selected</h2>
            <p className="text-sm text-text-subdued">Choose a song from your library to visualize.</p>
          </div>
        )}
      </div>

      {/* Control overlay footer */}
      <footer className="relative z-10 flex flex-col items-center gap-4 bg-linear-to-t from-black/80 to-transparent p-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={previous}
            className="rounded-full p-2 text-white/70 transition hover:scale-105 hover:text-white"
          >
            <SkipBack size={24} />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-pulse-accent text-black shadow-lg transition hover:scale-[1.05] hover:bg-pulse-accent-bright active:scale-95"
          >
            {isPlaying ? (
              <Pause size={24} className="fill-black" />
            ) : (
              <Play size={24} className="fill-black translate-x-[2px]" />
            )}
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full p-2 text-white/70 transition hover:scale-105 hover:text-white"
          >
            <SkipForward size={24} />
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-white/30">
          Pulse Interactive Spectrum
        </p>
      </footer>
    </div>
  );
}
