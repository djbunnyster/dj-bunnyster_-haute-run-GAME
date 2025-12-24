
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'GEM' | 'OBSTACLE';
}

export interface Player {
  lane: number; // 0, 1, 2
  y: number;
  isJumping: boolean;
  score: number;
}

export interface GameConfig {
  bpm: number;
  laneWidth: number;
  speed: number;
}
