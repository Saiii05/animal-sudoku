import React from "react";
import { useGame } from "../context/GameContext";

export default function EndScreen({onPlayAgain}:{onPlayAgain:()=>void}){
  const {state, dispatch} = useGame();
  const score = Math.max(0, 10000 - state.time*10 - state.mistakes*500);
  return (
    <div className="overlay">
      <div className="panel endscreen">
        <h2>🎉 Well done, {state.playerName || 'Player'}!</h2>
        <p>You solved the puzzle in {state.time}s with {state.mistakes} mistake(s). Score: {score}</p>
        <div style={{marginTop:12}}>
          <button className="btn" onClick={()=>{ onPlayAgain(); dispatch({type:'NEW'}); }}>Play Again</button>
        </div>
      </div>
    </div>
  );
}

