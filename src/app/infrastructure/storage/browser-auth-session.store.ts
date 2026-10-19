import { Injectable } from '@angular/core';
import { AuthSession } from '../../core/auth/auth.models';
import { AuthSessionStore } from './auth-session.store';

@Injectable()
export class BrowserAuthSessionStore implements AuthSessionStore {
  private readonly key = 'bomberman.auth.session';

  read(): AuthSession | null {
    try {
      const value = globalThis.sessionStorage?.getItem(this.key);
      if (!value) return null;
      const candidate: unknown = JSON.parse(value);
      return this.isSession(candidate) ? candidate : null;
    } catch {
      return null;
    }
  }

  save(session: AuthSession): void {
    try {
      globalThis.sessionStorage?.setItem(this.key, JSON.stringify(session));
    } catch {
      // La sesión sigue disponible en memoria si el navegador bloquea el almacenamiento.
    }
  }

  clear(): void {
    try {
      globalThis.sessionStorage?.removeItem(this.key);
    } catch {
      // No hay nada más que limpiar si el navegador bloquea el almacenamiento.
    }
  }

  private isSession(value: unknown): value is AuthSession {
    if (typeof value !== 'object' || value === null) return false;
    const session = value as Record<string, unknown>;
    const player = session['player'];
    return (
      typeof session['accessToken'] === 'string' &&
      typeof session['expiresAtUtc'] === 'string' &&
      typeof player === 'object' &&
      player !== null &&
      typeof (player as Record<string, unknown>)['id'] === 'string' &&
      typeof (player as Record<string, unknown>)['displayName'] === 'string'
    );
  }
}
