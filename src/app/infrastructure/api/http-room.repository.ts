import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateRoomRequest, Room, RoomError, RoomStatus } from '../../core/rooms/room.models';
import { RoomRepository } from '../../core/rooms/room.repository';
import { AUTH_SESSION_STORE } from '../storage/auth-session.store';

interface BackendRoomParticipant {
  playerId: number;
  name: string;
  isReady: boolean;
}

interface BackendRoom {
  id: number;
  code: string;
  hostPlayerId: number;
  name: string;
  maxPlayers: number;
  status: string;
  participants: BackendRoomParticipant[];
  gameId?: string | null;
}

interface BackendGame {
  id: string;
}

@Injectable()
export class HttpRoomRepository implements RoomRepository {
  private readonly http = inject(HttpClient);
  private readonly store = inject(AUTH_SESSION_STORE);
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');

  async list(): Promise<Room[]> {
    try {
      const rooms = await firstValueFrom(
        this.http.get<BackendRoom[]>(`${this.apiUrl}/api/rooms`, {
          headers: this.authorization(),
        }),
      );
      return rooms.map((room) => this.toRoom(room));
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async get(roomId: string): Promise<Room> {
    try {
      const room = await firstValueFrom(
        this.http.get<BackendRoom>(`${this.apiUrl}/api/rooms/${roomId}`, {
          headers: this.authorization(),
        }),
      );
      return this.toRoom(room);
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async create(request: CreateRoomRequest): Promise<Room> {
    try {
      const room = await firstValueFrom(
        this.http.post<BackendRoom>(
          `${this.apiUrl}/api/rooms`,
          { name: request.name.trim(), maxPlayers: request.maxPlayers },
          { headers: this.authorization() },
        ),
      );
      return this.toRoom(room);
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async joinById(roomId: string): Promise<Room> {
    try {
      const room = await firstValueFrom(
        this.http.post<BackendRoom>(`${this.apiUrl}/api/rooms/${roomId}/join`, null, {
          headers: this.authorization(),
        }),
      );
      return this.toRoom(room);
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async joinByCode(code: string): Promise<Room> {
    try {
      const room = await firstValueFrom(
        this.http.post<BackendRoom>(
          `${this.apiUrl}/api/rooms/join`,
          { code: code.trim().toUpperCase() },
          { headers: this.authorization() },
        ),
      );
      return this.toRoom(room);
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async setReady(roomId: string, isReady: boolean): Promise<Room> {
    try {
      const room = await firstValueFrom(
        this.http.put<BackendRoom>(
          `${this.apiUrl}/api/rooms/${roomId}/ready`,
          { isReady },
          { headers: this.authorization() },
        ),
      );
      return this.toRoom(room);
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  async start(roomId: string): Promise<Room> {
    try {
      const game = await firstValueFrom(
        this.http.post<BackendGame>(`${this.apiUrl}/api/games/${roomId}/start`, null, {
          headers: this.authorization(),
        }),
      );
      const room = await this.get(roomId);
      return { ...room, status: 'playing', gameId: game.id };
    } catch (error: unknown) {
      throw this.toRoomError(error);
    }
  }

  private authorization(): HttpHeaders {
    const session = this.store.read();
    if (!session) throw new RoomError('unavailable', 'No authenticated session');
    return new HttpHeaders({ Authorization: `Bearer ${session.accessToken}` });
  }

  private toRoom(room: BackendRoom): Room {
    return {
      id: room.id.toString(),
      code: room.code,
      hostPlayerId: room.hostPlayerId.toString(),
      name: room.name,
      status: this.toStatus(room.status),
      maxPlayers: room.maxPlayers,
      participants: room.participants.map((participant) => ({
        id: participant.playerId.toString(),
        displayName: participant.name,
        isReady: participant.isReady,
      })),
      gameId: room.gameId ?? undefined,
    };
  }

  private toStatus(status: string): RoomStatus {
    if (status === 'playing' || status === 'finished') return status;
    return 'waiting';
  }

  private toRoomError(error: unknown): RoomError {
    if (error instanceof RoomError) return error;
    if (!(error instanceof HttpErrorResponse)) {
      return new RoomError('unavailable', 'Room service unavailable');
    }
    if (error.status === 404) return new RoomError('not-found', 'Room not found');
    if (error.status === 400) return new RoomError('invalid-data', 'Invalid room data');
    if (error.status === 403) {
      const message = this.backendMessage(error).toLowerCase();
      if (message.includes('creador')) return new RoomError('not-host', message);
      return new RoomError('not-member', message);
    }
    if (error.status === 409) {
      const message = this.backendMessage(error).toLowerCase();
      if (message.includes('llena')) return new RoomError('full', message);
      if (message.includes('pertenece')) return new RoomError('already-in-room', message);
      if (message.includes('al menos')) return new RoomError('not-enough-players', message);
      if (message.includes('listos')) return new RoomError('players-not-ready', message);
      if (message.includes('creador')) return new RoomError('not-host', message);
      return new RoomError('not-waiting', message);
    }
    return new RoomError('unavailable', 'Room service unavailable');
  }

  private backendMessage(error: HttpErrorResponse): string {
    const body = error.error as { message?: unknown } | null;
    return typeof body?.message === 'string' ? body.message : 'Room request failed';
  }
}
