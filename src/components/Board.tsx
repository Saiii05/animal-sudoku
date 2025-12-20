import React from 'react';
import { useGame } from '../context/GameContext';
import { clsx } from 'clsx';

export const Board = () => {
  const { state, animals, dispatch } = useGame();

  return (
    <div className="grid grid-rows-9 w-full max-w-md aspect-square border">
      {state.grid.map((row, r) =>
        <div key={r} className="grid grid-cols-9">
          {row.map((cell, c) => (
            <div
              key={c}
              onClick={() => !cell.isGiven && dispatch({ type: 'SELECT_CELL', row: r, col: c })}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                if (cell.isGiven) return;
                const v = Number(e.dataTransfer.getData('animal-value'));
                dispatch({ type: 'SELECT_CELL', row: r, col: c });
                dispatch({ type: 'INPUT_VALUE', value: v });
              }}
              className={clsx(
                'h-full w-full flex items-center justify-center text-3xl border',
                cell.isGiven && 'opacity-80 cursor-not-allowed',
                cell.isError && 'cell-error'
              )}
            >
              {cell.value ? animals[cell.value - 1].char : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

