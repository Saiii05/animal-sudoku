import React, { useRef } from "react";
import { useGame } from "../context/GameContext";

export default function Board({animals}:{animals:string[]}) {
  const { state, dispatch } = useGame();
  const touchDrag = useRef<{emoji?:string, index?:number} | null>(null);

  if(!state.grid || state.grid.length===0) return <div>Loading...</div>;

  function handleDrop(r:number,c:number, index:number){
    dispatch({type:'SELECT', r, c});
    dispatch({type:'INPUT', v: index+1});
  }

  return (
    <div className="board-card">
      <div className="board" role="grid" aria-label="Sudoku board">
        {state.grid.flat().map(cell=>{
          const sel = state.selected;
          const sameRow = sel && sel[0] === cell.row;
          const sameCol = sel && sel[1] === cell.col;
          const sameBox = sel && Math.floor(sel[0]/3) === Math.floor(cell.row/3) && Math.floor(sel[1]/3) === Math.floor(cell.col/3);

          return (
            <div key={`${cell.row}-${cell.col}`}
              className={[
                "cell",
                cell.given ? "given" : "",
                cell.error ? "error" : "",
                sameRow ? "cell-row" : "",
                sameCol ? "cell-col" : "",
                sameBox ? "cell-box" : ""
              ].join(' ')}
              onClick={()=> dispatch({type:'SELECT', r:cell.row, c:cell.col})}
              onDragOver={(e)=>{ if(!cell.given) e.preventDefault() }}
              onDrop={(e)=>{
                e.preventDefault();
                const idx = Number(e.dataTransfer.getData('animalIdx'));
                if(!Number.isNaN(idx)) handleDrop(cell.row, cell.col, idx);
              }}
              onTouchStart={(e)=>{ /* prevent unwanted */ }}
              onTouchEnd={(e)=>{
                const data = (e as any).target?.dataset;
                // if touch drop used via Controls, controls will call dispatch with SET_DRAG
                const draggingIndex = state.draggingAnimalIndex;
                if(draggingIndex !== null){
                  handleDrop(cell.row, cell.col, draggingIndex);
                  dispatch({type:'SET_DRAG', idx:null});
                }
              }}
            >
              {cell.value ? animals[cell.value - 1] : ""}
            </div>
          )
        })}
      </div>
    </div>
  )
}

