import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  template: `
    <section class="placeholder" aria-labelledby="next-title">
      <p class="eyebrow">SIGUIENTE ETAPA</p>
      <h1 id="next-title">La partida está por comenzar.</h1>
      <p>
        Estamos definiendo autenticación, salas y juego con contratos antes de implementarlos. Esta
        pantalla solo muestra la navegación inicial.
      </p>
      <a class="primary-action" routerLink="/">Volver al inicio</a>
    </section>
  `,
})
export class ComingSoon {}
