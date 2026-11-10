export type CellKind = 'floor' | 'wall' | 'crate';
export type GamePhase = 'waiting' | 'running' | 'finished';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameConnectionState =
  'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

export interface GameCommandRejection {
  commandId: string;
  message: string;
}

export interface Cell {
  x: number;
  y: number;
  kind: CellKind;
}
export interface PlayerState {
  playerId: string;
  x: number;
  y: number;
  lives: number;
  isAlive: boolean;
}
export interface BombState {
  id: string;
  ownerPlayerId: string;
  x: number;
  y: number;
  range: number;
  placedAtUtc: string;
  explodesAtUtc: string;
}
export interface ExplosionState {
  id: string;
  cells: Pick<Cell, 'x' | 'y'>[];
  endsAtUtc: string;
}
export interface GameSnapshot {
  gameId: string;
  version: number;
  phase: GamePhase;
  width: number;
  height: number;
  cells: Cell[];
  players: PlayerState[];
  bombs: BombState[];
  explosions: ExplosionState[];
  winnerPlayerId?: string;
}

export type GameCommand = { type: 'move'; direction: Direction } | { type: 'place-bomb' };
