import { TestBed } from '@angular/core/testing';
import { API_MODE_UNAVAILABLE_MESSAGE, appConfig, provideDataAdapters } from './app.config';
import { environment } from '../environments/environment';
import { AUTH_REPOSITORY } from './core/auth/auth.repository';
import { ROOM_REPOSITORY } from './core/rooms/room.repository';
import { GAME_PORT } from './core/game/game.port';
import { SCORE_REPOSITORY } from './core/score/score.repository';
import { AUTH_SESSION_STORE } from './infrastructure/storage/auth-session.store';
import { BrowserAuthSessionStore } from './infrastructure/storage/browser-auth-session.store';
import { MockAuthRepository } from './infrastructure/mocks/mock-auth.repository';
import { MockRoomRepository } from './infrastructure/mocks/mock-room.repository';
import { MockRealtimeGameAdapter } from './infrastructure/mocks/mock-realtime-game.adapter';
import { MockScoreRepository } from './infrastructure/mocks/mock-score.repository';

describe('provideDataAdapters', () => {
  it('registra los adaptadores locales en modo demo', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AUTH_SESSION_STORE, useClass: BrowserAuthSessionStore },
        ...provideDataAdapters('demo'),
      ],
    });
    expect(TestBed.inject(AUTH_REPOSITORY)).toBeInstanceOf(MockAuthRepository);
    expect(TestBed.inject(ROOM_REPOSITORY)).toBeInstanceOf(MockRoomRepository);
    expect(TestBed.inject(GAME_PORT)).toBeInstanceOf(MockRealtimeGameAdapter);
    expect(TestBed.inject(SCORE_REPOSITORY)).toBeInstanceOf(MockScoreRepository);
  });

  it('falla con un mensaje claro en modo api', () => {
    expect(() => provideDataAdapters('api')).toThrowError(API_MODE_UNAVAILABLE_MESSAGE);
    expect(API_MODE_UNAVAILABLE_MESSAGE).toContain('adaptadores HTTP y SignalR');
  });

  it('usa el modo demo del environment por defecto', () => {
    expect(environment.mode).toBe('demo');
    expect(appConfig.providers).toContainEqual({
      provide: AUTH_REPOSITORY,
      useClass: MockAuthRepository,
    });
  });
});
