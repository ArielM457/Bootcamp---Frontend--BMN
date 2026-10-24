import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { vi } from 'vitest';
import { AuthFacade } from '../../core/auth/auth.facade';
import { GameFacade } from '../../core/game/game.facade';
import { GameInputController } from '../../core/game/game-input.controller';
import { GameCommandRejection, GameSnapshot } from '../../core/game/game.models';
import { GAME_PORT, GamePort } from '../../core/game/game.port';
import { LocalGameSimulator } from '../../infrastructure/mocks/local-game.simulator';
import { MockRealtimeGameAdapter } from '../../infrastructure/mocks/mock-realtime-game.adapter';
import { CanvasRenderer } from './canvas-renderer';

describe('Motor local GAME-01', () => {
  afterEach(() => vi.useRealTimers());

  it('mueve al jugador solo hacia celdas libres y confirma la versión', () => {
    const simulator = new LocalGameSimulator();
    let latest: GameSnapshot | null = null;
    const subscription = simulator.snapshots$.subscribe((snapshot) => (latest = snapshot));
    simulator.start('player-1');
    const initialVersion = latest!.version;

    simulator.send({ type: 'move', direction: 'up' });
    expect(latest!.version).toBe(initialVersion);
    simulator.send({ type: 'move', direction: 'right' });
    expect(latest!.players[0]).toMatchObject({ x: 2, y: 1 });
    expect(latest!.version).toBeGreaterThan(initialVersion);

    simulator.stop();
    subscription.unsubscribe();
  });

  it('coloca una bomba y produce una explosión confirmada', () => {
    vi.useFakeTimers();
    const simulator = new LocalGameSimulator();
    let latest: GameSnapshot | null = null;
    simulator.snapshots$.subscribe((snapshot) => (latest = snapshot));
    simulator.start('player-1');
    simulator.send({ type: 'place-bomb' });

    expect(latest!.bombs).toHaveLength(1);
    vi.advanceTimersByTime(1600);
    expect(latest!.bombs).toHaveLength(0);
    expect(latest!.explosions.length).toBeGreaterThan(0);
    simulator.stop();
  });

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

  it('deja Enter y Espacio a enlaces y botones de la página', () => {
    const input = new GameInputController();
    const keyOn = (target: Element, key: string): KeyboardEvent => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      target.dispatchEvent(event);
      return event;
    };
    const link = document.createElement('a');
    link.href = '/menu';
    const restart = document.createElement('button');
    const bombButton = document.createElement('button');
    bombButton.setAttribute('data-game-control', '');
    document.body.append(link, restart, bombButton);

    expect(input.fromKey(keyOn(link, 'Enter'))).toBeNull();
    expect(input.fromKey(keyOn(restart, ' '))).toBeNull();
    expect(input.fromKey(keyOn(restart, 'ArrowUp'))).toEqual({ type: 'move', direction: 'up' });
    expect(input.fromKey(keyOn(bombButton, ' '))).toEqual({ type: 'place-bomb' });
    expect(input.fromKey(keyOn(document.body, ' '))).toEqual({ type: 'place-bomb' });

    link.remove();
    restart.remove();
    bombButton.remove();
  });

  it('descarta snapshots con una versión anterior', () => {
    const snapshots = new Subject<GameSnapshot>();
    const connection = new BehaviorSubject<'connected'>('connected');
    const port: GamePort = {
      snapshots$: snapshots.asObservable(),
      connection$: connection.asObservable(),
      rejections$: new Subject<GameCommandRejection>().asObservable(),
      start: () => undefined,
      send: () => undefined,
      reconnect: () => undefined,
      stop: () => undefined,
    };
    const player = signal({ id: 'player-1', displayName: 'Ariel' });
    TestBed.configureTestingModule({
      providers: [
        GameFacade,
        { provide: GAME_PORT, useValue: port },
        { provide: AuthFacade, useValue: { player } },
      ],
    });
    const facade = TestBed.inject(GameFacade);
    const current = snapshot(5);
    facade.applySnapshot(current);
    facade.applySnapshot(snapshot(4));

    expect(facade.snapshot()?.version).toBe(5);
  });

  it('recupera el último snapshot antes de volver a habilitar los comandos', () => {
    vi.useFakeTimers();
    const adapter = new MockRealtimeGameAdapter();
    const events: string[] = [];
    adapter.snapshots$.subscribe((value) => events.push(`snapshot-${value.version}`));
    adapter.connection$.subscribe((value) => events.push(value));
    adapter.start('player-1');
    events.length = 0;

    adapter.simulateDisconnect();
    vi.advanceTimersByTime(600);

    expect(events[0]).toBe('reconnecting');
    expect(events.at(-2)).toMatch(/^snapshot-/);
    expect(events.at(-1)).toBe('connected');
    adapter.stop();
  });

  it('rechaza comandos sin conexión y conserva el tablero', () => {
    vi.useFakeTimers();
    const adapter = new MockRealtimeGameAdapter();
    let latest: GameSnapshot | null = null;
    let rejection = '';
    adapter.snapshots$.subscribe((value) => (latest = value));
    adapter.rejections$.subscribe((value) => (rejection = value.message));
    adapter.start('player-1');
    const version = latest!.version;
    adapter.simulateDisconnect();
    adapter.send({ type: 'move', direction: 'right' }, 'command-1');

    expect(rejection).toContain('no se aplicó');
    expect(latest!.version).toBe(version);
    adapter.stop();
  });

  it('informa una reconexión fallida y permite reintentar', () => {
    vi.useFakeTimers();
    const adapter = new MockRealtimeGameAdapter();
    let state = '';
    adapter.connection$.subscribe((value) => (state = value));
    adapter.start('player-1');
    adapter.simulateDisconnect(true);
    vi.advanceTimersByTime(600);
    expect(state).toBe('failed');

    adapter.reconnect();
    vi.advanceTimersByTime(600);
    expect(state).toBe('connected');
    adapter.stop();
  });
});

function snapshot(version: number): GameSnapshot {
  return {
    gameId: 'game-1',
    version,
    phase: 'running',
    width: 1,
    height: 1,
    cells: [{ x: 0, y: 0, kind: 'floor' }],
    players: [],
    bombs: [],
    explosions: [],
    remainingSeconds: 100,
    winnerPlayerId: null,
  };
}
