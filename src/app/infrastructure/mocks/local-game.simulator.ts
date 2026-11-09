import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Cell,
  Direction,
  GameCommand,
  GameSnapshot,
  GameStartOptions,
  PlayerState,
} from '../../core/game/game.models';

@Injectable()
export class LocalGameSimulator {
  private readonly powerLifetimeSeconds = 8;
  private readonly powerRespawnDelayMs = 2500;
  private readonly movementCooldownMs = 360;
  private readonly subject = new BehaviorSubject<GameSnapshot>(this.emptySnapshot());
  readonly snapshots$ = this.subject.asObservable();
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = 0;
  private playerId = '';
  private options: GameStartOptions = {};
  private nextBombKind: 'classic' | 'space' = 'classic';
  private powerExpiresAt = 0;
  private equippedPowerExpiresAt = 0;
  private powerSpawnAt = 0;
  private lastPowerCell: string | null = null;
  private lastMoveAt: number | null = null;

  start(playerId: string, options: GameStartOptions = {}): void {
    this.stop();
    this.playerId = playerId;
    this.options = options;
    this.nextBombKind = 'classic';
    this.powerExpiresAt = 0;
    this.equippedPowerExpiresAt = 0;
    this.powerSpawnAt = 0;
    this.lastPowerCell = null;
    this.lastMoveAt = null;
    this.startedAt = Date.now();
    this.subject.next(this.initialSnapshot(playerId));
    this.timer = setInterval(() => this.tick(), 100);
  }

  send(command: GameCommand): void {
    if (command.type === 'restart') {
      this.start(this.playerId, this.options);
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
    const now = Date.now();
    if (this.lastMoveAt !== null && now - this.lastMoveAt < this.movementCooldownMs) return;
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
    this.lastMoveAt = now;
    const collectedPower = snapshot.powerUps?.find((power) => power.x === x && power.y === y);
    if (collectedPower) {
      player.powerUpName = 'Bomba espacial';
      player.powerUpRemainingSeconds = this.powerLifetimeSeconds;
      this.equippedPowerExpiresAt = now + this.powerLifetimeSeconds * 1000;
      this.removePower(snapshot, now);
    }
    this.emit(snapshot);
  }

  private placeBomb(): void {
    const snapshot = this.clone(this.subject.value);
    const player = snapshot.players.find((item) => item.playerId === this.playerId);
    const occupiedByAnotherPlayer = snapshot.players.some(
      (other) =>
        other.alive &&
        other.playerId !== player?.playerId &&
        other.x === player?.x &&
        other.y === player?.y,
    );
    if (
      !player?.alive ||
      occupiedByAnotherPlayer ||
      snapshot.bombs.some((bomb) => bomb.ownerId === player.playerId)
    )
      return;
    const now = Date.now();
    snapshot.bombs.push({
      id: this.id(),
      ownerId: player.playerId,
      x: player.x,
      y: player.y,
      placedAtUtc: new Date(now).toISOString(),
      detonatesAtUtc: new Date(now + 1500).toISOString(),
      range: 2,
      kind: this.nextBombKind,
    });
    this.nextBombKind = this.nextBombKind === 'classic' ? 'space' : 'classic';
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
    if (this.updatePower(snapshot, now)) changed = true;
    if (this.updateEquippedPower(snapshot, now)) changed = true;
    if (remaining === 0) {
      snapshot.phase = 'finished';
      snapshot.winnerPlayerId = snapshot.players.find(
        (player) => player.playerId !== this.playerId && player.alive,
      )?.playerId;
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
    if (
      snapshot.powerUps?.some((power) =>
        cells.some((cell) => cell.x === power.x && cell.y === power.y),
      )
    ) {
      this.removePower(snapshot, now);
    }
    for (const player of snapshot.players) {
      if (player.alive && cells.some((cell) => cell.x === player.x && cell.y === player.y)) {
        player.lives -= 1;
        if (player.lives <= 0) player.alive = false;
        else {
          const spawn = this.playerSpawn(player.playerId);
          player.x = spawn.x;
          player.y = spawn.y;
        }
      }
    }
    const user = snapshot.players.find((player) => player.playerId === this.playerId);
    const activeRivals = snapshot.players.filter(
      (player) => player.playerId !== this.playerId && player.alive,
    );
    if (!user?.alive || activeRivals.length === 0) {
      snapshot.phase = 'finished';
      snapshot.winnerPlayerId = user?.alive ? user.playerId : (activeRivals[0]?.playerId ?? null);
      this.stop();
    }
  }

  private initialSnapshot(playerId: string): GameSnapshot {
    const width = 13,
      height = 11,
      cells: Cell[] = [];
    const safe = new Set([
      '1,1',
      '1,2',
      '2,1',
      '11,1',
      '10,1',
      '11,2',
      '1,9',
      '1,8',
      '2,9',
      '11,9',
      '10,9',
      '11,8',
      '5,1',
      '7,9',
    ]);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const wall =
          x === 0 || y === 0 || x === width - 1 || y === height - 1 || (x % 2 === 0 && y % 2 === 0);
        const crateDivisor = this.options.arenaId === 'fortress' ? 3 : 5;
        const crate = !wall && !safe.has(`${x},${y}`) && (x * 3 + y * 5) % crateDivisor === 0;
        cells.push({ x, y, kind: wall ? 'wall' : crate ? 'crate' : 'floor' });
      }
    const snapshot: GameSnapshot = {
      gameId: this.id(),
      version: 1,
      phase: 'running',
      width,
      height,
      cells,
      players: [
        {
          playerId,
          x: 1,
          y: 1,
          lives: 3,
          alive: true,
          color: this.options.playerColor ?? '#2f8cff',
          powerUpRemainingSeconds: 0,
        },
        {
          playerId: 'local-rival-1',
          x: 11,
          y: 9,
          lives: 1,
          alive: true,
          color: '#c63bc9',
          powerUpRemainingSeconds: 0,
        },
        {
          playerId: 'local-rival-2',
          x: 11,
          y: 1,
          lives: 1,
          alive: true,
          color: '#22d3ee',
          powerUpRemainingSeconds: 0,
        },
        {
          playerId: 'local-rival-3',
          x: 1,
          y: 9,
          lives: 1,
          alive: true,
          color: '#f59e0b',
          powerUpRemainingSeconds: 0,
        },
      ],
      bombs: [],
      powerUps: [],
      explosions: [],
      remainingSeconds: 120,
      winnerPlayerId: null,
    };
    this.spawnPower(snapshot, this.startedAt);
    return snapshot;
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
      powerUps: [],
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

  private playerSpawn(playerId: string): { x: number; y: number } {
    if (playerId === this.playerId) return { x: 1, y: 1 };
    if (playerId === 'local-rival-2') return { x: 11, y: 1 };
    if (playerId === 'local-rival-3') return { x: 1, y: 9 };
    return { x: 11, y: 9 };
  }

  private updatePower(snapshot: GameSnapshot, now: number): boolean {
    const power = snapshot.powerUps?.[0];
    if (power) {
      const remainingSeconds = Math.max(0, Math.ceil((this.powerExpiresAt - now) / 1000));
      if (remainingSeconds === 0) {
        this.removePower(snapshot, now);
        return true;
      }
      return false;
    }

    if (this.powerSpawnAt > 0 && now >= this.powerSpawnAt) {
      this.spawnPower(snapshot, now);
      return true;
    }

    return false;
  }

  private spawnPower(snapshot: GameSnapshot, now: number): void {
    const availableCells = snapshot.cells.filter(
      (cell) =>
        cell.kind === 'floor' &&
        !snapshot.players.some(
          (player) => player.alive && player.x === cell.x && player.y === cell.y,
        ) &&
        !snapshot.bombs.some((bomb) => bomb.x === cell.x && bomb.y === cell.y) &&
        !snapshot.explosions.some((explosion) =>
          explosion.cells.some(
            (explosionCell) => explosionCell.x === cell.x && explosionCell.y === cell.y,
          ),
        ),
    );

    const cellsInAnotherPosition = availableCells.filter(
      (cell) => `${cell.x},${cell.y}` !== this.lastPowerCell,
    );
    const candidateCells =
      cellsInAnotherPosition.length > 0 ? cellsInAnotherPosition : availableCells;

    if (candidateCells.length === 0) {
      this.powerSpawnAt = now + this.powerRespawnDelayMs;
      return;
    }

    const cell = candidateCells[Math.floor(Math.random() * candidateCells.length)];
    snapshot.powerUps = [
      {
        id: this.id(),
        x: cell.x,
        y: cell.y,
        kind: 'energy',
      },
    ];
    this.powerExpiresAt = now + this.powerLifetimeSeconds * 1000;
    this.powerSpawnAt = 0;
    this.lastPowerCell = `${cell.x},${cell.y}`;
  }

  private removePower(snapshot: GameSnapshot, now: number): void {
    snapshot.powerUps = [];
    this.powerExpiresAt = 0;
    this.powerSpawnAt = now + this.powerRespawnDelayMs;
  }

  private updateEquippedPower(snapshot: GameSnapshot, now: number): boolean {
    if (this.equippedPowerExpiresAt === 0) return false;
    const player = snapshot.players.find((item) => item.playerId === this.playerId);
    if (!player?.powerUpName) {
      this.equippedPowerExpiresAt = 0;
      return false;
    }

    const remainingSeconds = Math.max(0, Math.ceil((this.equippedPowerExpiresAt - now) / 1000));
    if (remainingSeconds === 0) {
      player.powerUpName = null;
      player.powerUpRemainingSeconds = 0;
      this.equippedPowerExpiresAt = 0;
      return true;
    }
    if (remainingSeconds !== player.powerUpRemainingSeconds) {
      player.powerUpRemainingSeconds = remainingSeconds;
      return true;
    }
    return false;
  }
}
