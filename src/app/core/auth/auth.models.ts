export interface Player {
  id: string;
  displayName: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  expiresAtUtc: string;
  player: Player;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export type AuthErrorCode =
  'duplicate-email' | 'invalid-credentials' | 'invalid-data' | 'session-expired' | 'unavailable';

export class AuthError extends Error {
  constructor(
    readonly code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
