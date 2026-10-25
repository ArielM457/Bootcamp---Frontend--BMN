import { Player } from '../auth/auth.models';

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type ArenaId = 'open' | 'fortress';
export type RoomMode = 'local' | 'online';

export interface RoomParticipant extends Player {
  kind: 'player' | 'bot';
}

export interface Room {
  id: string;
  name: string;
  status: RoomStatus;
  hostPlayerId: string;
  maxPlayers: number;
  arenaId: ArenaId;
  mode: RoomMode;
  participants: RoomParticipant[];
}

export interface CreateRoomRequest {
  name: string;
  maxPlayers: number;
  arenaId?: ArenaId;
  mode?: RoomMode;
}

export type RoomErrorCode =
  | 'full'
  | 'not-found'
  | 'not-waiting'
  | 'already-in-room'
  | 'not-member'
  | 'not-host'
  | 'not-enough-players'
  | 'invalid-data';

export class RoomError extends Error {
  constructor(
    readonly code: RoomErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'RoomError';
  }
}
