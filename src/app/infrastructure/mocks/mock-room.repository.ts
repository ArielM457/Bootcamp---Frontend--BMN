import { Injectable } from '@angular/core';
import { Player } from '../../core/auth/auth.models';
import { CreateRoomRequest, Room, RoomError } from '../../core/rooms/room.models';
import { RoomRepository } from '../../core/rooms/room.repository';

@Injectable()
export class MockRoomRepository implements RoomRepository {
  private readonly rooms = new Map<string, Room>([
    [
      'room-pink',
      {
        id: 'room-pink',
        name: 'Explosión Rosa',
        status: 'waiting',
        hostPlayerId: 'player-pixel',
        maxPlayers: 4,
        arenaId: 'open',
        mode: 'online',
        participants: [{ id: 'player-pixel', displayName: 'Pixelina', kind: 'player' }],
      },
    ],
    [
      'room-night',
      {
        id: 'room-night',
        name: 'Arena Nocturna',
        status: 'waiting',
        hostPlayerId: 'player-shadow',
        maxPlayers: 2,
        arenaId: 'fortress',
        mode: 'online',
        participants: [
          { id: 'player-shadow', displayName: 'Sombra', kind: 'player' },
          { id: 'player-bomb', displayName: 'Bombita', kind: 'player' },
        ],
      },
    ],
  ]);

  async list(): Promise<Room[]> {
    await this.wait();
    return [...this.rooms.values()].map((room) => this.copy(room));
  }

  async get(roomId: string): Promise<Room> {
    await this.wait();
    return this.copy(this.find(roomId));
  }

  async create(request: CreateRoomRequest, player: Player): Promise<Room> {
    await this.wait();
    const name = request.name.trim();
    this.validateRequest(request, name);
    this.assertFreePlayer(player.id);
    const room: Room = {
      id: this.createId(),
      name,
      status: 'waiting',
      hostPlayerId: player.id,
      maxPlayers: request.maxPlayers,
      arenaId: request.arenaId ?? 'open',
      mode: request.mode ?? 'online',
      participants: [{ ...player, kind: 'player' }],
    };
    this.rooms.set(room.id, room);
    return this.copy(room);
  }

  async update(roomId: string, request: CreateRoomRequest, playerId: string): Promise<Room> {
    await this.wait();
    const room = this.find(roomId);
    const name = request.name.trim();
    this.validateRequest(request, name);
    if (room.hostPlayerId !== playerId) throw new RoomError('not-host', 'Player is not the host');
    if (room.status !== 'waiting') throw new RoomError('not-waiting', 'Room is not waiting');
    if (request.maxPlayers < room.participants.length)
      throw new RoomError('invalid-data', 'Room capacity is below current participants');
    room.name = name;
    room.maxPlayers = request.maxPlayers;
    room.arenaId = request.arenaId ?? room.arenaId;
    room.mode = request.mode ?? room.mode;
    return this.copy(room);
  }

  async join(roomId: string, player: Player): Promise<Room> {
    await this.wait();
    const room = this.find(roomId);
    if (room.participants.some((participant) => participant.id === player.id))
      return this.copy(room);
    this.assertFreePlayer(player.id);
    if (room.status !== 'waiting') throw new RoomError('not-waiting', 'Room is not waiting');
    if (room.participants.length >= room.maxPlayers) throw new RoomError('full', 'Room is full');
    room.participants.push({ ...player, kind: 'player' });
    return this.copy(room);
  }

  async addBot(roomId: string, playerId: string): Promise<Room> {
    await this.wait();
    const room = this.find(roomId);
    if (room.hostPlayerId !== playerId) throw new RoomError('not-host', 'Player is not the host');
    if (room.status !== 'waiting') throw new RoomError('not-waiting', 'Room is not waiting');
    if (room.participants.length >= room.maxPlayers) throw new RoomError('full', 'Room is full');
    const botNumber =
      room.participants.filter((participant) => participant.kind === 'bot').length + 1;
    room.participants.push({
      id: `bot-${room.id}-${botNumber}`,
      displayName: `Bombot ${botNumber}`,
      kind: 'bot',
    });
    return this.copy(room);
  }

  async leave(roomId: string, playerId: string): Promise<void> {
    await this.wait();
    const room = this.find(roomId);
    const index = room.participants.findIndex((participant) => participant.id === playerId);
    if (index < 0) throw new RoomError('not-member', 'Player is not a member');
    room.participants.splice(index, 1);
    const nextHost = room.participants.find((participant) => participant.kind === 'player');
    if (!nextHost) {
      this.rooms.delete(roomId);
    } else if (room.hostPlayerId === playerId) {
      room.hostPlayerId = nextHost.id;
    }
  }

  async start(roomId: string, playerId: string): Promise<Room> {
    await this.wait();
    const room = this.find(roomId);
    if (room.hostPlayerId !== playerId) throw new RoomError('not-host', 'Player is not the host');
    if (room.participants.length < 2)
      throw new RoomError('not-enough-players', 'Not enough players');
    if (room.status !== 'waiting') throw new RoomError('not-waiting', 'Room is not waiting');
    room.status = 'playing';
    return this.copy(room);
  }

  async returnToWaiting(roomId: string, playerId: string): Promise<Room> {
    await this.wait();
    const room = this.find(roomId);
    if (!room.participants.some((participant) => participant.id === playerId)) {
      throw new RoomError('not-member', 'Player is not a member');
    }
    room.status = 'waiting';
    return this.copy(room);
  }

  private assertFreePlayer(playerId: string): void {
    const activeRoom = [...this.rooms.values()].find(
      (room) =>
        room.status === 'waiting' &&
        room.participants.some((participant) => participant.id === playerId),
    );
    if (activeRoom) throw new RoomError('already-in-room', 'Player already has a room');
  }

  private validateRequest(request: CreateRoomRequest, name: string): void {
    if (name.length < 3 || name.length > 60 || request.maxPlayers < 2 || request.maxPlayers > 8) {
      throw new RoomError('invalid-data', 'Invalid room data');
    }
  }

  private find(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) throw new RoomError('not-found', 'Room not found');
    return room;
  }

  private copy(room: Room): Room {
    return { ...room, participants: room.participants.map((player) => ({ ...player })) };
  }

  private createId(): string {
    return (
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 120));
  }
}
