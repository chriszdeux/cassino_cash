export type GameId =
  | 'neon-slots'
  | 'cyber-roulette'
  | 'crystal-burst'
  | 'binary-flip'
  | 'turbo-dice'
  | 'void-crash'
  | 'pulse-match'
  | 'quick-ladder'
  | 'orb-miner'
  | 'signal-guess';

export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  theme: string;
}

export interface PlayRequest {
  gameId: GameId;
  betAmount: number;
  currentBalance: number;
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface PlayResponse {
  success: boolean;
  gameId: GameId;
  betAmount: number;
  winAmount: number;
  newBalance: number;
  resultData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  message?: string;
  error?: string;
}
