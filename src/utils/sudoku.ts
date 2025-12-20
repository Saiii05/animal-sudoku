import { Cell, Difficulty } from "../types";

const EMPTY = 0;

function shuffle(arr: number[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function isValid(grid: number[][], r: number, c: number, n: number) {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === n || grid[i][c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (grid[br + i][bc + j] === n) return false;
  return true;
}

function solve(grid: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === EMPTY) {
        for (const n of shuffle([1,2,3,4,5,6,7,8,9])) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            if (solve(grid)) return true;
            grid[r][c] = EMPTY;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSudoku(difficulty: Difficulty) {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(EMPTY));
  solve(grid);

  const solution = grid.map(r => [...r]);

  let remove =
    difficulty === "Easy" ? 36 :
    difficulty === "Medium" ? 46 : 54;

  while (remove > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (grid[r][c] !== EMPTY) {
      grid[r][c] = EMPTY;
      remove--;
    }
  }

  const cells: Cell[][] = grid.map((row, r) =>
    row.map((v, c) => ({
      row: r,
      col: c,
      value: v === EMPTY ? null : v,
      solution: solution[r][c],
      isGiven: v !== EMPTY,
      notes: [],
      isError: false,
    }))
  );

  return { initial: cells };
}

