import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  template: `
    <section class="hero" aria-labelledby="welcome-title">
      <div class="hero-copy">
        <p class="eyebrow">CODE SPRINT · EXPERIENCIA MULTIJUGADOR</p>
        <h1 id="welcome-title">Una chispa.<br /><span>Mil jugadas.</span></h1>
        <p class="intro">
          Estamos preparando Bomberman Online para el bootcamp CodeSprint. Aquí podrás aprender,
          conectar y jugar en tiempo real.
        </p>
        <a class="primary-action" routerLink="/proximamente"
          >Conoce lo que viene <span aria-hidden="true">↗</span></a
        >
        <p class="status">
          La versión actual es una base de desarrollo. El juego aún no está disponible.
        </p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="grid-board">
          <span class="tile block"></span><span class="tile"></span><span class="tile wall"></span
          ><span class="tile"></span><span class="tile block"></span> <span class="tile"></span
          ><span class="tile bomb">●</span><span class="tile"></span
          ><span class="tile spark">✦</span><span class="tile"></span>
          <span class="tile wall"></span><span class="tile"></span><span class="tile player">★</span
          ><span class="tile"></span><span class="tile wall"></span> <span class="tile"></span
          ><span class="tile spark">✦</span><span class="tile"></span
          ><span class="tile bomb">●</span><span class="tile"></span>
          <span class="tile block"></span><span class="tile"></span><span class="tile wall"></span
          ><span class="tile"></span><span class="tile block"></span>
        </div>
      </div>
    </section>
    <section class="feature-strip" aria-label="Próximas funciones">
      <article>
        <span>01 / JUEGA</span>
        <h2>Partidas en línea</h2>
        <p>Salas y tablero para competir con otros jugadores.</p>
      </article>
      <article>
        <span>02 / APRENDE</span>
        <h2>Código en acción</h2>
        <p>Un frontend preparado para conectar los servicios del bootcamp.</p>
      </article>
      <article>
        <span>03 / CRECE</span>
        <h2>Ranking</h2>
        <p>Resultados y puntuaciones al cerrar cada partida.</p>
      </article>
    </section>
  `,
  styleUrl: './welcome.scss',
})
export class Welcome {}
