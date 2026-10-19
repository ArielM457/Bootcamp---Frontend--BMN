import { TestBed } from '@angular/core/testing';
import { AuthSession } from '../../core/auth/auth.models';
import { MockAuthRepository } from './mock-auth.repository';
import { AUTH_SESSION_STORE, AuthSessionStore } from '../storage/auth-session.store';

class MemorySessionStore implements AuthSessionStore {
  value: AuthSession | null = null;
  read(): AuthSession | null {
    return this.value;
  }
  save(session: AuthSession): void {
    this.value = session;
  }
  clear(): void {
    this.value = null;
  }
}

describe('MockAuthRepository AUTH-01', () => {
  let repository: MockAuthRepository;
  let store: MemorySessionStore;

  beforeEach(() => {
    store = new MemorySessionStore();
    TestBed.configureTestingModule({
      providers: [MockAuthRepository, { provide: AUTH_SESSION_STORE, useValue: store }],
    });
    repository = TestBed.inject(MockAuthRepository);
  });

  it('registra un jugador y conserva una sesión sin contraseña', async () => {
    const session = await repository.register({
      displayName: 'Ariel',
      email: 'ariel@juego.com',
      password: 'bomber123',
    });

    expect(session.player.displayName).toBe('Ariel');
    expect(store.value).toEqual(session);
    expect(JSON.stringify(store.value)).not.toContain('bomber123');
  });

  it('permite volver a entrar y rechaza credenciales incorrectas', async () => {
    await repository.register({
      displayName: 'Ariel',
      email: 'ariel@juego.com',
      password: 'bomber123',
    });
    await repository.logout();

    const session = await repository.login({ email: 'ariel@juego.com', password: 'bomber123' });
    expect(session.player.displayName).toBe('Ariel');

    await expect(
      repository.login({ email: 'ariel@juego.com', password: 'incorrecta' }),
    ).rejects.toMatchObject({ code: 'invalid-credentials' });
  });

  it('rechaza correos repetidos y elimina sesiones vencidas', async () => {
    const request = { displayName: 'Ariel', email: 'ariel@juego.com', password: 'bomber123' };
    await repository.register(request);

    await expect(repository.register(request)).rejects.toMatchObject({ code: 'duplicate-email' });

    store.value = {
      accessToken: 'expired',
      expiresAtUtc: new Date(0).toISOString(),
      player: { id: 'player-1', displayName: 'Ariel' },
    };
    expect(await repository.restoreSession()).toBeNull();
    expect(store.value).toBeNull();
  });
});
