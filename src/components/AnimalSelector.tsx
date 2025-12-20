import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GALLERY_POOL, DEFAULT_ANIMALS } from '../utils/defaults';
import { Animal } from '../types';
import { X, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
export const AnimalSelector: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { animals } = useGame();
  const [selection, setSelection] = useState<Animal[]>(animals);
  const [customEmoji, setCustomEmoji] = useState('');
  const toggleAnimal = (animal: Animal) => {
    const exists = selection.find(a => a.id === animal.id);
    if (exists) { if (selection.length > 1) setSelection(selection.filter(a => a.id !== animal.id)); }
    else { if (selection.length < 9) setSelection([...selection, animal]); }
  };
  const addCustom = () => {
    if (!customEmoji) return;
    const newAnimal: Animal = { id: `custom-${Date.now()}`, char: customEmoji, name: 'Custom', isCustom: true };
    if (selection.length < 9) { setSelection([...selection, newAnimal]); setCustomEmoji(''); }
  };
  const handleSave = () => { if (selection.length === 9) { localStorage.setItem('animal-sudoku-animals', JSON.stringify(selection)); window.location.reload(); } };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold dark:text-white">Choose 9 Animals</h2><button onClick={onClose}><X className="w-6 h-6 dark:text-white" /></button></div>
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {selection.map(a => (
            <div key={a.id} className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded text-2xl animate-pop-in relative">
              {a.char}<button onClick={() => toggleAnimal(a)} className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">×</button>
            </div>
          ))}
          {Array.from({ length: 9 - selection.length }).map((_, i) => <div key={i} className="w-10 h-10 border-2 border-dashed border-gray-300 rounded" />)}
        </div>
        <div className="text-center mb-4 h-6 text-sm">{selection.length !== 9 ? <span className="text-red-500">Select exactly 9 animals</span> : <span className="text-green-500 font-bold">Ready!</span>}</div>
        <h3 className="font-semibold mb-2 dark:text-slate-200">Gallery</h3>
        <div className="grid grid-cols-6 gap-2 mb-6">
          {GALLERY_POOL.map(animal => {
            const isSelected = selection.find(a => a.id === animal.id);
            return <button key={animal.id} onClick={() => toggleAnimal(animal)} disabled={!isSelected && selection.length >= 9} className={clsx("h-12 w-12 text-2xl rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition", isSelected ? "bg-blue-100 ring-2 ring-blue-500" : "opacity-80")}>{animal.char}</button>
          })}
        </div>
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm dark:text-slate-200">Custom Emoji</h3>
          <div className="flex gap-2"><input type="text" maxLength={2} value={customEmoji} onChange={(e) => setCustomEmoji(e.target.value)} placeholder="🦄" className="w-16 p-2 text-center text-xl border rounded dark:bg-slate-900 dark:text-white" /><button onClick={addCustom} disabled={selection.length >= 9 || !customEmoji} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 disabled:opacity-50">Add</button></div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setSelection(DEFAULT_ANIMALS)} className="flex-1 py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"><RefreshCw size={18} /> Defaults</button>
           <button onClick={handleSave} disabled={selection.length !== 9} className="flex-1 py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">Save & Play</button>
        </div>
      </div>
    </div>
  );
};
