import { inject, Injectable, signal } from '@angular/core';
import { AuthFacade } from '../auth/auth.facade';
import { GameSnapshot } from '../game/game.models';
import { LeaderboardEntry, MatchScore } from './score.models';
import { SCORE_REPOSITORY } from './score.repository';

@Injectable({ providedIn: 'root' })
export class ScoreFacade {
  private readonly repository = inject(SCORE_REPOSITORY);
  private readonly auth = inject(AuthFacade);
  private readonly resultState = signal<MatchScore | null>(null);
  private readonly leaderboardState = signal<LeaderboardEntry[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly recording = new Set<string>();

  readonly lastResult = this.resultState.asReadonly();
  readonly leaderboard = this.leaderboardState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  resultFor(gameId: string): MatchScore | null {
    const result = this.resultState();
    return result?.gameId === gameId ? result : null;
  }

  async record(snapshot: GameSnapshot): Promise<void> {
    const player = this.auth.player();
    if (!player || snapshot.phase !== 'finished') return;
    const key = `${snapshot.gameId}:${player.id}`;
    if (this.recording.has(key) || this.resultState()?.gameId === snapshot.gameId) return;
    this.recording.add(key);
    this.errorState.set(null);
    try {
      const playerState = snapshot.players.find((item) => item.playerId === player.id);
      this.resultState.set(
        await this.repository.record({
          gameId: snapshot.gameId,
          playerId: player.id,
          displayName: player.displayName,
          outcome: snapshot.winnerPlayerId === player.id ? 'victory' : 'defeat',
          remainingLives: Math.max(0, playerState?.lives ?? 0),
          remainingSeconds: Math.max(0, snapshot.remainingSeconds),
        }),
      );
    } catch {
      this.errorState.set('No pudimos guardar el resultado.');
    } finally {
      this.recording.delete(key);
    }
  }

  async loadLeaderboard(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      this.leaderboardState.set(await this.repository.leaderboard());
    } catch {
      this.errorState.set('No pudimos cargar el ranking.');
    } finally {
      this.loadingState.set(false);
    }
  }
}
