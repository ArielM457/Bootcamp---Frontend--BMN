import { Injectable } from '@angular/core';
import { LeaderboardEntry, MatchScore, RecordMatchRequest } from '../../core/score/score.models';
import { ScoreRepository } from '../../core/score/score.repository';

interface PlayerScore {
  playerId: string;
  displayName: string;
  points: number;
  victories: number;
  gamesPlayed: number;
}

@Injectable()
export class MockScoreRepository implements ScoreRepository {
  private readonly players = new Map<string, PlayerScore>();
  private readonly matches = new Map<string, MatchScore>();

  async record(request: RecordMatchRequest): Promise<MatchScore> {
    await this.wait();
    const key = `${request.gameId}:${request.playerId}`;
    const existing = this.matches.get(key);
    if (existing) return structuredClone(existing);

    const earnedPoints = this.pointsFor(request);
    const player = this.players.get(request.playerId) ?? {
      playerId: request.playerId,
      displayName: request.displayName,
      points: 0,
      victories: 0,
      gamesPlayed: 0,
    };
    player.displayName = request.displayName;
    player.points += earnedPoints;
    player.gamesPlayed += 1;
    if (request.outcome === 'victory') player.victories += 1;
    this.players.set(player.playerId, player);

    const result: MatchScore = {
      gameId: request.gameId,
      playerId: request.playerId,
      outcome: request.outcome,
      earnedPoints,
      totalPoints: player.points,
      remainingLives: request.remainingLives,
      remainingSeconds: request.remainingSeconds,
    };
    this.matches.set(key, result);
    return structuredClone(result);
  }

  async leaderboard(): Promise<LeaderboardEntry[]> {
    await this.wait();
    return [...this.players.values()]
      .sort(
        (left, right) =>
          right.points - left.points ||
          right.victories - left.victories ||
          left.displayName.localeCompare(right.displayName),
      )
      .map((player, index) => ({ ...structuredClone(player), rank: index + 1 }));
  }

  private pointsFor(request: RecordMatchRequest): number {
    return request.outcome === 'victory'
      ? 1000 + request.remainingLives * 100 + request.remainingSeconds * 5
      : 100 + request.remainingLives * 50;
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 80));
  }
}
