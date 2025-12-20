import React from 'react';
import { useGame } from '../context/GameContext';
import { Undo, Lightbulb, PenTool, Eraser, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const Keypad = () => {
  const { animals, dispatch } = useGame();

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-md mt-4">
      {animals.map((a, i) => (
        <button
          key={a.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('animal-value', String(i + 1));
            const ghost = document.createElement('div');
            ghost.innerText = a.char;
            ghost.style.fontSize = '32px';
            ghost.style.position = 'absolute';
            ghost.style.top = '-1000px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 16, 16);
            setTimeout(() => document.body.removeChild(ghost), 0);
          }}
          onClick={() => dispatch({ type: 'INPUT_VALUE', value: i + 1 })}
          className="h-14 bg-white dark:bg-slate-800 rounded shadow text-2xl cursor-grab"
        >
          {a.char}
        </button>
      ))}
      <button
        onClick={() => dispatch({ type: 'INPUT_VALUE', value: null })}
        className="h-14 bg-red-100 rounded"
      >
        <Eraser />
      </button>
    </div>
  );
};

export const Toolbar = ({ onSettings }: { onSettings: () => void }) => {
  const { state, dispatch } = useGame();
  return (
    <div className="flex justify-between max-w-md w-full mb-4">
      <button onClick={() => dispatch({ type: 'UNDO' })}><Undo /></button>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_PENCIL' })}
        className={clsx(state.isPencilMode && 'bg-blue-500 text-white')}
      >
        <PenTool />
      </button>
      <button onClick={() => dispatch({ type: 'HINT' })}><Lightbulb /></button>
      <button onClick={onSettings}><Settings /></button>
    </div>
  );
};

