import React, { useEffect } from "react";
import { useGame } from "../context/GameContext";
import confetti from "canvas-confetti";

export default function ScoreBoard(){
  const { state } = useGame();
  const score = Math.max(0, 10000 - state.time*10 - state.mistakes*500);
  const bestKey = `animal-sudoku-best`;
  const best = Number(localStorage.getItem(bestKey) || 0);

  useEffect(()=>{
    if(state.solved){
      if(score > best) localStorage.setItem(bestKey, String(score));
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }, [state.solved]);

  return (
    <div className="scorecard">
      <div>⏱ {state.time}s</div>
      <div>❌ {state.mistakes}</div>
      <div>🏆 {score}</div>
      <div>⭐ {best}</div>
    </div>
  );
}

