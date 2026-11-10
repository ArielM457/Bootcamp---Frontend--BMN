import {
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
export class Game implements OnInit, OnDestroy {
  private readonly movementRepeatMs = 220;
  private board: ElementRef<HTMLCanvasElement> | null = null;
  private readonly pressedDirections = new Map<string, Direction>();
  private activeMovementKey: string | null = null;
  private movementTimer: ReturnType<typeof setInterval> | null = null;

  @ViewChild('board')
  private set boardElement(board: ElementRef<HTMLCanvasElement> | undefined) {
    this.board = board ?? null;
    this.renderSnapshot();
  }
  readonly game = inject(GameFacade);
  private readonly input = inject(GameInputController);
  private readonly renderer = inject(CanvasRenderer);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const snapshot = this.game.snapshot();
      if (snapshot) this.renderSnapshot();
    });
  }

  ngOnInit(): void {
    const gameId = this.route.snapshot.queryParamMap.get('gameId') ?? '';
    this.game.start(gameId);
  }
  ngOnDestroy(): void {
    this.stopMovement();
    this.renderer.reset();
    this.game.stop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    const command = this.input.fromKey(event);
    if (!command) return;
    event.preventDefault();
    if (command.type === 'place-bomb') {
      if (!event.repeat) this.game.send(command);
      return;
    }

    const keyId = event.code || event.key.toLowerCase();
    if (event.repeat || this.pressedDirections.has(keyId)) return;
    this.pressedDirections.set(keyId, command.direction);
    this.activeMovementKey = keyId;

    if (this.movementTimer === null) {
      this.game.send(command);
      this.movementTimer = setInterval(() => this.repeatMovement(), this.movementRepeatMs);
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    const keyId = event.code || event.key.toLowerCase();
    if (!this.pressedDirections.delete(keyId)) return;
    if (this.activeMovementKey === keyId) {
      this.activeMovementKey = [...this.pressedDirections.keys()].at(-1) ?? null;
    }
    if (this.pressedDirections.size === 0) this.stopMovement();
  }

  @HostListener('window:blur')
  handleWindowBlur(): void {
    this.stopMovement();
  }

  move(direction: Direction): void {
    this.game.send({ type: 'move', direction });
  }

  placeBomb(): void {
    this.game.send({ type: 'place-bomb' });
  }

  async returnToMenu(): Promise<void> {
    await this.router.navigate(['/menu']);
  }

  private renderSnapshot(): void {
    const snapshot = this.game.snapshot();
    const canvas = this.board?.nativeElement;
    if (snapshot && canvas) this.renderer.render(canvas, snapshot);
  }

  private repeatMovement(): void {
    const direction = this.activeMovementKey
      ? this.pressedDirections.get(this.activeMovementKey)
      : undefined;
    if (!direction || !this.game.controlsEnabled()) {
      this.stopMovement();
      return;
    }
    this.game.send({ type: 'move', direction });
  }

  private stopMovement(): void {
    if (this.movementTimer !== null) clearInterval(this.movementTimer);
    this.movementTimer = null;
    this.activeMovementKey = null;
    this.pressedDirections.clear();
  }
}
