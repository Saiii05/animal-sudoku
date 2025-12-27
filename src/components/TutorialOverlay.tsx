import React, { useState } from "react";

export default function TutorialOverlay({onClose}:{onClose?:()=>void}){
  const [step,setStep] = useState(0);
  const steps = [
    {title:'Welcome', text:'Drag animals from palette into the grid. Use hint or solver if stuck.'},
    {title:'Pencil & Notes', text:'(Pencil mode not included in this build)'},
    {title:'Sharing', text:'Use Share to copy a URL of this puzzle.'}
  ];
  return (
    <div className="overlay">
      <div className="panel">
        <h3>{steps[step].title}</h3>
        <p style={{color:'var(--muted)'}}>{steps[step].text}</p>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:12}}>
          <div>
            <button className="btn ghost" onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>Back</button>
            <button className="btn" style={{marginLeft:8}} onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1}>Next</button>
          </div>
          <div>
            <button className="btn ghost" onClick={()=>{ localStorage.setItem('tutorial-dismissed','1'); onClose?.() }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

