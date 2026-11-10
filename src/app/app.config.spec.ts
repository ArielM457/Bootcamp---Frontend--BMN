import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';
import { AUTH_REPOSITORY } from './core/auth/auth.repository';
import { GAME_PORT } from './core/game/game.port';
import { ROOM_REPOSITORY } from './core/rooms/room.repository';
import { HttpAuthRepository } from './infrastructure/api/http-auth.repository';
import { HttpRoomRepository } from './infrastructure/api/http-room.repository';
import { SignalRGameAdapter } from './infrastructure/realtime/signalr-game.adapter';

describe('appConfig', () => {
  it('registra solamente adaptadores HTTP y SignalR', () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });

    expect(TestBed.inject(AUTH_REPOSITORY)).toBeInstanceOf(HttpAuthRepository);
    expect(TestBed.inject(ROOM_REPOSITORY)).toBeInstanceOf(HttpRoomRepository);
    expect(TestBed.inject(GAME_PORT)).toBeInstanceOf(SignalRGameAdapter);
  });
});
