import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { AUTH_REPOSITORY } from './core/auth/auth.repository';
import { HttpAuthRepository } from './infrastructure/api/http-auth.repository';
import { AUTH_SESSION_STORE } from './infrastructure/storage/auth-session.store';
import { BrowserAuthSessionStore } from './infrastructure/storage/browser-auth-session.store';
import { ROOM_REPOSITORY } from './core/rooms/room.repository';
import { HttpRoomRepository } from './infrastructure/api/http-room.repository';
import { GAME_PORT } from './core/game/game.port';
import { SignalRGameAdapter } from './infrastructure/realtime/signalr-game.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: AUTH_SESSION_STORE, useClass: BrowserAuthSessionStore },
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    { provide: ROOM_REPOSITORY, useClass: HttpRoomRepository },
    { provide: GAME_PORT, useClass: SignalRGameAdapter },
  ],
};
