import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Cell,
  Direction,
  GameCommand,
  GameSnapshot,
  PlayerState,
} from '../../core/game/game.models';

@Injectable()
export class LocalGameSimulator {
  private readonly subject = new BehaviorSubject<GameSnapshot>(this.emptySnapshot());
  readonly snapshots$ = this.subject.asObservable();
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;
  private playerId = '';

  start(playerId: string): void {
    this.stop();
    this.playerId = playerId;
    this.startedAt = Date.now();
    this.subject.next(this.initialSnapshot(playerId));
    this.timer = setInterval(() => this.tick(), 100);
  }

  send(command: GameCommand): void {
    if (command.type === 'restart') {
      this.start(this.playerId);
      return;
    }
    const snapshot = this.subject.value;
    if (snapshot.phase !== 'running') return;
    if (command.type === 'move') this.move(command.direction);
    else this.placeBomb();
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private move(direction: Direction): void {
    const snapshot = this.clone(this.subject.value);
    const player = snapshot.players.find((item) => item.playerId === this.playerId);
    if (!player?.alive) return;
    const delta = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
    const x = player.x + delta[0];
    const y = player.y + delta[1];
    const blocked =
      snapshot.cells.some((cell) => cell.x === x && cell.y === y && cell.kind !== 'floor') ||
      snapshot.bombs.some((bomb) => bomb.x === x && bomb.y === y);
    if (blocked) return;
    player.x = x;
    player.y = y;
    this.emit(snapshot);
  }

  private placeBomb(): void {
    const snapshot = this.clone(this.subject.value);
    const player = snapshot.players.find((item) => item.playerId === this.playerId);
    if (!player?.alive || snapshot.bombs.some((bomb) => bomb.ownerId === player.playerId)) return;
    const now = Date.now();
    snapshot.bombs.push({
      id: this.id(),
      ownerId: player.playerId,
      x: player.x,
      y: player.y,
      placedAtUtc: new Date(now).toISOString(),
      detonatesAtUtc: new Date(now + 1500).toISOString(),
      range: 2,
    });
    this.emit(snapshot);
  }

  private tick(): void {
    const snapshot = this.clone(this.subject.value);
    if (snapshot.phase !== 'running') return;
    const now = Date.now();
    let changed = false;
    const remaining = Math.max(0, 120 - Math.floor((now - this.startedAt) / 1000));
    if (remaining !== snapshot.remainingSeconds) {
      snapshot.remainingSeconds = remaining;
      changed = true;
    }
    const detonated = snapshot.bombs.filter((bomb) => Date.parse(bomb.detonatesAtUtc) <= now);
    for (const bomb of detonated) {
      this.explode(snapshot, bomb.x, bomb.y, bomb.range, now);
      changed = true;
    }
    snapshot.bombs = snapshot.bombs.filter((bomb) => Date.parse(bomb.detonatesAtUtc) > now);
    const active = snapshot.explosions.filter((explosion) => Date.parse(explosion.endsAtUtc) > now);
    if (active.length !== snapshot.explosions.length) {
      snapshot.explosions = active;
      changed = true;
    }
    if (remaining === 0) {
      snapshot.phase = 'finished';
      snapshot.winnerPlayerId = 'local-rival';
      changed = true;
      this.stop();
    }
    if (changed) this.emit(snapshot);
  }

  private explode(snapshot: GameSnapshot, x: number, y: number, range: number, now: number): void {
    const cells: Cell[] = [{ x, y, kind: 'floor' }];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      for (let step = 1; step <= range; step++) {
        const target = snapshot.cells.find(
          (cell) => cell.x === x + dx * step && cell.y === y + dy * step,
        );
        if (!target || target.kind === 'wall') break;
        cells.push({ ...target, kind: 'floor' });
        if (target.kind === 'crate') {
          target.kind = 'floor';
          break;
        }
      }
    }
    snapshot.explosions.push({
      id: this.id(),
      cells,
      endsAtUtc: new Date(now + 550).toISOString(),
    });
    for (const player of snapshot.players) {
      if (player.alive && cells.some((cell) => cell.x === player.x && cell.y === player.y)) {
        player.lives -= 1;
        if (player.lives <= 0) player.alive = false;
        else {
          player.x = player.playerId === this.playerId ? 1 : 11;
          player.y = player.playerId === this.playerId ? 1 : 9;
        }
      }
    }
    const user = snapshot.players.find((player) => player.playerId === this.playerId);
    const rival = snapshot.players.find((player) => player.playerId === 'local-rival');
    if (!user?.alive || !rival?.alive) {
      snapshot.phase = 'finished';
      snapshot.winnerPlayerId = user?.alive ? user.playerId : (rival?.playerId ?? null);
      this.stop();
    }
  }

  private initialSnapshot(playerId: string): GameSnapshot {
    const width = 13,
      height = 11,
      cells: Cell[] = [];
    const safe = new Set(['1,1', '1,2', '2,1', '11,9', '10,9', '11,8']);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const wall =
          x === 0 || y === 0 || x === width - 1 || y === height - 1 || (x % 2 === 0 && y % 2 === 0);
        const crate = !wall && !safe.has(`${x},${y}`) && (x * 3 + y * 5) % 4 === 0;
        cells.push({ x, y, kind: wall ? 'wall' : crate ? 'crate' : 'floor' });
      }
    return {
      gameId: this.id(),
      version: 1,
      phase: 'running',
      width,
      height,
      cells,
      players: [
        { playerId, x: 1, y: 1, lives: 3, alive: true, color: '#f5a5b8' },
        { playerId: 'local-rival', x: 11, y: 9, lives: 1, alive: true, color: '#c63bc9' },
      ],
      bombs: [],
      explosions: [],
      remainingSeconds: 120,
      winnerPlayerId: null,
    };
  }

  private emptySnapshot(): GameSnapshot {
    return {
      gameId: 'empty',
      version: 0,
      phase: 'waiting',
      width: 1,
      height: 1,
      cells: [{ x: 0, y: 0, kind: 'floor' }],
      players: [],
      bombs: [],
      explosions: [],
      remainingSeconds: 0,
      winnerPlayerId: null,
    };
  }
  private emit(snapshot: GameSnapshot): void {
    snapshot.version += 1;
    this.subject.next(this.clone(snapshot));
  }
  private clone(snapshot: GameSnapshot): GameSnapshot {
    return structuredClone(snapshot);
  }
  private id(): string {
    return (
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }
}
