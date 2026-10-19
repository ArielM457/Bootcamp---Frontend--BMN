import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Direction } from '../../core/game/game.models';
import { GameFacade } from '../../core/game/game.facade';
import { GameInputController } from '../../core/game/game-input.controller';
import { CanvasRenderer } from './canvas-renderer';
import { ScoreFacade } from '../../core/score/score.facade';

@Component({
  selector: 'app-game',
  imports: [RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('board') private board?: ElementRef<HTMLCanvasElement>;
  readonly game = inject(GameFacade);
  readonly scores = inject(ScoreFacade);
  private readonly input = inject(GameInputController);
  private readonly renderer = inject(CanvasRenderer);
  private viewReady = false;

  constructor() {
    effect(() => {
      const snapshot = this.game.snapshot();
      if (snapshot) {
        if (this.viewReady) this.renderer.render(this.board!.nativeElement, snapshot);
        if (snapshot.phase === 'finished') void this.scores.record(snapshot);
      }
    });
  }

  ngOnInit(): void {
    this.game.start();
  }
  ngAfterViewInit(): void {
    this.viewReady = true;
    const snapshot = this.game.snapshot();
    if (snapshot) this.renderer.render(this.board!.nativeElement, snapshot);
  }
  ngOnDestroy(): void {
    this.game.stop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    const command = this.input.fromKey(event);
    if (!command) return;
    event.preventDefault();
    this.game.send(command);
  }

  move(direction: Direction): void {
    this.game.send({ type: 'move', direction });
  }
  bomb(): void {
    this.game.send({ type: 'place-bomb' });
  }
  restart(): void {
    this.game.send({ type: 'restart' });
  }
}
