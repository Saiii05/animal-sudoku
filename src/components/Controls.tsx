import React, { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { exportPuzzle } from "../utils/share";
import { useSound } from "../context/SoundContext";
import ShareModal from "./ShareModal";

export default function Controls({animals}:{animals:string[]}) {
  const { state, dispatch } = useGame();
  const sound = useSound();
  const [showShare, setShowShare] = React.useState(false);

  useEffect(()=>{
    const handler = (e:KeyboardEvent)=>{
      if(!state.animals || state.animals.length<9) return;
      if(e.key >= '1' && e.key <= '9'){
        const idx = Number(e.key) - 1;
        dispatch({type:'INPUT', v: idx+1});
        sound.play('pop');
      } else if(e.key === 'z' && (e.ctrlKey || e.metaKey)){
        dispatch({type:'UNDO'});
      } else if(e.key === 'y' && (e.ctrlKey || e.metaKey)){
        dispatch({type:'REDO'});
      }
    }
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  }, [state.animals]);

  function onDragStart(e:React.DragEvent, idx:number){
    e.dataTransfer.setData('animalIdx', String(idx));
    dispatch({type:'SET_DRAG', idx});
  }

  function onTouchStart(idx:number){
    dispatch({type:'SET_DRAG', idx});
  }

  function onPlace(idx:number){
    if(!state.selected) return;
    dispatch({type:'INPUT', v: idx+1});
    sound.play('pop');
  }

  function handleShare(){
    const payload = { grid: state.grid.map(row=>row.map(c=>c.value||0)), animals: state.animals, name: state.playerName };
    const token = exportPuzzle(payload);
    const url = `${location.origin}${location.pathname}?p=${token}`;
    navigator.clipboard.writeText(url);
    setShowShare(true);
  }

  return (
    <div className="controls-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontWeight:700}}>{state.playerName ? `Player: ${state.playerName}` : 'Player'}</div>
        <div>
          <button className="btn small ghost" onClick={()=>dispatch({type:'UNDO'})}>Undo</button>
          <button className="btn small ghost" onClick={()=>dispatch({type:'REDO'})}>Redo</button>
        </div>
      </div>

      <div style={{marginTop:8}} className="palette" role="toolbar" aria-label="Animal palette">
        {state.animals.map((a:string, idx:number)=>(
          <div
            key={a}
            draggable
            onDragStart={(e)=>onDragStart(e, idx)}
            onTouchStart={()=>onTouchStart(idx)}
            onClick={()=> onPlace(idx)}
            className={`animal ${state.selected && state.grid[state.selected[0]][state.selected[1]].value === idx+1 ? 'selected' : ''}`}
            title={`Place ${idx+1}`}
            data-idx={idx}
          >
            {a}
          </div>
        ))}
      </div>

      <div className="controls-row">
        <button className="btn" onClick={()=>{ dispatch({type:'HINT'}); sound.play('pop') }}>💡 Hint</button>
        <button className="btn ghost" onClick={()=>{
          const id = setInterval(()=> dispatch({type:'SOLVE_STEP'}), 120);
          setTimeout(()=> clearInterval(id), 9000);
        }}>▶ Solve (animate)</button>
        <button className="btn ghost" onClick={()=> handleShare() }>Share</button>
        <button className="btn ghost" onClick={()=> sound.toggle() }>{sound.muted ? '🔇' : '🔊'}</button>
      </div>

      {showShare && <ShareModal onClose={()=>setShowShare(false)} url={''} />}
    </div>
  );
}

