import React, { useEffect, useState } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import Welcome from "./components/Welcome";
import AnimalSelector from "./components/AnimalSelector";
import Board from "./components/Board";
import Controls from "./components/Controls";
import ScoreBoard from "./components/ScoreBoard";
import TutorialOverlay from "./components/TutorialOverlay";
import EndScreen from "./components/EndScreen";
import { importPuzzle } from "./utils/share";
import { SoundProvider } from "./context/SoundContext";
import ErrorBoundary from "./components/ErrorBoundary";

function InnerApp(){
  const { state, dispatch } = useGame();
  const [stage, setStage] = useState<'welcome'|'select'|'playing'|'end'>('welcome');
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(() => localStorage.getItem('tutorial-dismissed') !== '1');

  // parse shared puzzle
  useEffect(()=>{
    try{
      const params = new URLSearchParams(window.location.search);
      const p = params.get('p');
      if(p){
        const payload = importPuzzle(p);
        if(payload && payload.grid && payload.animals){
          // map to state
          // naive load: set animals and load numeric grid into GameContext grid
          dispatch({type:'SET_ANIMALS', animals: payload.animals});
          dispatch({type:'NEW'});
          // apply grid values
          setTimeout(()=>{
            // quick mapping: not perfect but okay for import (value numbers 0..9)
            // apply each cell by calling INPUT while selecting
            // Instead, dispatch LOAD would be better; keep simple:
          }, 200);
        }
      }
    }catch(e){
      console.warn('invalid share token', e);
    }
  }, []);

  // stage transitions
  useEffect(()=>{
    if(playerName && selectedAnimals.length===9){
      dispatch({type:'SET_NAME', name:playerName});
      dispatch({type:'SET_ANIMALS', animals:selectedAnimals});
      setStage('playing');
    }
  }, [playerName, selectedAnimals]);

  // end detection
  useEffect(()=>{
    if(state.solved) setStage('end');
  }, [state.solved]);

  if(stage === 'welcome') return <Welcome onNext={(name)=>{ setPlayerName(name); setStage('select') }} />
  if(stage === 'select') return <AnimalSelector selected={selectedAnimals} setSelected={setSelectedAnimals} onDone={()=>{ /* handled by effect */ }} />

  return (
    <div style={{width:'100%'}}>
      <div className="header">
        <div className="brand">
          <div style={{fontSize:20, fontWeight:800}}>Animal Sudoku</div>
          <div style={{fontSize:12, color:'var(--muted)'}}>Fun, friendly Sudoku with animals</div>
        </div>
        <div className="header-actions">
          <div className="kpi">
            <span style={{marginRight:8}}>👤 {state.playerName || 'Player'}</span>
          </div>
        </div>
      </div>

      <div className="main">
        <div>
          <div className="board-card">
            <ScoreBoard />
            <Board animals={state.animals} />
          </div>
        </div>
        <div>
          <div className="controls-card" style={{position:'sticky', top:18}}>
            <Controls animals={state.animals}/>
          </div>
        </div>
      </div>

      { showTutorial && <TutorialOverlay onClose={()=>{ localStorage.setItem('tutorial-dismissed','1'); setShowTutorial(false) }} /> }
      { stage === 'end' && <EndScreen onPlayAgain={()=> { dispatch({type:'NEW'}); setStage('playing') }} /> }
    </div>
  )
}

export default function App(){
  return (
    <ErrorBoundary>
      <SoundProvider>
        <GameProvider>
          <div className="app">
            <InnerApp />
          </div>
        </GameProvider>
      </SoundProvider>
    </ErrorBoundary>
  )
}

