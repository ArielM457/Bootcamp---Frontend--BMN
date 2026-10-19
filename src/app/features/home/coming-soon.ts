import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  template: `
    <section class="coming-soon" aria-labelledby="next-title">
      <div class="coming-card">
        <p class="eyebrow">PRÓXIMAMENTE</p>
        <span class="pixel-bomb" aria-hidden="true"></span>
        <h1 id="next-title">{{ option }}</h1>
        <p>Estamos preparando esta opción. Vuelve pronto para encontrar nuevas formas de jugar.</p>
        <a class="primary-action" routerLink="/">Volver al inicio</a>
      </div>
    </section>
  `,
  styleUrl: './coming-soon.scss',
})
export class ComingSoon {
  private readonly route = inject(ActivatedRoute);
  readonly option =
    this.route.snapshot.queryParamMap.get('opcion') ?? 'La partida está por comenzar';
}
