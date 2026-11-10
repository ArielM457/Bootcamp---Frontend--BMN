import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthFacade } from '../../core/auth/auth.facade';
import { GameFacade } from '../../core/game/game.facade';
import { GameInputController } from '../../core/game/game-input.controller';
import { GameCommandRejection, GameSnapshot } from '../../core/game/game.models';
import { GAME_PORT, GamePort } from '../../core/game/game.port';
import { CanvasRenderer, PLAYER_SPRITES } from './canvas-renderer';

describe('Motor de presentación GAME-01', () => {
  it('traduce teclado a comandos y calcula celdas del Canvas', () => {
    const input = new GameInputController();
    const renderer = new CanvasRenderer();

    expect(input.fromKey(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))).toEqual({
      type: 'move',
      direction: 'left',
    });
    expect(input.fromKey(new KeyboardEvent('keydown', { key: ' ' }))).toEqual({
      type: 'place-bomb',
    });
    expect(renderer.cellRect(3, 2)).toEqual({ x: 144, y: 96, size: 48 });
  });

  it('usa los sprites configurados para movimiento', () => {
    const renderer = new CanvasRenderer();

    for (const direction of ['up', 'down', 'left', 'right'] as const) {
      expect(renderer.playerSprite(direction, false)).toBe(PLAYER_SPRITES[direction].idle);
      expect(renderer.playerSprite(direction, true, 0)).toBe(PLAYER_SPRITES[direction].walking[0]);
      expect(renderer.playerSprite(direction, true, 180)).toBe(
        PLAYER_SPRITES[direction].walking[1],
      );
    }
  });

  it('descarta snapshots con una versión anterior', () => {
    const snapshots = new Subject<GameSnapshot>();
    const port = createPort(snapshots);
    const player = signal({ id: '1', displayName: 'Ariel' });
    TestBed.configureTestingModule({
      providers: [
        GameFacade,
        { provide: GAME_PORT, useValue: port },
        { provide: AuthFacade, useValue: { player } },
      ],
    });
    const facade = TestBed.inject(GameFacade);
    facade.applySnapshot(snapshot(5));
    facade.applySnapshot(snapshot(4));

    expect(facade.snapshot()?.version).toBe(5);
  });

  it('resume los rivales activos para el HUD', () => {
    const port = createPort(new Subject<GameSnapshot>());
    const player = signal({ id: '1', displayName: 'Ariel' });
    TestBed.configureTestingModule({
      providers: [
        GameFacade,
        { provide: GAME_PORT, useValue: port },
        { provide: AuthFacade, useValue: { player } },
      ],
    });
    const facade = TestBed.inject(GameFacade);
    const current = snapshot(1);
    current.players = [
      { playerId: '1', x: 1, y: 1, lives: 3, isAlive: true },
      { playerId: '2', x: 7, y: 7, lives: 0, isAlive: false },
    ];
    facade.applySnapshot(current);

    expect(facade.activeOpponents()).toBe(0);
  });
});

function createPort(snapshots: Subject<GameSnapshot>): GamePort {
  return {
    snapshots$: snapshots.asObservable(),
    connection$: new BehaviorSubject<'connected'>('connected').asObservable(),
    rejections$: new Subject<GameCommandRejection>().asObservable(),
    start: () => undefined,
    send: () => undefined,
    reconnect: () => undefined,
    stop: () => undefined,
  };
}

function snapshot(version: number): GameSnapshot {
  return {
    gameId: 'game-1',
    version,
    phase: 'running',
    width: 9,
    height: 9,
    cells: [{ x: 0, y: 0, kind: 'wall' }],
    players: [],
    bombs: [],
    explosions: [],
  };
}
