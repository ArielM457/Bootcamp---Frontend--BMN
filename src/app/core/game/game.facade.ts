import { computed, inject, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthFacade } from '../auth/auth.facade';
import {
  GameCommand,
  GameCommandRejection,
  GameConnectionState,
  GameSnapshot,
} from './game.models';
import { GAME_PORT } from './game.port';

@Injectable({ providedIn: 'root' })
export class GameFacade {
  private readonly port = inject(GAME_PORT);
  private readonly auth = inject(AuthFacade);
  private readonly snapshotState = signal<GameSnapshot | null>(null);
  private readonly connectionState = signal<GameConnectionState>('disconnected');
  private readonly rejectionState = signal<GameCommandRejection | null>(null);
  private subscriptions = new Subscription();

  readonly snapshot = this.snapshotState.asReadonly();
  readonly connection = this.connectionState.asReadonly();
  readonly rejection = this.rejectionState.asReadonly();
  readonly controlsEnabled = computed(
    () =>
      this.connectionState() === 'connected' &&
      this.snapshotState()?.phase === 'running' &&
      this.player()?.isAlive === true,
  );
  readonly player = computed(
    () =>
      this.snapshotState()?.players.find((item) => item.playerId === this.auth.player()?.id) ??
      null,
  );
  readonly activeOpponents = computed(() => {
    const playerId = this.auth.player()?.id;
    return (
      this.snapshotState()?.players.filter((item) => item.playerId !== playerId && item.isAlive)
        .length ?? 0
    );
  });
  readonly finished = computed(() => this.snapshotState()?.phase === 'finished');
  readonly resultMessage = computed(() => {
    const winnerId = this.snapshotState()?.winnerPlayerId;
    if (!winnerId) return 'Todos los jugadores fueron alcanzados.';
    return winnerId === this.auth.player()?.id ? '¡Ganaste la partida!' : 'Otro jugador ganó.';
  });

  start(gameId: string): void {
    const player = this.auth.player();
    this.snapshotState.set(null);
    this.rejectionState.set(null);
    if (!player || !gameId) {
      this.connectionState.set('failed');
      return;
    }
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.subscriptions.add(
      this.port.snapshots$.subscribe((snapshot) => this.applySnapshot(snapshot)),
    );
    this.subscriptions.add(
      this.port.connection$.subscribe((state) => this.connectionState.set(state)),
    );
    this.subscriptions.add(
      this.port.rejections$.subscribe((rejection) => this.rejectionState.set(rejection)),
    );
    this.port.start(gameId);
  }

  send(command: GameCommand): void {
    if (this.connectionState() !== 'connected') return;
    if (this.snapshotState()?.phase === 'running') {
      this.rejectionState.set(null);
      this.port.send(command, this.commandId());
    }
  }

  reconnect(): void {
    this.rejectionState.set(null);
    this.port.reconnect();
  }

  stop(): void {
    this.port.stop();
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
    this.snapshotState.set(null);
    this.connectionState.set('disconnected');
    this.rejectionState.set(null);
  }

  applySnapshot(snapshot: GameSnapshot): void {
    const current = this.snapshotState();
    if (!current || current.gameId !== snapshot.gameId || snapshot.version > current.version) {
      this.snapshotState.set(snapshot);
    }
  }

  private commandId(): string {
    return (
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }
}
