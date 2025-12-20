import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Copy, Check } from 'lucide-react';
export const ShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, animals } = useGame();
  const [copied, setCopied] = useState(false);
  const generateLink = () => {
    const payload = { grid: state.grid.map(row => row.map(c => c.value || 0)), animals: animals };
    const json = JSON.stringify(payload);
    const b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
    return `${window.location.origin}/?data=${b64}`;
  };
  const link = generateLink();
  const handleCopy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold mb-4 dark:text-white">Share Puzzle</h3>
        <p className="text-sm text-slate-500 mb-4">Send this link to a friend to play the same puzzle with your animals!</p>
        <div className="flex gap-2 mb-6"><input readOnly value={link} className="flex-1 bg-slate-100 dark:bg-slate-900 border rounded px-3 text-xs text-slate-600 dark:text-slate-300" /><button onClick={handleCopy} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div>
        <button onClick={onClose} className="w-full py-2 border rounded hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white">Close</button>
      </div>
    </div>
  );
};
