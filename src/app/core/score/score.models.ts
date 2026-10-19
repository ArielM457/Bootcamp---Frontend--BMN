export type MatchOutcome = 'victory' | 'defeat';

export interface RecordMatchRequest {
  gameId: string;
  playerId: string;
  displayName: string;
  outcome: MatchOutcome;
  remainingLives: number;
  remainingSeconds: number;
}

export interface MatchScore {
  gameId: string;
  playerId: string;
  outcome: MatchOutcome;
  earnedPoints: number;
  totalPoints: number;
  remainingLives: number;
  remainingSeconds: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  points: number;
  victories: number;
  gamesPlayed: number;
}
