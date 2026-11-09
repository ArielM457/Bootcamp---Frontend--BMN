import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthError,
  AuthSession,
  LoginRequest,
  Player,
  RegisterRequest,
} from '../../core/auth/auth.models';
import { AuthRepository } from '../../core/auth/auth.repository';
import { AUTH_SESSION_STORE } from '../storage/auth-session.store';

interface BackendUsuario {
  id: number;
  nombre: string;
  correo: string;
  playerId: number;
}

interface BackendAuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  usuario: BackendUsuario;
}

interface BackendCurrentUser {
  usuarioId: string;
  playerId: string;
  nombre: string;
}

@Injectable()
export class HttpAuthRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly store = inject(AUTH_SESSION_STORE);
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');

  async register(request: RegisterRequest): Promise<AuthSession> {
    try {
      const response = await firstValueFrom(
        this.http.post<BackendAuthResponse>(`${this.apiUrl}/api/auth/register`, {
          nombre: request.displayName.trim(),
          correo: request.email.trim().toLowerCase(),
          password: request.password,
        }),
      );
      return this.saveResponse(response);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        throw new AuthError('duplicate-email', 'Duplicate email');
      }
      if (error instanceof HttpErrorResponse && error.status === 400) {
        throw new AuthError('invalid-data', 'Invalid registration data');
      }
      throw new AuthError('unavailable', 'Authentication unavailable');
    }
  }

  async login(request: LoginRequest): Promise<AuthSession> {
    try {
      const response = await firstValueFrom(
        this.http.post<BackendAuthResponse>(`${this.apiUrl}/api/auth/login`, {
          correo: request.email.trim().toLowerCase(),
          password: request.password,
        }),
      );
      return this.saveResponse(response);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        throw new AuthError('invalid-credentials', 'Invalid credentials');
      }
      if (error instanceof HttpErrorResponse && error.status === 400) {
        throw new AuthError('invalid-data', 'Invalid login data');
      }
      throw new AuthError('unavailable', 'Authentication unavailable');
    }
  }

  async restoreSession(): Promise<AuthSession | null> {
    const session = this.store.read();
    if (!session) return null;

    if (Date.parse(session.expiresAtUtc) <= Date.now()) {
      this.store.clear();
      return null;
    }

    try {
      const currentUser = await firstValueFrom(
        this.http.get<BackendCurrentUser>(`${this.apiUrl}/api/auth/me`, {
          headers: this.authorization(session.accessToken),
        }),
      );
      const restored: AuthSession = {
        ...session,
        player: {
          ...session.player,
          id: currentUser.playerId,
          displayName: currentUser.nombre,
        },
      };
      this.store.save(restored);
      return restored;
    } catch {
      this.store.clear();
      return null;
    }
  }

  async logout(): Promise<void> {
    this.store.clear();
  }

  private saveResponse(response: BackendAuthResponse): AuthSession {
    const player: Player = {
      id: response.usuario.playerId.toString(),
      displayName: response.usuario.nombre,
      fullName: response.usuario.nombre,
      nickname: response.usuario.nombre,
      avatarId: 'azure',
    };
    const session: AuthSession = {
      accessToken: response.accessToken,
      expiresAtUtc: response.expiresAtUtc,
      player,
    };
    this.store.save(session);
    return session;
  }

  private authorization(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
