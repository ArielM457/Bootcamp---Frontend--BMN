import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { RoomFacade } from '../../core/rooms/room.facade';
import { ScoreFacade } from '../../core/score/score.facade';
import { Lobby } from './lobby';

describe('Lobby LOBBY-01', () => {
  let fixture: ComponentFixture<Lobby>;
  const player = signal({
    id: 'player-ariel',
    displayName: 'Ariel',
    fullName: 'Ariel Vargas',
    nickname: 'Ariel',
    avatarId: 'azure' as const,
  });
  const auth = {
    player,
    error: signal<string | null>(null),
    isLoading: signal(false),
    clearError: vi.fn(),
    updateProfile: vi.fn().mockResolvedValue(true),
    logout: vi.fn().mockResolvedValue(undefined),
  };
  const rooms = {
    error: signal<string | null>(null),
    isLoading: signal(false),
    clearError: vi.fn(),
    create: vi.fn(),
    join: vi.fn(),
  };
  const scores = {
    leaderboard: signal([
      {
        rank: 1,
        playerId: 'player-ariel',
        displayName: 'Ariel',
        points: 1250,
        victories: 1,
        gamesPlayed: 1,
      },
    ]),
    loadLeaderboard: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [Lobby],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: auth },
        { provide: RoomFacade, useValue: rooms },
        { provide: ScoreFacade, useValue: scores },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Lobby);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('mantiene perfil y creación dentro del menú con botón para volver', () => {
    const component = fixture.componentInstance;

    component.openView('profile');
    fixture.detectChanges();
    let root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Tu jugador');
    expect(root.textContent).toContain('Score actual');
    expect(root.textContent).toContain('1250');
    expect(root.querySelector('.bomber-model')).toBeTruthy();
    expect(root.textContent).toContain('Volver atrás');

    component.openView('create');
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Partida local');
    expect(root.textContent).toContain('Pista abierta');
    expect(root.textContent).toContain('La fortaleza');
    expect(root.querySelector('.arena-board')).toBeTruthy();
  });

  it('abre un popup para entrar a una sala y permite cancelarlo', () => {
    const component = fixture.componentInstance;
    component.openJoin();
    fixture.detectChanges();

    let root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeTruthy();
    expect(root.textContent).toContain('Código de invitación');

    component.closeJoin();
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });

  it('guarda nombre, nickname y personaje por medio de AuthFacade', async () => {
    const component = fixture.componentInstance;
    component.openView('profile');
    component.profileForm.setValue({
      fullName: 'Ariel Vargas',
      nickname: 'BombAriel',
      avatarId: 'violet',
    });

    await component.saveProfile();

    expect(auth.updateProfile).toHaveBeenCalledWith({
      fullName: 'Ariel Vargas',
      nickname: 'BombAriel',
      avatarId: 'violet',
    });
    expect(component.view()).toBe('main');
  });
});
