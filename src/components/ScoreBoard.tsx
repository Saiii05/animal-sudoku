import React from 'react';
import { useGame } from '../context/GameContext';

export const ScoreBoard: React.FC = () => {
  const { state } = useGame();

  const score =
    Math.max(0, 10000 - state.timer * 10 - state.mistakes * 500);

  const best = Number(localStorage.getItem('best-score') || 0);
  if (score > best && state.isSolved) {
    localStorage.setItem('best-score', String(score));
  }

  return (
    <div className="flex justify-between w-full max-w-md bg-white dark:bg-slate-800 p-3 rounded-lg shadow">
      <div>⏱ Time: {state.timer}s</div>
      <div>❌ Mistakes: {state.mistakes}</div>
      <div>🏆 Score: {score}</div>
      <div>⭐ Best: {best}</div>
    </div>
  );
};

