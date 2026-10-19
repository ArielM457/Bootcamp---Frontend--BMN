import { InjectionToken } from '@angular/core';
import { AuthSession } from '../../core/auth/auth.models';

export interface AuthSessionStore {
  read(): AuthSession | null;
  save(session: AuthSession): void;
  clear(): void;
}

export const AUTH_SESSION_STORE = new InjectionToken<AuthSessionStore>('AUTH_SESSION_STORE');
