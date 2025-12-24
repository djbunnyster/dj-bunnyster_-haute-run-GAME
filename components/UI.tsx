
import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { getPerformanceReview } from '../services/gemini';
import { audio } from '../services/audio';

interface UIProps {
  state: GameState;
  score: number;
  highScore: number;
  onStart: () => void;
  onMenu: () => void;
}

const UI: React.FC<UIProps> = ({ state, score, highScore, onStart, onMenu }) => {
  const [review, setReview] = useState<string | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    if (state === GameState.GAME_OVER) {
      setLoadingReview(true);
      getPerformanceReview(score).then(res => {
        setReview(res);
        setLoadingReview(false);
      });
    }
  }, [state, score]);

  const handleStart = () => {
    audio.init();
    onStart();
  };

  if (state === GameState.START) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-10 p-8 text-center bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800 rounded-full blur-[150px] animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 space-y-4 max-w-full overflow-hidden">
          <p className="text-red-500 tracking-[1.2em] uppercase text-[10px] font-bold">Follow the White Rabbit</p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-sync font-bold tracking-tighter leading-tight text-white drop-shadow-[0_0_40px_rgba(255,0,0,0.5)] whitespace-nowrap">
            DJ BUNNYSTER
          </h1>
          <p className="text-xl font-light tracking-[0.5em] text-slate-400 uppercase italic">Haute Couture // Available Now</p>
        </div>

        <div className="z-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <a 
            href="https://open.spotify.com/track/4uQ0DM7aKZtRvTtZUN51Dj?si=f5ff9b21c16f439f" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-6 py-3 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/30 rounded-full transition-all group"
          >
            <span className="text-[#1DB954] text-xl">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308c-.222.363-.694.475-1.055.252-2.812-1.718-6.35-2.107-10.516-1.154-.413.095-.827-.16-.922-.573-.095-.413.16-.827.573-.922 4.557-1.042 8.454-.602 11.666 1.355.362.223.475.694.254 1.055zm1.469-3.257c-.28.455-.878.6-1.332.32-3.219-1.978-8.127-2.55-11.932-1.396-.51.155-1.043-.135-1.198-.645-.154-.51.135-1.043.645-1.198 4.354-1.321 9.754-.678 13.468 1.6 1.144-.701 1.288-2.203.349-3.32zm.127-3.376c-3.858-2.29-10.231-2.502-13.978-1.365-.592.18-1.222-.152-1.402-.743-.18-.592.152-1.222.743-1.402 4.298-1.305 11.34-1.058 15.772 1.571.533.317.708 1.004.391 1.537-.317.533-1.004.708-1.537.391z"/></svg>
            </span>
            <span className="text-[10px] text-white font-bold tracking-widest uppercase">Spotify</span>
          </a>
          <a 
            href="https://music.apple.com/us/song/haute-couture/1861159852" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-6 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-full transition-all group"
          >
            <span className="text-red-500 text-xl">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.44 2.8c-1.41.09-2.61.9-3.26 1.83C8.53 5.56 8.35 6.78 8.44 8c1.39-.08 2.66-.9 3.32-1.85.65-.95.83-2.19.68-3.35zM21 16.5c0-1.93-1.03-3.62-2.57-4.54-1.05-.62-2.23-.96-3.43-1.46-1.12-.46-2.23-.93-3.35-1.39-1.29-.53-2.58-1.07-3.87-1.61-1.02-.42-1.78.36-1.78 1.39v10.11c0 2.21 1.79 4 4 4 2.21 0 4-1.79 4-4V11.5c1.23.51 2.45 1.02 3.68 1.53 1.29.54 2.58 1.08 3.87 1.62.94.39 1.45 1.13 1.45 2.11 0 1.93-1.57 3.5-3.5 3.5-1.93 0-3.5-1.57-3.5-3.5 0-.55.45-1 1-1s1 .45 1 1c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5z"/></svg>
            </span>
            <span className="text-[10px] text-white font-bold tracking-widest uppercase">Apple Music</span>
          </a>
        </div>

        <button 
          onClick={handleStart}
          className="z-10 group relative px-20 py-6 overflow-hidden bg-white rounded-full transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
        >
          <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
          <span className="relative z-10 text-slate-950 group-hover:text-white font-sync font-bold text-lg tracking-widest">
            FOLLOW THE WHITE RABBIT
          </span>
        </button>

        <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl w-full">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center">
            <span className="text-3xl mb-2 text-white drop-shadow-[0_0_10px_white]">♪</span>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-500">The Runway</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-tight">Sync the beat. Collect the silhouette. 15 points per drop.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center">
            <div className="w-12 h-2 bg-red-600 shadow-[0_0_15px_red] mb-3"></div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">CLOTHES</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-tight">Avoid falling items of clothing. The rhythm demands perfection.</p>
          </div>
        </div>

        <div className="z-10 flex space-x-12 text-[10px] text-slate-600 uppercase font-bold tracking-widest">
          <span>A / D Movement</span>
          <span>•</span>
          <span>Sub-Bass Techno 123 BPM</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-2 space-y-1 md:space-y-3 bg-[#020617] animate-in fade-in duration-500 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#3b82f633_0%,_transparent_70%)]"></div>
      </div>

      {/* PERFORMANCE TERMINATED HEADER - Ultra Compact */}
      <div className="z-10">
        <div className="border border-red-500/80 px-4 py-0 mb-1 inline-block">
          <p className="text-red-500 text-[8px] md:text-[10px] font-bold tracking-[0.4em] uppercase leading-relaxed">PERFORMANCE TERMINATED</p>
        </div>
      </div>

      {/* BACKSTAGE ACCESS TITLE - Scaled for zero clipping */}
      <div className="z-10">
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-sync font-bold uppercase tracking-tighter text-white leading-none mb-1">
          BACKSTAGE <span className="text-[#3b82f6]">ACCESS</span>
        </h2>
      </div>

      {/* STATS PANEL - Highly tight */}
      <div className="z-10 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-10 lg:space-x-20 w-full max-w-4xl relative">
        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] mb-0.5">SYNC POINTS</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-sync font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{score}</span>
        </div>
        
        <div className="hidden md:block w-[1px] h-12 md:h-16 bg-slate-800/40"></div>

        <div className="flex flex-col items-center">
          <span className="text-slate-500 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] mb-0.5">RECORD FLOW</span>
          <span className="text-4xl md:text-6xl lg:text-8xl font-sync font-bold text-[#3b82f6] leading-none drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">{highScore}</span>
        </div>
      </div>

      {/* CRITIC REVIEW BOX - Compressed height */}
      <div className="z-10 max-w-lg lg:max-w-2xl w-full mt-1 md:mt-3 px-2">
        <div className="relative bg-[#050b1d] border border-slate-800/80 p-3 md:p-5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#3b82f6] mb-2 md:mb-3 font-bold text-center border-b border-slate-800/30 pb-1 leading-none">
            CRITIC'S REVIEW // HAUTE COUTURE
          </p>
          <div className="min-h-[50px] md:min-h-[70px] flex items-center justify-center">
            <p className="text-white text-[10px] md:text-sm lg:text-base leading-snug font-light text-center italic tracking-wide">
              {loadingReview ? (
                <span className="animate-pulse text-slate-600 uppercase tracking-widest text-[8px]">Consulting the front row elite...</span>
              ) : (
                `"${review || "Your runway walk lacked the necessary conviction for a DJ Bunnester stage."}"`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS - Compact and clearly visible */}
      <div className="z-10 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-3 md:mt-5 w-full max-w-xs md:max-w-md pb-2">
        <button 
          onClick={handleStart} 
          className="flex-1 py-2.5 md:py-3.5 bg-[#0066ff] text-white font-sync font-bold text-[9px] md:text-xs tracking-[0.2em] rounded-full hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(0,102,255,0.25)]"
        >
          RETRY SHOW
        </button>
        <button 
          onClick={onMenu} 
          className="flex-1 py-2.5 md:py-3.5 bg-transparent border border-slate-800 text-white font-sync font-bold text-[9px] md:text-xs tracking-[0.2em] rounded-full hover:bg-slate-800 transition-all active:scale-95"
        >
          MAIN STAGE
        </button>
      </div>
    </div>
  );
};

export default UI;
