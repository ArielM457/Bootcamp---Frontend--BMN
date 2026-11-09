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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Direction } from '../../core/game/game.models';
import { GameFacade } from '../../core/game/game.facade';
import { GameInputController } from '../../core/game/game-input.controller';
import { CanvasRenderer } from './canvas-renderer';

@Component({
  selector: 'app-game',
  imports: [RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('board') private board?: ElementRef<HTMLCanvasElement>;
  readonly game = inject(GameFacade);
  private readonly input = inject(GameInputController);
  private readonly renderer = inject(CanvasRenderer);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private viewReady = false;

  constructor() {
    effect(() => {
      const snapshot = this.game.snapshot();
      if (snapshot) {
        if (this.viewReady) this.renderer.render(this.board!.nativeElement, snapshot);
      }
    });
  }

  ngOnInit(): void {
    const gameId = this.route.snapshot.queryParamMap.get('gameId') ?? '';
    this.game.start(gameId);
  }
  ngAfterViewInit(): void {
    this.viewReady = true;
    const snapshot = this.game.snapshot();
    if (snapshot) this.renderer.render(this.board!.nativeElement, snapshot);
  }
  ngOnDestroy(): void {
    this.renderer.reset();
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

  async returnToMenu(): Promise<void> {
    await this.router.navigate(['/menu']);
  }
}
