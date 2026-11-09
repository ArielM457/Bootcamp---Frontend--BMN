export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface RoomParticipant {
  id: string;
  displayName: string;
}

export interface Room {
  id: string;
  name: string;
  status: RoomStatus;
  maxPlayers: number;
  participants: RoomParticipant[];
  gameId?: string;
}

export interface CreateRoomRequest {
  name: string;
  maxPlayers: number;
}

export type RoomErrorCode =
  | 'full'
  | 'not-found'
  | 'not-waiting'
  | 'already-in-room'
  | 'not-member'
  | 'not-host'
  | 'not-enough-players'
  | 'invalid-data'
  | 'unavailable';

export class RoomError extends Error {
  constructor(
    readonly code: RoomErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'RoomError';
  }
}
