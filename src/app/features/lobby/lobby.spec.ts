import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { Room } from '../../core/rooms/room.models';
import { RoomFacade } from '../../core/rooms/room.facade';
import { Lobby } from './lobby';

describe('Lobby LOBBY-01', () => {
  let fixture: ComponentFixture<Lobby>;
  const player = signal({ id: '1', displayName: 'Ariel', avatarId: 'azure' as const });
  const auth = {
    player,
    error: signal<string | null>(null),
    isLoading: signal(false),
    clearError: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
  };
  const rooms = {
    currentRoom: signal<Room | null>(null),
    error: signal<string | null>(null),
    isLoading: signal(false),
    clearError: vi.fn(),
    restoreCurrentRoom: vi.fn().mockResolvedValue(true),
    create: vi.fn(),
    join: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    rooms.currentRoom.set(null);
    await TestBed.configureTestingModule({
      imports: [Lobby],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: auth },
        { provide: RoomFacade, useValue: rooms },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Lobby);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('crea una sala usando solo los datos aceptados por el backend', async () => {
    const room: Room = {
      id: '10',
      name: 'Sala online',
      status: 'waiting',
      maxPlayers: 4,
      participants: [{ id: '1', displayName: 'Ariel' }],
    };
    rooms.create.mockResolvedValueOnce(room);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture.componentInstance.roomForm.setValue({ name: 'Sala online', maxPlayers: 4 });

    await fixture.componentInstance.saveRoom();

    expect(rooms.create).toHaveBeenCalledWith({ name: 'Sala online', maxPlayers: 4 });
    expect(navigate).toHaveBeenCalledWith(['/salas', '10']);
  });

  it('muestra volver a la sala cuando la API devuelve una membresía', async () => {
    rooms.currentRoom.set({
      id: '11',
      name: 'Sala activa',
      status: 'waiting',
      maxPlayers: 4,
      participants: [{ id: '1', displayName: 'Ariel' }],
    });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Volver a la sala');
  });
});
