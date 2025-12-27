import React, {createContext, useContext, useEffect, useState} from "react";

type T = { muted:boolean; toggle:()=>void; play:(name:'pop'|'error'|'success')=>void }
const ctxDefault = { muted:false, toggle:()=>{}, play:(_name:any)=>{} } as T;
const SoundContext = createContext<T>(ctxDefault);

export const SoundProvider: React.FC<{children:React.ReactNode}> = ({children})=>{
  const [muted, setMuted] = useState(() => localStorage.getItem('mute') === '1');
  useEffect(()=> localStorage.setItem('mute', muted ? '1' : '0'), [muted]);

  function play(name:'pop'|'error'|'success'){
    if(muted) return;
    try{
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if(!AC) return;
      const a = new AC();
      const o = a.createOscillator();
      const g = a.createGain();
      o.connect(g); g.connect(a.destination);
      const now = a.currentTime;
      if(name==='pop'){ o.type='sine'; o.frequency.setValueAtTime(800, now); g.gain.setValueAtTime(0.06, now); o.start(now); o.stop(now+0.08) }
      if(name==='error'){ o.type='sawtooth'; o.frequency.setValueAtTime(200, now); g.gain.setValueAtTime(0.06, now); o.start(now); o.stop(now+0.2) }
      if(name==='success'){ o.type='triangle'; o.frequency.setValueAtTime(500, now); g.gain.setValueAtTime(0.06, now); o.start(now); o.stop(now+0.22) }
    }catch(e){}
  }

  return <SoundContext.Provider value={{muted, toggle:()=>setMuted(m=>!m), play}}>{children}</SoundContext.Provider>
}

export const useSound = ()=> useContext(SoundContext);

