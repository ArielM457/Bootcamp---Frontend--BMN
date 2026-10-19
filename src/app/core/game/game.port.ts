import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GameCommand,
  GameCommandRejection,
  GameConnectionState,
  GameSnapshot,
} from './game.models';

export interface GamePort {
  readonly snapshots$: Observable<GameSnapshot>;
  readonly connection$: Observable<GameConnectionState>;
  readonly rejections$: Observable<GameCommandRejection>;
  start(playerId: string): void;
  send(command: GameCommand, commandId: string): void;
  reconnect(): void;
  stop(): void;
}

export const GAME_PORT = new InjectionToken<GamePort>('GAME_PORT');
