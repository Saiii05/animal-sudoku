import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { Board } from './components/Board';
import { Keypad, Toolbar } from './components/Controls';
import { AnimalSelector } from './components/AnimalSelector';
import { ShareModal } from './components/ShareModal';
import { Moon, Sun, Volume2, VolumeX, Share2, Plus } from 'lucide-react';
import { Difficulty } from './types';
import { Scoreboard} from './components/ScoreBoard';

const GameContainer: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isMuted, toggleMute } = useSound();

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('animal-sudoku-theme') === 'dark'
  );
  const [showAnimals, setShowAnimals] = useState(false);
  const [showShare, setShowShare] = useState(false);

  /* 🌗 Theme persistence */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('animal-sudoku-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('animal-sudoku-theme', 'light');
    }
  }, [isDark]);

  /* ⌨️ Keyboard support */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!state.selectedCell) return;

      const [r, c] = state.selectedCell;

      switch (e.key) {
        case 'ArrowUp':
          dispatch({ type: 'SELECT_CELL', row: Math.max(0, r - 1), col: c });
          break;
        case 'ArrowDown':
          dispatch({ type: 'SELECT_CELL', row: Math.min(8, r + 1), col: c });
          break;
        case 'ArrowLeft':
          dispatch({ type: 'SELECT_CELL', row: r, col: Math.max(0, c - 1) });
          break;
        case 'ArrowRight':
          dispatch({ type: 'SELECT_CELL', row: r, col: Math.min(8, c + 1) });
          break;
        case 'Backspace':
        case 'Delete':
          dispatch({ type: 'INPUT_VALUE', value: null });
          break;
        default:
          if (e.key >= '1' && e.key <= '9') {
            dispatch({ type: 'INPUT_VALUE', value: Number(e.key) });
          }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedCell]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-background transition-colors">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Animal Sudoku
        </h1>

        <div className="flex gap-3">
          <button onClick={() => setShowShare(true)} title="Share">
            <Share2 />
          </button>

          <button onClick={toggleMute} title="Sound">
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>

          <button onClick={() => setIsDark(!isDark)} title="Theme">
            {isDark ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar onSettings={() => setShowAnimals(true)} />

      {/* Board */}
      <Board />

      {/* Keypad */}
      <Keypad />

      {/* Difficulty / New Game */}
      <div className="w-full max-w-md mt-8 flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex gap-2">
          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => dispatch({ type: 'NEW_GAME', difficulty: d })}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                state.difficulty === d
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            dispatch({ type: 'NEW_GAME', difficulty: state.difficulty })
          }
          className="flex items-center gap-1 text-sm font-bold text-blue-600"
        >
          <Plus size={16} /> New Game
        </button>
      </div>

      {/* Modals */}
      {showAnimals && <AnimalSelector onClose={() => setShowAnimals(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* Tutorial Overlay */}
      {!localStorage.getItem('animal-sudoku-tutorial') && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8">
          <div className="bg-white p-6 rounded-xl max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome! 🦁</h2>
            <p className="mb-4 text-slate-600">
              Drag or tap animals so each row, column, and box has all 9 animals.
            </p>
            <button
              onClick={() => {
                localStorage.setItem('animal-sudoku-tutorial', 'true');
                window.location.reload();
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <SoundProvider>
    <GameProvider>
      <GameContainer />
	<ScoreBoard />
    </GameProvider>
  </SoundProvider>
);

export default App;

