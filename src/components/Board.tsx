import React from 'react';
import { useGame } from '../context/GameContext';
import { clsx } from 'clsx';
import { Cell } from '../types';

const CellComponent: React.FC<{ cell: Cell }> = ({ cell }) => {
  const { state, animals, dispatch } = useGame();
  const { selectedCell, grid } = state;

  const isSelected =
    selectedCell?.[0] === cell.row && selectedCell?.[1] === cell.col;

  const isSameRow = selectedCell?.[0] === cell.row;
  const isSameCol = selectedCell?.[1] === cell.col;

  const isSameBox =
    selectedCell &&
    Math.floor(selectedCell[0] / 3) === Math.floor(cell.row / 3) &&
    Math.floor(selectedCell[1] / 3) === Math.floor(cell.col / 3);

  const selectedVal =
    selectedCell ? grid[selectedCell[0]][selectedCell[1]].value : null;

  const isSameValue =
    selectedVal !== null && cell.value === selectedVal;

  const displayChar =
    cell.value !== null ? animals[cell.value - 1]?.char : null;

  return (
    <div
      onClick={() => {
        if (!cell.isGiven)
          dispatch({ type: 'SELECT_CELL', row: cell.row, col: cell.col });
      }}
      onDragOver={(e) => {
        if (cell.isGiven) return;
        e.preventDefault();
        e.currentTarget.classList.add('cell-drop-hover');
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove('cell-drop-hover');
      }}
      onDrop={(e) => {
        if (cell.isGiven) return;
        e.preventDefault();
        e.currentTarget.classList.remove('cell-drop-hover');
        const value = Number(e.dataTransfer.getData('animal-value'));
        if (!isNaN(value)) {
          dispatch({ type: 'SELECT_CELL', row: cell.row, col: cell.col });
          dispatch({ type: 'INPUT_VALUE', value });
        }
      }}
      className={clsx(
        'relative flex items-center justify-center text-3xl select-none transition-all duration-150',
        'border border-slate-300 dark:border-slate-700',
        (cell.col + 1) % 3 === 0 && cell.col !== 8 && 'border-r-2',
        (cell.row + 1) % 3 === 0 && cell.row !== 8 && 'border-b-2',

        isSelected && 'cell-selected',
        !isSelected && isSameRow && 'cell-row-highlight',
        !isSelected && isSameCol && 'cell-col-highlight',
        !isSelected && isSameBox && 'cell-box-highlight animate-box',

        isSameValue && !isSelected && 'cell-same-value',
        cell.isError && 'cell-error animate-shake',

        cell.isGiven ? 'font-bold cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      {displayChar}

      {!cell.value && cell.notes.length > 0 && (
        <div className="grid grid-cols-3 w-full h-full p-[2px]">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <div key={n} className="text-[9px] text-slate-500 flex items-center justify-center">
              {cell.notes.includes(n) ? animals[n - 1]?.char : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Board: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="w-full max-w-md aspect-square bg-white dark:bg-slate-900 rounded-lg shadow-xl border-2 border-slate-800 overflow-hidden">
      <div className="grid grid-rows-9 h-full">
        {state.grid.map((row, r) => (
          <div key={r} className="grid grid-cols-9 h-full">
            {row.map(cell => (
              <CellComponent key={`${cell.row}-${cell.col}`} cell={cell} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

