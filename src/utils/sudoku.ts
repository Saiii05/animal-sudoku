import { Cell, Difficulty } from "../types";
const BLANK = 0;
export const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
  for (let x = 0; x < 9; x++) if (grid[row][x] === num && x !== col) return false;
  for (let y = 0; y < 9; y++) if (grid[y][col] === num && y !== row) return false;
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num && (i + startRow !== row || j + startCol !== col)) return false;
    }
  }
  return true;
};
const solve = (grid: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === BLANK) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solve(grid)) return true;
            grid[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};
export const generateSudoku = (difficulty: Difficulty): { initial: Cell[][], solved: number[][] } => {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(BLANK));
  for (let i = 0; i < 9; i += 3) fillBox(grid, i, i);
  solve(grid);
  const solvedGrid = grid.map(row => [...row]);
  const attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 55;
  let count = attempts;
  while (count > 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    while (grid[row][col] === BLANK) {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    }
    grid[row][col] = BLANK;
    count--;
  }
  const cellGrid: Cell[][] = grid.map((row, rIndex) => 
    row.map((val, cIndex) => ({
      row: rIndex,
      col: cIndex,
      value: val === 0 ? null : val,
      solution: solvedGrid[rIndex][cIndex],
      isGiven: val !== 0,
      notes: [],
      isError: false
    }))
  );
  return { initial: cellGrid, solved: solvedGrid };
};
const fillBox = (grid: number[][], row: number, col: number) => {
  let num: number;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do { num = Math.floor(Math.random() * 9) + 1; } while (!isSafeInBox(grid, row, col, num));
      grid[row + i][col + j] = num;
    }
  }
};
const isSafeInBox = (grid: number[][], row: number, col: number, num: number) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) { if (grid[row + i][col + j] === num) return false; }
  }
  return true;
};
