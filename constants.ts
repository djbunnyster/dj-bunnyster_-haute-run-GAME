
export const GAME_SPEED_INITIAL = 3.5; // Slower start
export const BPM = 123; 
export const LANES = 3;
export const LANE_X_POSITIONS = [20, 50, 80]; 
export const PLAYER_Y = 85; 
export const SPAWN_INTERVAL_MS = (60 / BPM) * 1000 * 1.5; // Slightly slower rhythm for spawning
export const START_DELAY_MS = 3000; // 3 seconds of safety at start

export const COLORS = {
  PRIMARY: '#3b82f6', // Neon Blue
  SECONDARY: '#ffffff', // White
  ACCENT: '#0f172a', // Dark Navy
  OBSTACLE: '#ff4d4d', // Bright Red for danger
  GEM: '#00f2ff', // Cyan for gems
};
