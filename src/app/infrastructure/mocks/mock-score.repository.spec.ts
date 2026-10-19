import { MockScoreRepository } from './mock-score.repository';

describe('MockScoreRepository SCORE-01', () => {
  let repository: MockScoreRepository;

  beforeEach(() => {
    repository = new MockScoreRepository();
  });

  it('comienza con un ranking vacío', async () => {
    await expect(repository.leaderboard()).resolves.toEqual([]);
  });

  it('calcula los puntos de victoria y derrota', async () => {
    const victory = await repository.record({
      gameId: 'game-1',
      playerId: 'player-1',
      displayName: 'Ariel',
      outcome: 'victory',
      remainingLives: 2,
      remainingSeconds: 30,
    });
    const defeat = await repository.record({
      gameId: 'game-2',
      playerId: 'player-2',
      displayName: 'Luna',
      outcome: 'defeat',
      remainingLives: 1,
      remainingSeconds: 40,
    });

    expect(victory.earnedPoints).toBe(1350);
    expect(defeat.earnedPoints).toBe(150);
  });

  it('registra un resultado repetido una sola vez', async () => {
    const request = {
      gameId: 'game-1',
      playerId: 'player-1',
      displayName: 'Ariel',
      outcome: 'victory' as const,
      remainingLives: 3,
      remainingSeconds: 20,
    };
    const first = await repository.record(request);
    const repeated = await repository.record(request);
    const [entry] = await repository.leaderboard();

    expect(repeated).toEqual(first);
    expect(entry.gamesPlayed).toBe(1);
    expect(entry.points).toBe(first.earnedPoints);
  });

  it('ordena por puntos, victorias y nombre', async () => {
    await repository.record({
      gameId: 'game-1',
      playerId: 'player-luna',
      displayName: 'Luna',
      outcome: 'defeat',
      remainingLives: 0,
      remainingSeconds: 0,
    });
    await repository.record({
      gameId: 'game-2',
      playerId: 'player-ariel',
      displayName: 'Ariel',
      outcome: 'victory',
      remainingLives: 1,
      remainingSeconds: 0,
    });

    const ranking = await repository.leaderboard();
    expect(ranking.map((entry) => entry.displayName)).toEqual(['Ariel', 'Luna']);
    expect(ranking.map((entry) => entry.rank)).toEqual([1, 2]);
  });
});
