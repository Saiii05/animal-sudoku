import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cell, GameState, Difficulty } from '../types';
import { generateSudoku } from '../utils/sudoku';

type Action =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_VALUE'; value: number | null }
  | { type: 'TICK' };

const initialState: GameState = {
  grid: [],
  selectedCell: null,
  history: [],
  historyPointer: 0,
  difficulty: 'Easy',
  isSolved: false,
  mistakes: 0,
  timer: 0,
  isPencilMode: false,
};

const GameContext = createContext<any>(null);

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'NEW_GAME': {
      const { initial } = generateSudoku(action.difficulty);
      return { ...initialState, grid: initial, difficulty: action.difficulty };
    }
    case 'SELECT_CELL':
      return { ...state, selectedCell: [action.row, action.col] };

    case 'INPUT_VALUE': {
      if (!state.selectedCell) return state;
      const [r, c] = state.selectedCell;
      const grid = state.grid.map(row => row.map(cell => ({ ...cell })));
      const cell = grid[r][c];
      if (cell.isGiven) return state;

      cell.value = action.value;
      cell.isError = action.value !== null && action.value !== cell.solution;

      return {
        ...state,
        grid,
        mistakes: cell.isError ? state.mistakes + 1 : state.mistakes,
        isSolved: grid.every(row => row.every(c => c.value === c.solution)),
      };
    }

    case 'TICK':
      return { ...state, timer: state.timer + 1 };

    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.grid.length === 0) dispatch({ type: 'NEW_GAME', difficulty: 'Easy' });
  }, []);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

