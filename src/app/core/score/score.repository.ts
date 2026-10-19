import { InjectionToken } from '@angular/core';
import { LeaderboardEntry, MatchScore, RecordMatchRequest } from './score.models';

export interface ScoreRepository {
  record(request: RecordMatchRequest): Promise<MatchScore>;
  leaderboard(): Promise<LeaderboardEntry[]>;
}

export const SCORE_REPOSITORY = new InjectionToken<ScoreRepository>('SCORE_REPOSITORY');
