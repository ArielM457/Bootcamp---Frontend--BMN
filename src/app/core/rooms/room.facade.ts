import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthFacade } from '../auth/auth.facade';
import { ROOM_REPOSITORY } from './room.repository';
import { CreateRoomRequest, Room, RoomError } from './room.models';

type RoomStatus = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class RoomFacade {
  private readonly repository = inject(ROOM_REPOSITORY);
  private readonly auth = inject(AuthFacade);
  private readonly roomsState = signal<Room[]>([]);
  private readonly currentRoomState = signal<Room | null>(null);
  private readonly statusState = signal<RoomStatus>('idle');
  private readonly errorState = signal<string | null>(null);

  readonly rooms = this.roomsState.asReadonly();
  readonly currentRoom = this.currentRoomState.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly isLoading = computed(() => this.statusState() === 'loading');
  readonly canStart = computed(() => {
    const room = this.currentRoomState();
    const playerId = this.auth.player()?.id;
    return (
      !!room &&
      room.status === 'waiting' &&
      room.participants.length >= 2 &&
      room.participants.some((participant) => participant.id === playerId)
    );
  });

  async loadRooms(): Promise<void> {
    await this.run(async () => {
      this.roomsState.set(await this.repository.list());
    });
  }

  async loadRoom(roomId: string): Promise<boolean> {
    return this.run(async () => {
      this.currentRoomState.set(await this.repository.get(roomId));
    });
  }

  async restoreCurrentRoom(): Promise<boolean> {
    const player = this.auth.player();
    if (!player) return false;
    return this.run(async () => {
      const rooms = await this.repository.list();
      this.roomsState.set(rooms);
      this.currentRoomState.set(
        rooms.find((room) =>
          room.participants.some((participant) => participant.id === player.id),
        ) ?? null,
      );
    });
  }

  async create(request: CreateRoomRequest): Promise<Room | null> {
    const player = this.auth.player();
    if (!player) return null;
    let created: Room | null = null;
    await this.run(async () => {
      created = await this.repository.create(request);
      this.currentRoomState.set(created);
    });
    return created;
  }

  async join(roomId: string): Promise<Room | null> {
    const player = this.auth.player();
    if (!player) return null;
    let joined: Room | null = null;
    await this.run(async () => {
      joined = await this.repository.join(roomId);
      this.currentRoomState.set(joined);
    });
    return joined;
  }

  async start(): Promise<string | null> {
    const room = this.currentRoomState();
    const player = this.auth.player();
    if (!room || !player) return null;
    let gameId: string | null = null;
    await this.run(async () => {
      const startedRoom = await this.repository.start(room.id);
      this.currentRoomState.set(startedRoom);
      gameId = startedRoom.gameId ?? null;
    });
    return gameId;
  }

  clearError(): void {
    this.errorState.set(null);
    if (this.statusState() === 'error') this.statusState.set('idle');
  }

  private async run(operation: () => Promise<void>): Promise<boolean> {
    this.statusState.set('loading');
    this.errorState.set(null);
    try {
      await operation();
      this.statusState.set('ready');
      return true;
    } catch (error: unknown) {
      this.statusState.set('error');
      this.errorState.set(this.messageFor(error));
      return false;
    }
  }

  private messageFor(error: unknown): string {
    if (!(error instanceof RoomError)) return 'No pudimos completar la operación.';
    switch (error.code) {
      case 'full':
        return 'La sala ya está llena.';
      case 'not-found':
        return 'La sala ya no está disponible.';
      case 'not-waiting':
        return 'La partida de esta sala ya comenzó.';
      case 'already-in-room':
        return 'Ya estás dentro de otra sala.';
      case 'not-member':
        return 'No formas parte de esta sala.';
      case 'not-host':
        return 'Solo el anfitrión puede cambiar o iniciar la sala.';
      case 'not-enough-players':
        return 'Se necesitan al menos 2 jugadores para comenzar.';
      case 'invalid-data':
        return 'Revisa el nombre y la cantidad de jugadores.';
      case 'unavailable':
        return 'El backend no tiene disponible esta operación.';
    }
  }
}
