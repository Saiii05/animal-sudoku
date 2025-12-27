import { Cell, Difficulty } from "../types";

const SIZE = 9;
const BOX = 3;
const EMPTY = 0;

function range(n:number){ return Array.from({length:n}, (_,i)=>i) }

function shuffle<T>(arr:T[]){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function emptyGrid(): Cell[][] {
  return range(SIZE).map(r => range(SIZE).map(c => ({ row:r, col:c, value:null, solution:0, given:false, error:false })));
}

function inRow(grid:number[][], r:number, v:number){
  return grid[r].some(x => x===v);
}
function inCol(grid:number[][], c:number, v:number){
  return grid.some(row => row[c]===v);
}
function inBox(grid:number[][], r:number, c:number, v:number){
  const br = Math.floor(r/BOX)*BOX, bc = Math.floor(c/BOX)*BOX;
  for(let i=0;i<BOX;i++) for(let j=0;j<BOX;j++) if(grid[br+i][bc+j]===v) return true;
  return false;
}

export function isValidMove(grid:number[][], r:number, c:number, v:number){
  if(v===EMPTY) return true;
  if(inRow(grid, r, v)) return false;
  if(inCol(grid, c, v)) return false;
  if(inBox(grid, r, c, v)) return false;
  return true;
}

export function solveGrid(grid:number[][]): boolean {
  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){
      if(grid[r][c]===EMPTY){
        for(let n=1;n<=9;n++){
          if(isValidMove(grid, r, c, n)){
            grid[r][c]=n;
            if(solveGrid(grid)) return true;
            grid[r][c]=EMPTY;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generate(difficulty:Difficulty='Easy'): Cell[][] {
  // start with empty numeric grid
  const g:number[][] = range(SIZE).map(()=>range(SIZE).map(()=>EMPTY));

  // fill diagonal boxes to reduce backtracking
  for(let k=0;k<SIZE;k+=BOX){
    const ids = shuffle([1,2,3,4,5,6,7,8,9]);
    for(let i=0;i<BOX;i++) for(let j=0;j<BOX;j++) g[k+i][k+j] = ids[i*BOX+j];
  }

  // solve to get a full board
  const ok = solveGrid(g);
  if(!ok) throw new Error('generator failed');

  const solved = g.map(r => r.slice());

  // remove cells to create puzzle
  let removeCount = difficulty === 'Easy' ? 36 : difficulty === 'Medium' ? 46 : 54;
  while(removeCount>0){
    const r = Math.floor(Math.random()*SIZE);
    const c = Math.floor(Math.random()*SIZE);
    if(g[r][c] !== EMPTY){
      g[r][c] = EMPTY;
      removeCount--;
    }
  }

  // map to Cell objects
  return range(SIZE).map(r => range(SIZE).map(c => ({
    row:r, col:c,
    value: g[r][c]===EMPTY ? null : g[r][c],
    solution: solved[r][c],
    given: g[r][c] !== EMPTY,
    error: false
  })));
}

