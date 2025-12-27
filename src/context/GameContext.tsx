import React, { createContext, useContext, useEffect, useReducer } from "react";
import { generate } from "../utils/sudoku";
import type { Cell, Difficulty } from "../types";

type State = {
  grid: Cell[][];
  history: Cell[][][];
  pointer: number;
  selected: [number, number] | null;
  time: number;
  mistakes: number;
  solved: boolean;
  difficulty: Difficulty;
  playerName: string | null;
  animals: string[]; // 9 selected emojis
  draggingAnimalIndex: number | null;
};

type Action =
  | { type: "NEW"; difficulty?: Difficulty }
  | { type: "LOAD"; state: State }
  | { type: "SELECT"; r:number; c:number }
  | { type: "INPUT"; v:number | null }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "HINT" }
  | { type: "SOLVE_STEP" }
  | { type: "TICK" }
  | { type: "SET_NAME"; name:string }
  | { type: "SET_ANIMALS"; animals:string[] }
  | { type: "SET_DRAG"; idx:number | null };

const initial = {
  grid: [],
  history: [],
  pointer: -1,
  selected: null,
  time: 0,
  mistakes: 0,
  solved: false,
  difficulty: "Easy" as Difficulty,
  playerName: null,
  animals: [],
  draggingAnimalIndex: null
};

const GameContext = createContext<any>(null);

function cloneGrid(g:Cell[][]){ return g.map(r=>r.map(c=>({...c}))) }

function reducer(state:State, action:Action):State {
  switch(action.type){
    case "NEW": {
      const diff = action.difficulty ?? state.difficulty;
      const grid = generate(diff);
      const hist = [cloneGrid(grid)];
      return {...state, grid, history:hist, pointer:0, selected:null, time:0, mistakes:0, solved:false, difficulty:diff};
    }
    case "LOAD": return action.state;
    case "SELECT": return {...state, selected:[action.r, action.c]};
    case "INPUT": {
      if(!state.selected) return state;
      const [r,c] = state.selected;
      const g = cloneGrid(state.grid);
      const cell = g[r][c];
      if(cell.given) return state;
      cell.value = action.v;
      cell.error = action.v !== null && action.v !== cell.solution;
      const isSolved = g.every(row=>row.every(cc=>cc.value === cc.solution));
      const newHist = state.history.slice(0, state.pointer+1);
      newHist.push(cloneGrid(g));
      return {...state, grid:g, history:newHist, pointer:newHist.length-1, mistakes: cell.error ? state.mistakes+1 : state.mistakes, solved:isSolved};
    }
    case "UNDO": {
      if(state.pointer <= 0) return state;
      const p = state.pointer - 1;
      return {...state, grid: cloneGrid(state.history[p]), pointer:p};
    }
    case "REDO": {
      if(state.pointer >= state.history.length-1) return state;
      const p = state.pointer + 1;
      return {...state, grid: cloneGrid(state.history[p]), pointer:p};
    }
    case "HINT": {
      // find first selected empty, else first empty
      let r = -1, c = -1;
      if(state.selected){ [r,c] = state.selected; if(state.grid[r][c].value !== null){ r = -1 } }
      if(r === -1){ outer: for(let i=0;i<9;i++) for(let j=0;j<9;j++) if(state.grid[i][j].value===null){ r=i; c=j; break outer } }
      if(r===-1) return state;
      const g = cloneGrid(state.grid);
      g[r][c].value = g[r][c].solution;
      g[r][c].error = false;
      const newHist = state.history.slice(0, state.pointer+1); newHist.push(cloneGrid(g));
      return {...state, grid:g, history:newHist, pointer:newHist.length-1};
    }
    case "SOLVE_STEP": {
      const g = cloneGrid(state.grid);
      for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
          if(g[i][j].value === null){
            g[i][j].value = g[i][j].solution;
            g[i][j].error = false;
            const newHist = state.history.slice(0, state.pointer+1); newHist.push(cloneGrid(g));
            return {...state, grid:g, history:newHist, pointer:newHist.length-1, solved: g.every(row=>row.every(c=>c.value===c.solution))};
          }
        }
      }
      return {...state, solved:true};
    }
    case "TICK": return {...state, time: state.time+1};
    case "SET_NAME": return {...state, playerName:action.name};
    case "SET_ANIMALS": return {...state, animals:action.animals};
    case "SET_DRAG": return {...state, draggingAnimalIndex:action.idx};
    default: return state;
  }
}

export function GameProvider({children}:{children:React.ReactNode}){
  const [state, dispatch] = useReducer(reducer, initial as State);

  useEffect(()=> {
    // if localStorage has a shared puzzle param, handled by App (import). If no grid loaded, create new
    if(!state.grid || state.grid.length===0) dispatch({type:"NEW"});
    const t = setInterval(()=> dispatch({type:"TICK"}), 1000);
    return ()=> clearInterval(t);
  }, []);

  return <GameContext.Provider value={{state, dispatch}}>{children}</GameContext.Provider>
}

export const useGame = ()=> useContext(GameContext);

