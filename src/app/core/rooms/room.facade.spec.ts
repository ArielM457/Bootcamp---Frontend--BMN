import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthFacade } from '../auth/auth.facade';
import { Room } from './room.models';
import { RoomFacade } from './room.facade';
import { ROOM_REPOSITORY, RoomRepository } from './room.repository';

describe('RoomFacade permisos y estado listo', () => {
  const player = signal({ id: '1', displayName: 'Creador', avatarId: 'azure' as const });
  const room: Room = {
    id: '10',
    code: 'K7M9Q2PX',
    hostPlayerId: '1',
    name: 'Sala lista',
    status: 'waiting',
    maxPlayers: 2,
    participants: [
      { id: '1', displayName: 'Creador', isReady: true },
      { id: '2', displayName: 'Invitado', isReady: false },
    ],
  };
  const repository: RoomRepository = {
    list: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(room),
    create: vi.fn(),
    joinById: vi.fn(),
    joinByCode: vi.fn(),
    setReady: vi.fn(),
    start: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    player.set({ id: '1', displayName: 'Creador', avatarId: 'azure' });
    TestBed.configureTestingModule({
      providers: [
        RoomFacade,
        { provide: ROOM_REPOSITORY, useValue: repository },
        { provide: AuthFacade, useValue: { player } },
      ],
    });
  });

  it('solo habilita el inicio al creador cuando el invitado está listo', async () => {
    const facade = TestBed.inject(RoomFacade);
    await facade.loadRoom(room.id);

    expect(facade.isHost()).toBe(true);
    expect(facade.canStart()).toBe(false);

    (repository.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ...room,
      participants: room.participants.map((participant) => ({ ...participant, isReady: true })),
    });
    await facade.loadRoom(room.id);

    expect(facade.canStart()).toBe(true);

    player.set({ id: '2', displayName: 'Invitado', avatarId: 'azure' });
    expect(facade.isHost()).toBe(false);
    expect(facade.canStart()).toBe(false);
  });

  it('permite al invitado cambiar únicamente su estado listo', async () => {
    player.set({ id: '2', displayName: 'Invitado', avatarId: 'azure' });
    const readyRoom = {
      ...room,
      participants: room.participants.map((participant) =>
        participant.id === '2' ? { ...participant, isReady: true } : participant,
      ),
    };
    (repository.setReady as ReturnType<typeof vi.fn>).mockResolvedValueOnce(readyRoom);
    const facade = TestBed.inject(RoomFacade);
    await facade.loadRoom(room.id);

    expect(await facade.setReady(true)).toBe(true);
    expect(repository.setReady).toHaveBeenCalledWith(room.id, true);
    expect(facade.currentParticipant()?.isReady).toBe(true);
  });
});
