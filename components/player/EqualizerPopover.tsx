'use client';

import { useState, useRef, useEffect } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { usePlayerStore, usePlayerAction, EQ_PRESETS } from '@/store/playerStore';
import { cn } from '@/lib/utils';

export function EqualizerPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const eqBands = usePlayerStore((s) => s.eqBands);
  const eqPresetName = usePlayerStore((s) => s.eqPresetName);
  const { setEqBand, setEqPreset } = usePlayerAction();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const bandLabels = ['60Hz', '230Hz', '910Hz', '4kHz', '14kHz'];

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        aria-label="Audio Equalizer"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full text-text-subdued transition hover:scale-[1.04] hover:text-text-base active:scale-95',
          isOpen && 'text-pulse-accent-bright bg-white/5'
        )}
      >
        <Sliders size={18} />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 z-50 w-80 rounded-xl border border-white/10 bg-bg-elevated-base p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h3 className="text-sm font-bold text-text-base">Audio Equalizer</h3>
              <p className="text-[10px] text-text-subdued">Tune your playback frequencies</p>
            </div>
            <button
              type="button"
              onClick={() => setEqPreset('Flat')}
              title="Reset to Flat"
              className="rounded p-1 text-text-subdued transition hover:bg-white/10 hover:text-white"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Preset Selector */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-text-subdued">Preset</label>
            <div className="grid grid-cols-3 gap-1">
              {Object.keys(EQ_PRESETS).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEqPreset(name)}
                  className={cn(
                    'rounded-md px-2 py-1 text-[11px] font-medium transition',
                    eqPresetName === name
                      ? 'bg-pulse-accent text-black font-bold'
                      : 'bg-white/5 text-text-base hover:bg-white/10'
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer Bands */}
          <div>
            <label className="mb-3 block text-xs font-semibold text-text-subdued">Frequency Gain (dB)</label>
            <div className="flex h-36 items-end justify-between px-1">
              {eqBands.map((gain, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="text-[10px] font-mono tabular-nums text-pulse-accent-bright font-bold">
                    {gain > 0 ? `+${gain}` : gain}
                  </div>
                  {/* Vertical Slider */}
                  <div className="relative flex h-24 items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={gain}
                      onChange={(e) => setEqBand(idx, Number(e.target.value))}
                      className="h-24 w-1.5 cursor-pointer appearance-none rounded-full bg-white/15 accent-pulse-accent-bright"
                      style={{
                        writingMode: 'vertical-lr',
                        direction: 'rtl',
                      }}
                    />
                  </div>
                  <div className="text-[9px] font-medium text-text-subdued">
                    {bandLabels[idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
