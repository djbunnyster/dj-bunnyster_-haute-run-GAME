
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameObject, Player } from './types';
import { 
  GAME_SPEED_INITIAL, 
  LANE_X_POSITIONS, 
  PLAYER_Y, 
  SPAWN_INTERVAL_MS,
  START_DELAY_MS
} from './constants';
import { audio } from './services/audio';

interface GameProps {
  onGameOver: (score: number) => void;
}

const BackgroundScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audio.getAnalyser();
    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength);
    
    let offset = 0;
    let frameId: number;

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      let bassIntensity = 0;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < 5; i++) bassIntensity += dataArray[i];
        bassIntensity /= 5;
      }

      // Maximum Contrast Dark Luxury Palette
      const extremeDark = '#000001'; 
      const glowCyan = '#00ffff';
      const towersGlow = '#0a0022';

      ctx.fillStyle = extremeDark;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const horizonY = canvas.height * 0.45;

      // DISTANT SILHOUETTE OF PARIS (EIFFEL TOWER)
      const centerX = canvas.width / 2;
      const towerBaseWidth = 120;
      const towerHeight = 220 + (bassIntensity / 4);
      
      ctx.save();
      ctx.globalAlpha = 0.4 + (bassIntensity / 512);
      ctx.strokeStyle = '#330066';
      ctx.lineWidth = 1;

      // Draw Stylized Eiffel Tower (Wireframe)
      ctx.beginPath();
      // Left leg
      ctx.moveTo(centerX - towerBaseWidth/2, horizonY);
      ctx.quadraticCurveTo(centerX - 10, horizonY - towerHeight * 0.4, centerX - 5, horizonY - towerHeight);
      // Right leg
      ctx.moveTo(centerX + towerBaseWidth/2, horizonY);
      ctx.quadraticCurveTo(centerX + 10, horizonY - towerHeight * 0.4, centerX + 5, horizonY - towerHeight);
      // Top point
      ctx.lineTo(centerX - 5, horizonY - towerHeight);
      ctx.stroke();

      // Horizontal tiers of the tower
      for(let t = 0.2; t < 0.9; t += 0.2) {
        const y = horizonY - towerHeight * t;
        const w = towerBaseWidth * (1 - t) * 0.5;
        ctx.beginPath();
        ctx.moveTo(centerX - w, y);
        ctx.lineTo(centerX + w, y);
        ctx.stroke();
      }

      // Tower Beacon
      const beaconGlow = ctx.createRadialGradient(centerX, horizonY - towerHeight, 0, centerX, horizonY - towerHeight, 30);
      beaconGlow.addColorStop(0, '#ffffff');
      beaconGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = beaconGlow;
      ctx.globalAlpha = 0.5 + Math.sin(Date.now()/200) * 0.4;
      ctx.beginPath();
      ctx.arc(centerX, horizonY - towerHeight, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // HIGH-FIDELITY CYBER GRID
      const activeColor = bassIntensity > 40 ? glowCyan : '#003333';
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.15 + (bassIntensity / 800);

      offset = (offset + 6 + (bassIntensity / 20)) % 100;

      for (let i = 0; i < 25; i++) {
        const y = horizonY + Math.pow(i / 25, 2.5) * (canvas.height - horizonY) + offset;
        if (y > horizonY && y < canvas.height) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      const vanishingPointX = canvas.width / 2;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingPointX + i * 140, canvas.height);
        ctx.lineTo(vanishingPointX + i * 15, horizonY);
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" width={1200} height={800} />;
};

const ClothingObstacle: React.FC<{ id: string }> = ({ id }) => {
  const types = ['tshirt', 'pants', 'briefs'];
  const type = types[id.charCodeAt(0) % 3];
  const colors = ['#ff0055', '#ffcc00', '#00ff66', '#ff33ff'];
  const color = colors[id.charCodeAt(1) % colors.length];

  return (
    <div className="relative group">
      <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
        {type === 'tshirt' && (
          <path d="M20 20 L40 10 L60 10 L80 20 L80 40 L70 40 L70 90 L30 90 L30 40 L20 40 Z" fill={color} />
        )}
        {type === 'pants' && (
          <path d="M30 10 L70 10 L75 90 L55 90 L50 50 L45 90 L25 90 Z" fill={color} />
        )}
        {type === 'briefs' && (
          <path d="M20 30 L80 30 L75 60 L50 80 L25 60 Z" fill={color} />
        )}
      </svg>
      <div className="absolute inset-0 bg-white/10 blur-xl opacity-20"></div>
    </div>
  );
};

const RabbitRenderer: React.FC<{ lane: number; y: number }> = ({ lane, y }) => (
  <div 
    className="absolute transition-all duration-150 ease-out transform -translate-x-1/2 z-20"
    style={{ left: `${LANE_X_POSITIONS[lane]}%`, top: `${y}%` }}
  >
    <style>{`
      @keyframes ear-twitch { 0%, 90%, 100% { transform: rotate(0deg); } 95% { transform: rotate(-5deg); } }
      @keyframes tail-flick { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
      @keyframes rabbit-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
      .animate-ear { animation: ear-twitch 4s infinite; }
      .animate-tail { animation: tail-flick 0.5s infinite; }
      .animate-body { animation: rabbit-bounce 0.435s infinite; }
    `}</style>
    <div className="relative w-40 h-40 animate-body">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]">
        <path d="M75 85 C65 95 30 95 20 80 C15 70 15 50 30 40 C35 35 45 35 55 40 C65 45 80 55 80 75 C80 80 78 83 75 85" fill="white" />
        <circle cx="18" cy="78" r="6" fill="#f1f5f9" className="animate-tail" />
        <circle cx="30" cy="85" r="7" fill="#f8fafc" />
        <circle cx="65" cy="85" r="9" fill="#f8fafc" />
        <path d="M55 40 C60 25 75 25 80 40 C83 50 80 60 70 65" fill="white" />
        <g className="animate-ear" style={{ transformOrigin: '60px 28px' }}>
          <path d="M60 28 Q55 -12 42 18" fill="#f8fafc" stroke="white" strokeWidth="1.5" />
          <path d="M62 25 Q58 5 52 16" fill="#00ffff" opacity="0.4" />
        </g>
        <g className="animate-ear" style={{ transformOrigin: '70px 25px', animationDelay: '1s' }}>
          <path d="M70 25 Q78 -18 88 18" fill="#f8fafc" stroke="white" strokeWidth="1.5" />
          <path d="M72 22 Q78 5 83 16" fill="#00ffff" opacity="0.4" />
        </g>
        <circle cx="78" cy="48" r="3.5" fill="#00ffff" className="animate-pulse shadow-[0_0_15px_#00ffff]" />
        <circle cx="78" cy="48" r="1" fill="white" opacity="0.8" />
        <circle cx="85" cy="55" r="2.5" fill="#fda4af" />
      </svg>
    </div>
  </div>
);

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const [player, setPlayer] = useState<Player>({ lane: 1, y: PLAYER_Y, isJumping: false, score: 0 });
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [strobe, setStrobe] = useState(false);
  
  const requestRef = useRef<number>(undefined);
  const lastTimeRef = useRef<number>(performance.now());
  const speedRef = useRef(GAME_SPEED_INITIAL);
  const lastSpawnRef = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(Date.now());
  const scoreRef = useRef(0);
  const laneRef = useRef(1);
  const objectsRef = useRef<GameObject[]>([]);

  useEffect(() => {
    audio.init();
    audio.startBeat();
    const strobeInterval = setInterval(() => {
      setStrobe(true);
      setTimeout(() => setStrobe(false), 25);
    }, 435); 
    return () => {
      clearInterval(strobeInterval);
      audio.stopBeat();
    };
  }, []);

  const moveLeft = useCallback(() => {
    laneRef.current = Math.max(0, laneRef.current - 1);
    setPlayer(prev => ({ ...prev, lane: laneRef.current }));
  }, []);

  const moveRight = useCallback(() => {
    laneRef.current = Math.min(2, laneRef.current + 1);
    setPlayer(prev => ({ ...prev, lane: laneRef.current }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') moveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd') moveRight();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight]);

  const spawnObject = useCallback((time: number) => {
    const isSafePeriod = Date.now() - gameStartTimeRef.current < START_DELAY_MS;
    const lane = Math.floor(Math.random() * 3);
    const type = (isSafePeriod || Math.random() > 0.4) ? 'GEM' : 'OBSTACLE';
    
    const newObj: GameObject = {
      id: Math.random().toString(36).substr(2, 9),
      x: LANE_X_POSITIONS[lane],
      y: -10,
      width: 8,
      height: 4,
      type
    };
    
    objectsRef.current.push(newObj);
    setObjects([...objectsRef.current]);
    lastSpawnRef.current = time;
  }, []);

  const update = useCallback((time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (deltaTime > 100) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    speedRef.current = Math.min(speedRef.current + 0.00035 * deltaTime, 24);

    if (time - lastSpawnRef.current > (SPAWN_INTERVAL_MS * 0.7)) { 
      spawnObject(time);
    }

    let collidedGameOver = false;
    const nextObjects: GameObject[] = [];

    for (let i = 0; i < objectsRef.current.length; i++) {
      const obj = objectsRef.current[i];
      const nextY = obj.y + speedRef.current * (deltaTime / 16.67);
      
      if (nextY > 110) continue;

      const laneIdx = LANE_X_POSITIONS.indexOf(obj.x);
      const isAtPlayerY = nextY > PLAYER_Y - 6 && nextY < PLAYER_Y + 6;
      
      if (isAtPlayerY && laneIdx === laneRef.current) {
        if (obj.type === 'OBSTACLE') {
          collidedGameOver = true;
          break;
        } else {
          audio.playNoteCollect();
          scoreRef.current += 15;
          setPlayer(p => ({ ...p, score: scoreRef.current }));
          continue; 
        }
      }
      
      obj.y = nextY;
      nextObjects.push(obj);
    }

    objectsRef.current = nextObjects;
    setObjects([...objectsRef.current]);

    if (collidedGameOver) {
      audio.playHit();
      cancelAnimationFrame(requestRef.current!);
      onGameOver(scoreRef.current);
    } else {
      requestRef.current = requestAnimationFrame(update);
    }
  }, [onGameOver, spawnObject]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [update]);

  const getNoteColor = (id: string) => {
    const colors = ['text-cyan-400', 'text-magenta-500', 'text-yellow-400', 'text-lime-400', 'text-white'];
    return colors[id.charCodeAt(0) % colors.length];
  };

  return (
    <div className={`relative w-full h-full overflow-hidden transition-all duration-75 ${strobe ? 'bg-white/5' : 'bg-black'}`}>
      <BackgroundScene />
      
      <div className="absolute inset-0 flex justify-around items-end opacity-10 pointer-events-none">
        {LANE_X_POSITIONS.map(x => (
          <div key={x} className="w-[1px] h-full bg-gradient-to-t from-cyan-500 to-transparent"></div>
        ))}
      </div>

      <div className="absolute top-10 left-10 z-40">
        <span className="text-white text-[10px] tracking-[0.8em] uppercase font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">PARIS MIDNIGHT // MIDI TECHNO</span>
        <div className="text-8xl font-sync font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] tabular-nums">{player.score}</div>
      </div>

      {objects.map(obj => (
        <div 
          key={obj.id} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75" 
          style={{ 
            left: `${obj.x}%`, 
            top: `${obj.y}%`,
            scale: `${0.6 + (obj.y / 150)}`
          }}
        >
          {obj.type === 'GEM' ? (
            <div className={`text-5xl ${getNoteColor(obj.id)} drop-shadow-[0_0_15px_currentColor] animate-bounce font-serif select-none`}>
              {['♪', '♫', '♬', '♩'][obj.id.charCodeAt(1) % 4]}
            </div>
          ) : (
            <ClothingObstacle id={obj.id} />
          )}
        </div>
      ))}

      <RabbitRenderer lane={player.lane} y={player.y} />

      <div className="absolute inset-0 z-30 flex">
        <div className="w-1/2 h-full cursor-pointer hover:bg-white/5 transition-colors" onClick={moveLeft}></div>
        <div className="w-1/2 h-full cursor-pointer hover:bg-white/5 transition-colors" onClick={moveRight}></div>
      </div>
    </div>
  );
};

export default Game;
