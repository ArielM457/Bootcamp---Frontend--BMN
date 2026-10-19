import { Injectable } from '@angular/core';
import { GameSnapshot } from '../../core/game/game.models';

@Injectable({ providedIn: 'root' })
export class CanvasRenderer {
  readonly cellSize = 48;

  render(canvas: HTMLCanvasElement, snapshot: GameSnapshot): void {
    canvas.width = snapshot.width * this.cellSize;
    canvas.height = snapshot.height * this.cellSize;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const cell of snapshot.cells) this.drawCell(context, cell.x, cell.y, cell.kind);
    for (const bomb of snapshot.bombs) this.drawBomb(context, bomb.x, bomb.y);
    for (const explosion of snapshot.explosions)
      for (const cell of explosion.cells) this.drawExplosion(context, cell.x, cell.y);
    for (const player of snapshot.players)
      if (player.alive) this.drawPlayer(context, player.x, player.y, player.color);
  }

  cellRect(x: number, y: number): { x: number; y: number; size: number } {
    return { x: x * this.cellSize, y: y * this.cellSize, size: this.cellSize };
  }

  private drawCell(context: CanvasRenderingContext2D, x: number, y: number, kind: string): void {
    const rect = this.cellRect(x, y);
    context.fillStyle = kind === 'floor' ? '#4f2858' : kind === 'wall' ? '#8d4c91' : '#f5a5b8';
    context.fillRect(rect.x, rect.y, rect.size, rect.size);
    context.strokeStyle = kind === 'wall' ? '#c987ca' : '#3b1742';
    context.lineWidth = 2;
    context.strokeRect(rect.x + 1, rect.y + 1, rect.size - 2, rect.size - 2);
    if (kind === 'crate') {
      context.strokeStyle = '#b94e82';
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(rect.x + 8, rect.y + 8);
      context.lineTo(rect.x + rect.size - 8, rect.y + rect.size - 8);
      context.moveTo(rect.x + rect.size - 8, rect.y + 8);
      context.lineTo(rect.x + 8, rect.y + rect.size - 8);
      context.stroke();
    }
  }

  private drawPlayer(context: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    const { x: px, y: py, size } = this.cellRect(x, y);
    context.fillStyle = color;
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(px + size / 2, py + size / 2, size * 0.32, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.fillStyle = '#2b0d31';
    context.fillRect(px + 16, py + 19, 4, 6);
    context.fillRect(px + 28, py + 19, 4, 6);
  }

  private drawBomb(context: CanvasRenderingContext2D, x: number, y: number): void {
    const { x: px, y: py, size } = this.cellRect(x, y);
    context.fillStyle = '#16081c';
    context.strokeStyle = '#ffffff';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(px + size / 2, py + size / 2 + 3, size * 0.28, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.strokeStyle = '#ffe66d';
    context.beginPath();
    context.moveTo(px + 28, py + 14);
    context.quadraticCurveTo(px + 38, py + 7, px + 37, py + 2);
    context.stroke();
  }

  private drawExplosion(context: CanvasRenderingContext2D, x: number, y: number): void {
    const { x: px, y: py, size } = this.cellRect(x, y);
    context.fillStyle = '#ffe66d';
    context.fillRect(px + 5, py + size * 0.35, size - 10, size * 0.3);
    context.fillRect(px + size * 0.35, py + 5, size * 0.3, size - 10);
    context.fillStyle = '#c63bc9';
    context.fillRect(px + size * 0.35, py + size * 0.35, size * 0.3, size * 0.3);
  }
}
