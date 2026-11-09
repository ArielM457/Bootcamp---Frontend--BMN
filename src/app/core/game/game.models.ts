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
}
export interface GameSnapshot {
  gameId: string;
  version: number;
  phase: GamePhase;
  width: number;
  height: number;
  cells: Cell[];
  players: PlayerState[];
}

export type GameCommand = { type: 'move'; direction: Direction };
