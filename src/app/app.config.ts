import { ApplicationConfig, Provider, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { AppMode } from './core/config/app-environment';
import { AUTH_REPOSITORY } from './core/auth/auth.repository';
import { MockAuthRepository } from './infrastructure/mocks/mock-auth.repository';
import { AUTH_SESSION_STORE } from './infrastructure/storage/auth-session.store';
import { BrowserAuthSessionStore } from './infrastructure/storage/browser-auth-session.store';
import { ROOM_REPOSITORY } from './core/rooms/room.repository';
import { MockRoomRepository } from './infrastructure/mocks/mock-room.repository';
import { GAME_PORT } from './core/game/game.port';
import { MockRealtimeGameAdapter } from './infrastructure/mocks/mock-realtime-game.adapter';
import { SCORE_REPOSITORY } from './core/score/score.repository';
import { MockScoreRepository } from './infrastructure/mocks/mock-score.repository';

export const API_MODE_UNAVAILABLE_MESSAGE =
  "Modo 'api' no disponible: faltan los adaptadores HTTP y SignalR reales. " +
  "Usa el modo 'demo' o implementa los adaptadores en src/app/infrastructure/api " +
  'y src/app/infrastructure/realtime (ADR 0002).';

export function provideDataAdapters(mode: AppMode): Provider[] {
  switch (mode) {
    case 'demo':
      return [
        { provide: AUTH_REPOSITORY, useClass: MockAuthRepository },
        { provide: ROOM_REPOSITORY, useClass: MockRoomRepository },
        { provide: GAME_PORT, useClass: MockRealtimeGameAdapter },
        { provide: SCORE_REPOSITORY, useClass: MockScoreRepository },
      ];
    case 'api':
      throw new Error(API_MODE_UNAVAILABLE_MESSAGE);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: AUTH_SESSION_STORE, useClass: BrowserAuthSessionStore },
    ...provideDataAdapters(environment.mode),
  ],
};
