import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Cell,
  GameCommand,
  GameCommandRejection,
  GameConnectionState,
  GamePhase,
  GameSnapshot,
} from '../../core/game/game.models';
import { GamePort } from '../../core/game/game.port';
import { AUTH_SESSION_STORE } from '../storage/auth-session.store';

interface BackendPlayerPosition {
  playerId: number;
  x: number;
  y: number;
  lives: number;
  isAlive: boolean;
}

interface BackendBomb {
  id: string;
  ownerPlayerId: number;
  x: number;
  y: number;
  range: number;
  placedAtUtc: string;
  explodesAtUtc: string;
}

interface BackendExplosion {
  id: string;
  cells: { x: number; y: number }[];
  endsAtUtc: string;
}

interface BackendGameState {
  id: string;
  roomId: number;
  status: string;
  map: number[][];
  players: BackendPlayerPosition[];
  bombs: BackendBomb[];
  explosions: BackendExplosion[];
  winnerPlayerId?: number | null;
}

@Injectable()
export class SignalRGameAdapter implements GamePort {
  private readonly store = inject(AUTH_SESSION_STORE);
  private readonly snapshotSubject = new ReplaySubject<GameSnapshot>(1);
  private readonly connectionSubject = new BehaviorSubject<GameConnectionState>('disconnected');
  private readonly rejectionSubject = new Subject<GameCommandRejection>();
  private connection: signalR.HubConnection | null = null;
  private gameId: string | null = null;
  private version = 0;
  private connectionGeneration = 0;

  readonly snapshots$ = this.snapshotSubject.asObservable();
  readonly connection$ = this.connectionSubject.asObservable();
  readonly rejections$ = this.rejectionSubject.asObservable();

  start(gameId: string): void {
    this.stop();
    this.gameId = gameId;
    this.version = 0;
    const generation = this.connectionGeneration;
    void this.connect(generation);
  }

  send(command: GameCommand, commandId: string): void {
    if (this.connectionSubject.value !== 'connected' || !this.connection) {
      this.reject(commandId, 'La conexión no está lista. Tu acción no se aplicó.');
      return;
    }

    const invocation =
      command.type === 'move'
        ? this.connection.invoke('MovePlayer', command.direction, commandId)
        : this.connection.invoke('PlaceBomb', commandId);
    void invocation.catch((error: unknown) => this.reject(commandId, this.errorMessage(error)));
  }

  reconnect(): void {
    if (!this.gameId || this.connectionSubject.value === 'connecting') return;
    const generation = this.connectionGeneration;
    void this.connect(generation);
  }

  stop(): void {
    this.connectionGeneration += 1;
    const current = this.connection;
    this.connection = null;
    this.gameId = null;
    this.version = 0;
    this.connectionSubject.next('disconnected');
    if (current) void current.stop();
  }

  private async connect(generation: number): Promise<void> {
    const session = this.store.read();
    const gameId = this.gameId;
    if (!session || !gameId) {
      this.connectionSubject.next('failed');
      return;
    }

    this.connectionSubject.next('connecting');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubUrl, {
        accessTokenFactory: () => this.store.read()?.accessToken ?? '',
      })
      .withAutomaticReconnect([0, 1000, 3000, 5000])
      .build();

    connection.on('GameStateUpdated', (state: BackendGameState) => {
      this.version += 1;
      this.snapshotSubject.next(this.toSnapshot(state, this.version));
    });
    connection.on('CommandRejected', (commandId: string, message: string) => {
      this.reject(commandId, message);
    });
    connection.onreconnecting(() => this.connectionSubject.next('reconnecting'));
    connection.onreconnected(() => {
      if (!this.gameId) return;
      void connection
        .invoke('JoinGame', this.gameId)
        .then(() => this.connectionSubject.next('connected'))
        .catch(() => this.connectionSubject.next('failed'));
    });
    connection.onclose(() => {
      if (this.connection === connection) this.connectionSubject.next('failed');
    });

    this.connection = connection;

    try {
      await connection.start();
      if (generation !== this.connectionGeneration || this.connection !== connection) {
        await connection.stop();
        return;
      }
      await connection.invoke('JoinGame', gameId);
      this.connectionSubject.next('connected');
    } catch {
      if (this.connection === connection) this.connectionSubject.next('failed');
    }
  }

  private toSnapshot(state: BackendGameState, version: number): GameSnapshot {
    const cells: Cell[] = [];
    for (let y = 0; y < state.map.length; y += 1) {
      for (let x = 0; x < state.map[y].length; x += 1) {
        cells.push({ x, y, kind: state.map[y][x] === 1 ? 'wall' : 'floor' });
      }
    }

    return {
      gameId: state.id,
      version,
      phase: this.toPhase(state.status),
      width: state.map[0]?.length ?? 0,
      height: state.map.length,
      cells,
      players: state.players.map((player) => ({
        playerId: player.playerId.toString(),
        x: player.x,
        y: player.y,
        lives: player.lives,
        isAlive: player.isAlive,
      })),
      bombs: (state.bombs ?? []).map((bomb) => ({
        ...bomb,
        ownerPlayerId: bomb.ownerPlayerId.toString(),
      })),
      explosions: state.explosions ?? [],
      winnerPlayerId: state.winnerPlayerId?.toString(),
    };
  }

  private toPhase(status: string): GamePhase {
    if (status === 'finished') return 'finished';
    if (status === 'playing') return 'running';
    return 'waiting';
  }

  private reject(commandId: string, message: string): void {
    this.rejectionSubject.next({ commandId, message });
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error && error.message) return error.message;
    return 'El servidor rechazó la acción.';
  }
}
