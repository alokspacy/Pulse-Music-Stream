'use client';

import { usePlayerStore } from '@/store/playerStore';
import { useEffect, useRef, type RefObject } from 'react';

let globalAnalyser: AnalyserNode | null = null;

export function getAudioAnalyser() {
  return globalAnalyser;
}

export function useAudioEngine(audioRef: RefObject<HTMLAudioElement | null>) {
  const lastSrcRef = useRef<string | null>(null);
  const lastSeekTokenRef = useRef(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const { setProgress, setDuration, setBuffering, next, pause } =
      usePlayerStore.getState().actions;

    // Initialize Web Audio API once the audio element is ready
    if (!audioContextRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Crucial for allowing Web Audio analysis on external streaming CDNs
          audio.crossOrigin = 'anonymous';

          const source = ctx.createMediaElementSource(audio);

          // 5-band equalizer frequencies (Hz)
          const freqs = [60, 230, 910, 4000, 14000];
          const initialBands = usePlayerStore.getState().eqBands;
          const filters = freqs.map((f, index) => {
            const filter = ctx.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = f;
            filter.Q.value = 1.0;
            filter.gain.value = initialBands[index] ?? 0;
            return filter;
          });
          filtersRef.current = filters;

          // Analyser for real-time sound visualizer
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
          globalAnalyser = analyser;

          // Connect nodes in series: source -> filters -> analyser -> destination
          let lastNode: AudioNode = source;
          filters.forEach((filter) => {
            lastNode.connect(filter);
            lastNode = filter;
          });
          lastNode.connect(analyser);
          analyser.connect(ctx.destination);
        }
      } catch (err) {
        console.error('Web Audio API setup failed:', err);
      }
    }

    const onTimeUpdate = () => {
      const d = audio.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      setProgress((audio.currentTime / d) * 100);
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onCanPlay = () => setBuffering(false);

    const onEnded = () => {
      setProgress(0);
      next();
    };

    const onError = () => {
      setBuffering(false);
      pause();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    audio.volume = usePlayerStore.getState().volume;

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [audioRef]);

  // Subscribe imperatively to the store to avoid re-renders for every timeupdate.
  useEffect(() => {
    const unsubscribe = usePlayerStore.subscribe((state, prev) => {
      const audio = audioRef.current;
      if (!audio) return;

      const nextSrc = state.currentTrack?.audioUrl ?? '';
      if (nextSrc !== lastSrcRef.current) {
        lastSrcRef.current = nextSrc;
        if (nextSrc) {
          audio.src = nextSrc;
          audio.currentTime = 0;
          audio.load();
          if (state.isPlaying) {
            // Resume suspended context on user action
            if (
              audioContextRef.current &&
              audioContextRef.current.state === 'suspended'
            ) {
              void audioContextRef.current.resume();
            }
            void audio.play().catch(() => {
              console.log('Playback rejected');
            });
          }
        } else {
          audio.removeAttribute('src');
          audio.load();
        }
        return;
      }

      if (state.isPlaying !== prev.isPlaying) {
        if (state.isPlaying) {
          if (
            audioContextRef.current &&
            audioContextRef.current.state === 'suspended'
          ) {
            void audioContextRef.current.resume();
          }
          void audio.play().catch(() => {
            console.log('Playback rejected');
          });
        } else {
          audio.pause();
        }
      }

      if (state.volume !== prev.volume) {
        audio.volume = state.volume;
      }

      if (state.seekToken !== lastSeekTokenRef.current) {
        lastSeekTokenRef.current = state.seekToken;
        const d = audio.duration;
        if (Number.isFinite(d) && d > 0) {
          audio.currentTime = (state.progress / 100) * d;
        }
      }

      // Synchronize Equalizer gains dynamically when state updates
      if (state.eqBands !== prev.eqBands) {
        filtersRef.current.forEach((filter, idx) => {
          if (filter && typeof state.eqBands[idx] === 'number') {
            filter.gain.setValueAtTime(
              state.eqBands[idx],
              audioContextRef.current?.currentTime ?? 0,
            );
          }
        });
      }
    });

    const s = usePlayerStore.getState();
    lastSeekTokenRef.current = s.seekToken;

    return unsubscribe;
  }, [audioRef]);
}
