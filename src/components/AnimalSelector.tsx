import React from "react";
import { ALL_ANIMALS } from "../data/animals";

export default function AnimalSelector({selected, setSelected, onDone}:{selected:string[], setSelected:(a:string[])=>void, onDone:()=>void}){
  function toggle(emoji:string){
    if(selected.includes(emoji)) setSelected(selected.filter(s=>s!==emoji));
    else if(selected.length < 9) setSelected([...selected, emoji]);
  }

  return (
    <div className="overlay">
      <div className="panel">
        <h2 style={{margin:0}}>Choose 9 Animals</h2>
        <p style={{color:'var(--muted)'}}>Pick any nine animals you like. These will replace Sudoku digits.</p>
        <div style={{marginTop:12, display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10}}>
          {ALL_ANIMALS.map(a=> (
            <button key={a.id}
              className={`animal ${selected.includes(a.emoji) ? 'selected' : ''}`}
              onClick={()=>toggle(a.emoji)}
              disabled={!selected.includes(a.emoji) && selected.length>=9}
              title={a.name}
            >
              {a.emoji}
            </button>
          ))}
        </div>
        <div style={{marginTop:14, display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button className="btn ghost" onClick={()=>{ setSelected([]) }}>Reset</button>
          <button className="btn" disabled={selected.length !== 9} onClick={onDone}>Start Game</button>
        </div>
      </div>
    </div>
  );
}

