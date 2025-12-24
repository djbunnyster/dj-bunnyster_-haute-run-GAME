
import React, { useState, useEffect, useCallback } from 'react';
import Game from './Game';
import UI from './components/UI';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const startGame = useCallback(() => {
    setScore(0);
    setGameState(GameState.PLAYING);
  }, []);

  const gameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
    }
    setGameState(GameState.GAME_OVER);
  }, [highScore]);

  const returnToMenu = useCallback(() => {
    setGameState(GameState.START);
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-white selection:bg-blue-500/30">
      {gameState === GameState.PLAYING ? (
        <Game onGameOver={gameOver} />
      ) : (
        <UI 
          state={gameState} 
          score={score} 
          highScore={highScore} 
          onStart={startGame} 
          onMenu={returnToMenu}
        />
      )}
      
      {/* Visual background noise elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
    </div>
  );
};

export default App;
