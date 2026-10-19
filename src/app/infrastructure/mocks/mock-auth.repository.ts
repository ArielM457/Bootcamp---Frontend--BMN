import { inject, Injectable } from '@angular/core';
import {
  AuthError,
  AuthSession,
  LoginRequest,
  Player,
  RegisterRequest,
} from '../../core/auth/auth.models';
import { AuthRepository } from '../../core/auth/auth.repository';
import { AUTH_SESSION_STORE } from '../storage/auth-session.store';

interface LocalAccount {
  email: string;
  password: string;
  player: Player;
}

@Injectable()
export class MockAuthRepository implements AuthRepository {
  private readonly store = inject(AUTH_SESSION_STORE);
  private readonly accounts = new Map<string, LocalAccount>();

  async register(request: RegisterRequest): Promise<AuthSession> {
    await this.wait();
    const email = request.email.trim().toLowerCase();
    const displayName = request.displayName.trim();
    if (displayName.length < 2 || displayName.length > 40 || request.password.length < 8) {
      throw new AuthError('invalid-data', 'Invalid registration data');
    }
    if (this.accounts.has(email)) {
      throw new AuthError('duplicate-email', 'Duplicate email');
    }
    const player: Player = { id: this.createId(), displayName };
    this.accounts.set(email, { email, password: request.password, player });
    return this.createSession(player);
  }

  async login(request: LoginRequest): Promise<AuthSession> {
    await this.wait();
    const account = this.accounts.get(request.email.trim().toLowerCase());
    if (!account || account.password !== request.password) {
      throw new AuthError('invalid-credentials', 'Invalid credentials');
    }
    return this.createSession(account.player);
  }

  async restoreSession(): Promise<AuthSession | null> {
    const session = this.store.read();
    if (!session) return null;
    if (Date.parse(session.expiresAtUtc) <= Date.now()) {
      this.store.clear();
      return null;
    }
    return session;
  }

  async logout(): Promise<void> {
    this.store.clear();
  }

  private createSession(player: Player): AuthSession {
    const session: AuthSession = {
      accessToken: `local-${this.createId()}`,
      expiresAtUtc: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      player,
    };
    this.store.save(session);
    return session;
  }

  private createId(): string {
    return (
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 180));
  }
}
