import { InjectionToken } from '@angular/core';
import { CreateRoomRequest, Room } from './room.models';

export interface RoomRepository {
  list(): Promise<Room[]>;
  get(roomId: string): Promise<Room>;
  create(request: CreateRoomRequest): Promise<Room>;
  joinById(roomId: string): Promise<Room>;
  joinByCode(code: string): Promise<Room>;
  setReady(roomId: string, isReady: boolean): Promise<Room>;
  start(roomId: string): Promise<Room>;
}

export const ROOM_REPOSITORY = new InjectionToken<RoomRepository>('ROOM_REPOSITORY');
