import { useGame } from "../context/GameContext";

export const ScoreBoard = () => {
  const { state } = useGame();
  const score = Math.max(0, 10000 - state.timer * 10 - state.mistakes * 500);

  const best = Number(localStorage.getItem("best-score") || 0);
  if (state.isSolved && score > best) {
    localStorage.setItem("best-score", String(score));
  }

  return (
    <div className="score">
      ⏱ {state.timer}s | ❌ {state.mistakes} | 🏆 {score} | ⭐ {best}
    </div>
  );
};

