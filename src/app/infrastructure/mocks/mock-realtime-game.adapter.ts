import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, Subscription } from 'rxjs';
import {
  GameCommand,
  GameCommandRejection,
  GameConnectionState,
  GameSnapshot,
} from '../../core/game/game.models';
import { GamePort } from '../../core/game/game.port';
import { LocalGameSimulator } from './local-game.simulator';

@Injectable()
export class MockRealtimeGameAdapter implements GamePort {
  private readonly simulator = new LocalGameSimulator();
  private readonly snapshotSubject = new ReplaySubject<GameSnapshot>(1);
  private readonly connectionSubject = new BehaviorSubject<GameConnectionState>('disconnected');
  private readonly rejectionSubject = new Subject<GameCommandRejection>();
  private simulatorSubscription: Subscription | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSnapshot: GameSnapshot | null = null;

  readonly snapshots$ = this.snapshotSubject.asObservable();
  readonly connection$ = this.connectionSubject.asObservable();
  readonly rejections$ = this.rejectionSubject.asObservable();

  start(playerId: string): void {
    this.stop();
    this.connectionSubject.next('connecting');
    this.simulatorSubscription = this.simulator.snapshots$.subscribe((snapshot) => {
      this.lastSnapshot = structuredClone(snapshot);
      if (this.connectionSubject.value === 'connected') this.snapshotSubject.next(snapshot);
    });
    this.simulator.start(playerId);
    this.publishRecoverySnapshot();
    this.connectionSubject.next('connected');
  }

  send(command: GameCommand, commandId: string): void {
    if (this.connectionSubject.value !== 'connected') {
      this.rejectionSubject.next({
        commandId,
        message: 'La conexión no está lista. Tu acción no se aplicó.',
      });
      return;
    }
    this.simulator.send(command);
  }

  reconnect(): void {
    this.simulateDisconnect(false);
  }

  simulateDisconnect(shouldFail = false): void {
    if (!this.lastSnapshot || this.connectionSubject.value === 'reconnecting') return;
    this.clearReconnectTimer();
    this.connectionSubject.next('reconnecting');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (shouldFail) {
        this.connectionSubject.next('failed');
        return;
      }
      // El snapshot se publica antes de habilitar nuevamente los controles.
      this.publishRecoverySnapshot();
      this.connectionSubject.next('connected');
    }, 600);
  }

  stop(): void {
    this.clearReconnectTimer();
    this.simulator.stop();
    this.simulatorSubscription?.unsubscribe();
    this.simulatorSubscription = null;
    this.lastSnapshot = null;
    this.connectionSubject.next('disconnected');
  }

  private publishRecoverySnapshot(): void {
    if (this.lastSnapshot) this.snapshotSubject.next(structuredClone(this.lastSnapshot));
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }
}
