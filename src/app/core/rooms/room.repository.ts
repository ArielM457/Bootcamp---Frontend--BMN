import { InjectionToken } from '@angular/core';
import { Player } from '../auth/auth.models';
import { CreateRoomRequest, Room } from './room.models';

export interface RoomRepository {
  list(): Promise<Room[]>;
  get(roomId: string): Promise<Room>;
  create(request: CreateRoomRequest, player: Player): Promise<Room>;
  join(roomId: string, player: Player): Promise<Room>;
  addBot(roomId: string, playerId: string): Promise<Room>;
  leave(roomId: string, playerId: string): Promise<void>;
  start(roomId: string, playerId: string): Promise<Room>;
}

export const ROOM_REPOSITORY = new InjectionToken<RoomRepository>('ROOM_REPOSITORY');
