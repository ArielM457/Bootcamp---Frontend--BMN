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
    if (name.length < 3 || name.length > 60 || request.maxPlayers < 2 || request.maxPlayers > 8) {
      throw new RoomError('invalid-data', 'Invalid room data');
    }
    this.assertFreePlayer(player.id);
    const room: Room = {
      id: this.createId(),
      name,
      status: 'waiting',
      hostPlayerId: player.id,
      maxPlayers: request.maxPlayers,
      participants: [{ ...player, kind: 'player' }],
    };
    this.rooms.set(room.id, room);
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
    if (room.participants.some((participant) => participant.kind === 'bot'))
      throw new RoomError('bot-already-added', 'Room already has a bot');
    if (room.participants.length >= room.maxPlayers) throw new RoomError('full', 'Room is full');
    room.participants.push({
      id: `bot-${room.id}`,
      displayName: 'Bombot',
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

  private assertFreePlayer(playerId: string): void {
    const activeRoom = [...this.rooms.values()].find(
      (room) =>
        room.status === 'waiting' &&
        room.participants.some((participant) => participant.id === playerId),
    );
    if (activeRoom) throw new RoomError('already-in-room', 'Player already has a room');
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
