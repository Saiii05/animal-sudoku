import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Animal, Cell, Difficulty, GameState } from '../types';
import { generateSudoku } from '../utils/sudoku';
import { DEFAULT_ANIMALS } from '../utils/defaults';
import confetti from 'canvas-confetti';
import { useSound } from './SoundContext';

type Action =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'RESET_GAME' }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_VALUE'; value: number | null }
  | { type: 'TOGGLE_PENCIL' }
  | { type: 'UNDO' }
  | { type: 'HINT' };

const GameContext = createContext<any>(null);

const cloneGrid = (grid: Cell[][]): Cell[][] =>
  grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })));

const hasConflict = (grid: Cell[][], r: number, c: number, v: number) => {
  for (let i = 0; i < 9; i++) {
    if (i !== c && grid[r][i].value === v) return true;
    if (i !== r && grid[i][c].value === v) return true;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = br; i < br + 3; i++)
    for (let j = bc; j < bc + 3; j++)
      if ((i !== r || j !== c) && grid[i][j].value === v) return true;
  return false;
};

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'NEW_GAME': {
      const { initial } = generateSudoku(action.difficulty);
      return {
        ...state,
        grid: cloneGrid(initial),
        history: [cloneGrid(initial)],
        historyPointer: 0,
        difficulty: action.difficulty,
        mistakes: 0,
        isSolved: false,
      };
    }

    case 'SELECT_CELL':
      return { ...state, selectedCell: [action.row, action.col] };

    case 'INPUT_VALUE': {
      if (!state.selectedCell) return state;
      const [r, c] = state.selectedCell;
      const cell = state.grid[r][c];
      if (cell.isGiven) return state;

      const grid = cloneGrid(state.grid);
      const target = grid[r][c];

      if (action.value === null) {
        target.value = null;
        target.notes = [];
      } else if (state.isPencilMode) {
        target.notes = target.notes.includes(action.value)
          ? target.notes.filter(n => n !== action.value)
          : [...target.notes, action.value];
      } else {
        target.value = action.value;
        target.notes = [];
        target.isError = hasConflict(grid, r, c, action.value);

        for (let i = 0; i < 9; i++) {
          grid[r][i].notes = grid[r][i].notes.filter(n => n !== action.value);
          grid[i][c].notes = grid[i][c].notes.filter(n => n !== action.value);
        }
      }

      const history = state.history.slice(0, state.historyPointer + 1);
      history.push(cloneGrid(grid));

      const solved = grid.every(row => row.every(c => c.value === c.solution));
      if (solved) confetti();

      const mistakes = target.isError ? state.mistakes + 1 : state.mistakes;
      if (mistakes >= 3) alert('Game Over! Too many mistakes.');

      return {
        ...state,
        grid,
        history,
        historyPointer: history.length - 1,
        mistakes,
        isSolved: solved,
      };
    }

    case 'UNDO':
      if (state.historyPointer === 0) return state;
      return {
        ...state,
        grid: cloneGrid(state.history[state.historyPointer - 1]),
        historyPointer: state.historyPointer - 1,
      };

    case 'TOGGLE_PENCIL':
      return { ...state, isPencilMode: !state.isPencilMode };

    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playSound } = useSound();
  const [state, dispatch] = useReducer(reducer, {
    grid: [],
    selectedCell: null,
    history: [],
    historyPointer: 0,
    difficulty: 'Easy',
    isSolved: false,
    mistakes: 0,
    timer: 0,
    isPencilMode: false,
  });

  const [animals] = React.useState<Animal[]>(DEFAULT_ANIMALS);

  useEffect(() => {
    dispatch({ type: 'NEW_GAME', difficulty: 'Easy' });
  }, []);

  return (
    <GameContext.Provider value={{ state, animals, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

