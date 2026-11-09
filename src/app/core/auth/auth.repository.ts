import { InjectionToken } from '@angular/core';
import { AuthSession, LoginRequest, RegisterRequest } from './auth.models';

export interface AuthRepository {
  register(request: RegisterRequest): Promise<AuthSession>;
  login(request: LoginRequest): Promise<AuthSession>;
  restoreSession(): Promise<AuthSession | null>;
  logout(): Promise<void>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
