import React, { createContext, useContext, useState, useEffect } from 'react';
type SoundType = 'pop' | 'error' | 'success' | 'click' | 'pencil';
interface SoundContextType { isMuted: boolean; toggleMute: () => void; playSound: (type: SoundType) => void; }
const SoundContext = createContext<SoundContextType | undefined>(undefined);
export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('animal-sudoku-muted') === 'true');
  useEffect(() => { localStorage.setItem('animal-sudoku-muted', String(isMuted)); }, [isMuted]);
  const toggleMute = () => setIsMuted(prev => !prev);
  const playSound = (type: SoundType) => {
    if (isMuted) return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (type) {
      case 'pop': osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(300, now + 0.1); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.1); osc.start(now); osc.stop(now + 0.1); break;
      case 'error': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3); break;
      case 'success': osc.type = 'triangle'; osc.frequency.setValueAtTime(440, now); osc.frequency.setValueAtTime(554, now + 0.1); osc.frequency.setValueAtTime(659, now + 0.2); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.4); osc.start(now); osc.stop(now + 0.4); break;
      default: break;
    }
  };
  return <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>{children}</SoundContext.Provider>;
};
export const useSound = () => { const context = useContext(SoundContext); if (!context) throw new Error('useSound must be used within SoundProvider'); return context; };
