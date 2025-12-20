import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { SoundProvider, useSound } from './context/SoundContext';

import { Board } from './components/Board';
import { Keypad, Toolbar } from './components/Controls';
import { AnimalSelector } from './components/AnimalSelector';
import { ShareModal } from './components/ShareModal';
import { ScoreBoard } from './components/ScoreBoard';

import { Moon, Sun, Volume2, VolumeX, Share2, Plus } from 'lucide-react';
import { Difficulty } from './types';

/* ---------------- GAME CONTAINER ---------------- */

const GameContainer: React.FC = () => {
  const { state, dispatch } = useGame();
  const { isMuted, toggleMute } = useSound();

  const [darkMode, setDarkMode] = useState(false);
  const [showAnimals, setShowAnimals] = useState(false);
  const [showShare, setShowShare] = useState(false);

  /* 🌙 Theme */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  /* 🔗 Handle shared puzzle link */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (!data) return;

    try {
      const decoded = decodeURIComponent(
        atob(data)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(decoded);
      localStorage.setItem('animal-sudoku-animals', JSON.stringify(payload.animals));
      window.location.href = window.location.origin;
    } catch {
      console.warn('Invalid share link');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors flex flex-col items-center py-6 px-4">

      {/* ---------- HEADER ---------- */}
      <header className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Animal Sudoku
        </h1>

        <div className="flex gap-3">
          <button onClick={() => setShowShare(true)}>
            <Share2 className="icon-btn" />
          </button>

          <button onClick={toggleMute}>
            {isMuted ? <VolumeX className="icon-btn" /> : <Volume2 className="icon-btn" />}
          </button>

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="icon-btn" /> : <Moon className="icon-btn" />}
          </button>
        </div>
      </header>

      {/* ---------- SCORE ---------- */}
      <ScoreBoard />

      {/* ---------- TOOLBAR ---------- */}
      <Toolbar onSettings={() => setShowAnimals(true)} />

      {/* ---------- BOARD ---------- */}
      <Board />

      {/* ---------- KEYPAD / DRAG SOURCE ---------- */}
      <Keypad />

      {/* ---------- DIFFICULTY ---------- */}
      <div className="w-full max-w-md mt-6 flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow">
        <div className="flex gap-2">
          {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
            <button
              key={level}
              onClick={() => dispatch({ type: 'NEW_GAME', difficulty: level })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition
                ${state.difficulty === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              {level}
            </button>
          ))}
        </div>

        <button
          onClick={() => dispatch({ type: 'NEW_GAME', difficulty: state.difficulty })}
          className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400"
        >
          <Plus size={16} /> New Game
        </button>
      </div>

      {/* ---------- MODALS ---------- */}
      {showAnimals && <AnimalSelector onClose={() => setShowAnimals(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* ---------- FIRST TIME TUTORIAL ---------- */}
      {!localStorage.getItem('animal-sudoku-tutorial') && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-sm text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Welcome 🦁</h2>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Fill every row, column, and 3×3 box with all animals.
              <br />
              Drag animals or tap to place them!
            </p>
            <button
              onClick={() => {
                localStorage.setItem('animal-sudoku-tutorial', 'true');
                window.location.reload();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- APP ROOT ---------------- */

const App: React.FC = () => {
  return (
    <SoundProvider>
      <GameProvider>
        <GameContainer />
      </GameProvider>
    </SoundProvider>
  );
};

export default App;

