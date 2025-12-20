import { GameProvider } from "./context/GameContext";
import { Board } from "./components/Board";
import { Controls } from "./components/Controls";
import { ScoreBoard } from "./components/ScoreBoard";

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <h1>Animal Sudoku</h1>
        <ScoreBoard />
        <Board />
        <Controls />
      </div>
    </GameProvider>
  );
}

