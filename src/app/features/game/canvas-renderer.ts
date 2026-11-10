import { Injectable } from '@angular/core';
import { Direction, GameSnapshot, PlayerState } from '../../core/game/game.models';

interface PlayerSprites {
  idle: string;
  walking: readonly [string, string];
}

interface PlayerVisualState {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  direction: Direction;
  startedAt: number;
  walkStartedAt: number;
  walkFrameOffset: number;
  moving: boolean;
}

export const PLAYER_SPRITES: Record<Direction, PlayerSprites> = {
  down: {
    idle: '/bomberman/up/first.png',
    walking: [
      '/bomberman/up/Imagen de ChatGPT 28 oct 2026, 09_00_29.png',
      '/bomberman/up/Imagen de ChatGPT 28 oct 2026, 09_00_34.png',
    ],
  },
  left: {
    idle: '/bomberman/left/first.png',
    walking: [
      '/bomberman/left/Imagen de ChatGPT 28 oct 2026, 08_59_07.png',
      '/bomberman/left/Imagen de ChatGPT 28 oct 2026, 08_59_37.png',
    ],
  },
  right: {
    idle: '/bomberman/right/first.png',
    walking: [
      '/bomberman/right/Imagen de ChatGPT 28 oct 2026, 08_58_59.png',
      '/bomberman/right/Imagen de ChatGPT 28 oct 2026, 08_59_57.png',
    ],
  },
  up: {
    idle: '/bomberman/down/first.png',
    walking: [
      '/bomberman/down/Imagen de ChatGPT 28 oct 2026, 08_58_41.png',
      '/bomberman/down/Imagen de ChatGPT 28 oct 2026, 08_58_47.png',
    ],
  },
};

@Injectable({ providedIn: 'root' })
export class CanvasRenderer {
  readonly cellSize = 48;
  private readonly movementDuration = 220;
  private readonly walkingFrameDuration = 180;
  private readonly playerVisuals = new Map<string, PlayerVisualState>();
  private readonly spriteImages = new Map<string, HTMLImageElement>();
  private canvas: HTMLCanvasElement | null = null;
  private snapshot: GameSnapshot | null = null;
  private animationFrame: number | null = null;

  render(canvas: HTMLCanvasElement, snapshot: GameSnapshot): void {
    this.canvas = canvas;
    this.snapshot = snapshot;
    this.preloadSprites();
    canvas.width = snapshot.width * this.cellSize;
    canvas.height = snapshot.height * this.cellSize;

    const now = this.now();
    this.updatePlayerVisuals(snapshot.players, now);
    this.drawFrame(now);
    this.scheduleAnimation();
  }

  reset(): void {
    if (this.animationFrame !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = null;
    this.canvas = null;
    this.snapshot = null;
    this.playerVisuals.clear();
  }

  cellRect(x: number, y: number): { x: number; y: number; size: number } {
    return { x: x * this.cellSize, y: y * this.cellSize, size: this.cellSize };
  }

  playerSprite(direction: Direction, moving: boolean, elapsedMs = 0, frameOffset = 0): string {
    const sprites = PLAYER_SPRITES[direction];
    if (!moving) return sprites.idle;
    return sprites.walking[(frameOffset + Math.floor(elapsedMs / this.walkingFrameDuration)) % 2];
  }

  private updatePlayerVisuals(players: PlayerState[], now: number): void {
    const activePlayerIds = new Set(players.map((player) => player.playerId));
    for (const playerId of this.playerVisuals.keys()) {
      if (!activePlayerIds.has(playerId)) this.playerVisuals.delete(playerId);
    }

    for (const player of players) {
      const visual = this.playerVisuals.get(player.playerId);
      if (!visual) {
        this.playerVisuals.set(player.playerId, {
          fromX: player.x,
          fromY: player.y,
          toX: player.x,
          toY: player.y,
          direction: 'down',
          startedAt: now,
          walkStartedAt: now,
          walkFrameOffset: 0,
          moving: false,
        });
        continue;
      }

      if (visual.toX === player.x && visual.toY === player.y) continue;

      const current = this.visualPosition(visual, now);
      const wasMoving = visual.moving;
      visual.fromX = current.x;
      visual.fromY = current.y;
      visual.direction = this.directionBetween(visual.toX, visual.toY, player.x, player.y);
      visual.toX = player.x;
      visual.toY = player.y;
      visual.startedAt = now;
      visual.moving = !this.prefersReducedMotion();

      if (visual.moving && !wasMoving) {
        visual.walkStartedAt = now;
        visual.walkFrameOffset = (visual.walkFrameOffset + 1) % 2;
      }

      if (!visual.moving) {
        visual.fromX = player.x;
        visual.fromY = player.y;
      }
    }
  }

  private drawFrame(now: number): void {
    if (!this.canvas || !this.snapshot) return;
    const context = this.canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const cell of this.snapshot.cells) this.drawCell(context, cell.x, cell.y, cell.kind);
    for (const bomb of this.snapshot.bombs) this.drawBomb(context, bomb.x, bomb.y);
    for (const player of this.snapshot.players.filter((item) => item.isAlive)) {
      this.drawPlayer(context, player, now);
    }
    for (const explosion of this.snapshot.explosions) {
      for (const cell of explosion.cells) this.drawExplosion(context, cell.x, cell.y);
    }
  }

  private drawCell(context: CanvasRenderingContext2D, x: number, y: number, kind: string): void {
    const rect = this.cellRect(x, y);
    if (kind === 'wall') {
      this.drawStoneWall(context, rect.x, rect.y, rect.size);
    } else if (kind === 'crate') {
      this.drawFloor(context, rect.x, rect.y, rect.size, x, y);
      this.drawWoodenCrate(context, rect.x, rect.y, rect.size);
    } else {
      this.drawFloor(context, rect.x, rect.y, rect.size, x, y);
    }
  }

  private drawFloor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    cellX: number,
    cellY: number,
  ): void {
    const gradient = context.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, (cellX + cellY) % 2 === 0 ? '#392348' : '#342043');
    gradient.addColorStop(1, '#24152f');
    context.fillStyle = gradient;
    context.fillRect(x, y, size, size);
    context.strokeStyle = 'rgba(244, 197, 255, 0.08)';
    context.lineWidth = 1;
    context.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
  }

  private drawStoneWall(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
  ): void {
    const gradient = context.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, '#9f86ad');
    gradient.addColorStop(0.48, '#705879');
    gradient.addColorStop(1, '#44334d');
    context.fillStyle = gradient;
    context.fillRect(x, y, size, size);

    context.fillStyle = 'rgba(255, 255, 255, 0.14)';
    context.fillRect(x + 3, y + 3, size - 6, 3);
    context.fillRect(x + 3, y + 6, 3, size - 9);
    context.fillStyle = 'rgba(19, 10, 25, 0.3)';
    context.fillRect(x + 4, y + size - 6, size - 8, 3);
    context.fillRect(x + size - 6, y + 6, 3, size - 9);

    context.strokeStyle = '#392740';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, y + size / 2);
    context.lineTo(x + size, y + size / 2);
    context.moveTo(x + size / 2, y);
    context.lineTo(x + size / 2, y + size / 2);
    context.moveTo(x + size / 4, y + size / 2);
    context.lineTo(x + size / 4, y + size);
    context.moveTo(x + (size * 3) / 4, y + size / 2);
    context.lineTo(x + (size * 3) / 4, y + size);
    context.stroke();

    context.strokeStyle = '#bca8c7';
    context.lineWidth = 2;
    context.strokeRect(x + 2, y + 2, size - 4, size - 4);
  }

  private drawWoodenCrate(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
  ): void {
    const margin = 4;
    const crateSize = size - margin * 2;
    const gradient = context.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, '#d99a51');
    gradient.addColorStop(0.52, '#a85f2d');
    gradient.addColorStop(1, '#693719');
    context.fillStyle = gradient;
    context.fillRect(x + margin, y + margin, crateSize, crateSize);

    context.strokeStyle = '#4b2513';
    context.lineWidth = 5;
    context.strokeRect(x + margin + 1, y + margin + 1, crateSize - 2, crateSize - 2);
    context.beginPath();
    context.moveTo(x + 9, y + 9);
    context.lineTo(x + size - 9, y + size - 9);
    context.moveTo(x + size - 9, y + 9);
    context.lineTo(x + 9, y + size - 9);
    context.stroke();

    context.strokeStyle = 'rgba(255, 218, 151, 0.5)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x + 8, y + 7);
    context.lineTo(x + size - 8, y + 7);
    context.moveTo(x + 7, y + 8);
    context.lineTo(x + 7, y + size - 8);
    context.stroke();

    context.fillStyle = '#e0bd78';
    for (const [nailX, nailY] of [
      [x + 9, y + 9],
      [x + size - 9, y + 9],
      [x + 9, y + size - 9],
      [x + size - 9, y + size - 9],
    ]) {
      context.beginPath();
      context.arc(nailX, nailY, 1.8, 0, Math.PI * 2);
      context.fill();
    }
  }

  private drawPlayer(context: CanvasRenderingContext2D, player: PlayerState, now: number): void {
    const visual = this.playerVisuals.get(player.playerId);
    if (!visual) return;
    const elapsed = now - visual.startedAt;
    if (visual.moving && elapsed >= this.movementDuration) {
      visual.moving = false;
      visual.fromX = visual.toX;
      visual.fromY = visual.toY;
    }

    const position = this.visualPosition(visual, now);
    const walkingElapsed = now - visual.walkStartedAt;
    const path = this.playerSprite(
      visual.direction,
      visual.moving,
      walkingElapsed,
      visual.walkFrameOffset,
    );
    const image = this.spriteImage(path);
    const idleImage = visual.moving
      ? this.spriteImage(PLAYER_SPRITES[visual.direction].idle)
      : null;
    const visibleImage = this.isImageReady(image) ? image : idleImage;
    const px = position.x * this.cellSize;
    const py = position.y * this.cellSize;

    context.save();
    const playerColor = this.playerColor(player.playerId);
    context.fillStyle = playerColor;
    context.globalAlpha = 0.55;
    context.beginPath();
    context.ellipse(px + 24, py + this.cellSize + 9, 18, 5, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();

    if (this.isImageReady(visibleImage)) {
      const scale = Math.min(58 / visibleImage.naturalWidth, 62 / visibleImage.naturalHeight);
      const width = visibleImage.naturalWidth * scale;
      const height = visibleImage.naturalHeight * scale;
      context.drawImage(
        visibleImage,
        px + (this.cellSize - width) / 2,
        py + this.cellSize + 6 - height,
        width,
        height,
      );
      return;
    }

    this.drawPlayerFallback(context, px, py, playerColor);
  }

  private drawPlayerFallback(
    context: CanvasRenderingContext2D,
    px: number,
    py: number,
    color: string,
  ): void {
    context.fillStyle = color;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(px + 24, py + 24, 18, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  private spriteImage(path: string): HTMLImageElement | null {
    const cached = this.spriteImages.get(path);
    if (cached) return cached;
    if (typeof Image === 'undefined') return null;

    const image = new Image();
    image.onload = () => this.drawFrame(this.now());
    image.src = path;
    this.spriteImages.set(path, image);
    return image;
  }

  private preloadSprites(): void {
    for (const sprites of Object.values(PLAYER_SPRITES)) {
      this.spriteImage(sprites.idle);
      for (const path of sprites.walking) this.spriteImage(path);
    }
    this.spriteImage('/game-assets/items/bomb-normal.png');
  }

  private drawBomb(context: CanvasRenderingContext2D, x: number, y: number): void {
    const rect = this.cellRect(x, y);
    const image = this.spriteImage('/game-assets/items/bomb-normal.png');
    const pulse = 1 + Math.sin(Date.now() / 110) * 0.07;
    const size = rect.size * 0.72 * pulse;
    if (this.isImageReady(image)) {
      context.drawImage(
        image,
        rect.x + (rect.size - size) / 2,
        rect.y + (rect.size - size) / 2,
        size,
        size,
      );
      return;
    }
    context.fillStyle = '#17111d';
    context.beginPath();
    context.arc(rect.x + rect.size / 2, rect.y + rect.size / 2, size / 2.4, 0, Math.PI * 2);
    context.fill();
  }

  private drawExplosion(context: CanvasRenderingContext2D, x: number, y: number): void {
    const rect = this.cellRect(x, y);
    const gradient = context.createRadialGradient(
      rect.x + rect.size / 2,
      rect.y + rect.size / 2,
      2,
      rect.x + rect.size / 2,
      rect.y + rect.size / 2,
      rect.size / 2,
    );
    gradient.addColorStop(0, '#fff7b1');
    gradient.addColorStop(0.4, '#ffb000');
    gradient.addColorStop(1, 'rgba(255, 54, 74, 0.3)');
    context.fillStyle = gradient;
    context.fillRect(rect.x + 2, rect.y + 2, rect.size - 4, rect.size - 4);
  }

  private isImageReady(image: HTMLImageElement | null): image is HTMLImageElement {
    return image?.complete === true && image.naturalWidth > 0;
  }

  private visualPosition(visual: PlayerVisualState, now: number): { x: number; y: number } {
    if (!visual.moving) return { x: visual.toX, y: visual.toY };
    const progress = Math.min(1, Math.max(0, (now - visual.startedAt) / this.movementDuration));
    return {
      x: visual.fromX + (visual.toX - visual.fromX) * progress,
      y: visual.fromY + (visual.toY - visual.fromY) * progress,
    };
  }

  private directionBetween(fromX: number, fromY: number, toX: number, toY: number): Direction {
    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return deltaX < 0 ? 'left' : 'right';
    return deltaY < 0 ? 'up' : 'down';
  }

  private scheduleAnimation(): void {
    if (
      this.animationFrame !== null ||
      !this.hasAnimatedElements() ||
      typeof requestAnimationFrame !== 'function'
    ) {
      return;
    }

    this.animationFrame = requestAnimationFrame((time) => {
      this.animationFrame = null;
      this.drawFrame(time);
      this.scheduleAnimation();
    });
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  private now(): number {
    return typeof performance === 'undefined' ? Date.now() : performance.now();
  }

  private hasAnimatedElements(): boolean {
    return (
      [...this.playerVisuals.values()].some((visual) => visual.moving) ||
      (this.snapshot?.bombs.length ?? 0) > 0 ||
      (this.snapshot?.explosions.length ?? 0) > 0
    );
  }

  private playerColor(playerId: string): string {
    const colors = ['#2f8cff', '#8d6bff', '#ff6f91', '#22d3ee'];
    let value = 0;
    for (const character of playerId) value += character.charCodeAt(0);
    return colors[value % colors.length];
  }
}
