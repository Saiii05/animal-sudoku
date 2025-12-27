import React from "react";

export default function ShareModal({onClose, url}:{onClose:()=>void, url:string}){
  // url is optional; main share function writes to clipboard
  return (
    <div className="overlay" onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <h3>Share</h3>
        <p>Link copied to clipboard. Paste anywhere to share your puzzle.</p>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

