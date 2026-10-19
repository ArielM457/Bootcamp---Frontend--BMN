import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-lobby',
  imports: [RouterLink],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/']);
  }
}
