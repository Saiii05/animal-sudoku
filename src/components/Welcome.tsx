import React, { useState } from "react";

export default function Welcome({onNext}:{onNext:(name:string)=>void}){
  const [name,setName] = useState("");
  return (
    <div className="overlay">
      <div className="panel">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 style={{margin:0,fontSize:28,color:'var(--muted)'}}>Welcome to Animal Sudoku</h1>
            <p style={{marginTop:6,color:'var(--muted)'}}>Enter your name and proceed to choose your 9 animals.</p>
          </div>
        </div>
        <div style={{marginTop:18,display:'flex',gap:12,alignItems:'center'}}>
          <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid rgba(148,163,184,0.2)',fontSize:16}} />
          <button className="btn" disabled={!name.trim()} onClick={()=>onNext(name.trim())}>Next ▶</button>
        </div>
      </div>
    </div>
  )
}

