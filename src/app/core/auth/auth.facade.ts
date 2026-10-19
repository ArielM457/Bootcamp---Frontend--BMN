import { computed, inject, Injectable, signal } from '@angular/core';
import { AUTH_REPOSITORY } from './auth.repository';
import { AuthError, AuthSession, AuthStatus, LoginRequest, RegisterRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly repository = inject(AUTH_REPOSITORY);
  private readonly sessionState = signal<AuthSession | null>(null);
  private readonly statusState = signal<AuthStatus>('idle');
  private readonly errorState = signal<string | null>(null);
  private restorePromise: Promise<boolean> | null = null;

  readonly session = this.sessionState.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly player = computed(() => this.sessionState()?.player ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);
  readonly isLoading = computed(() => this.statusState() === 'loading');

  ensureSession(): Promise<boolean> {
    if (this.sessionState()) {
      return Promise.resolve(true);
    }
    this.restorePromise ??= this.restoreSession();
    return this.restorePromise;
  }

  async login(request: LoginRequest): Promise<boolean> {
    return this.authenticate(() => this.repository.login(request));
  }

  async register(request: RegisterRequest): Promise<boolean> {
    return this.authenticate(() => this.repository.register(request));
  }

  async logout(): Promise<void> {
    await this.repository.logout();
    this.sessionState.set(null);
    this.statusState.set('idle');
    this.errorState.set(null);
    this.restorePromise = null;
  }

  clearError(): void {
    this.errorState.set(null);
    if (!this.sessionState()) {
      this.statusState.set('idle');
    }
  }

  private async restoreSession(): Promise<boolean> {
    try {
      const session = await this.repository.restoreSession();
      this.sessionState.set(session);
      this.statusState.set(session ? 'authenticated' : 'idle');
      return session !== null;
    } catch {
      this.sessionState.set(null);
      this.statusState.set('idle');
      return false;
    }
  }

  private async authenticate(operation: () => Promise<AuthSession>): Promise<boolean> {
    this.statusState.set('loading');
    this.errorState.set(null);
    try {
      const session = await operation();
      this.sessionState.set(session);
      this.statusState.set('authenticated');
      this.restorePromise = Promise.resolve(true);
      return true;
    } catch (error: unknown) {
      this.sessionState.set(null);
      this.statusState.set('error');
      this.errorState.set(this.messageFor(error));
      return false;
    }
  }

  private messageFor(error: unknown): string {
    if (!(error instanceof AuthError)) {
      return 'No pudimos completar la operación. Inténtalo de nuevo.';
    }
    switch (error.code) {
      case 'duplicate-email':
        return 'Ya existe una cuenta con este correo.';
      case 'invalid-credentials':
        return 'El correo o la contraseña no son correctos.';
      case 'invalid-data':
        return 'Revisa los datos ingresados.';
      case 'session-expired':
        return 'Tu sesión terminó. Vuelve a entrar.';
      case 'unavailable':
        return 'El acceso no está disponible en este momento.';
    }
  }
}
