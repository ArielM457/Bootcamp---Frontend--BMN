import { GameSnapshot } from '../core/game/game.models';
import { LocalGameSimulator } from '../infrastructure/mocks/local-game.simulator';
import { MockRoomRepository } from '../infrastructure/mocks/mock-room.repository';
import { MockScoreRepository } from '../infrastructure/mocks/mock-score.repository';

describe('Flujo local principal QA-01', () => {
  it('recorre sala, bot, partida, resultado y ranking', async () => {
    const player = { id: 'player-ariel', displayName: 'Ariel' };
    const rooms = new MockRoomRepository();
    const scores = new MockScoreRepository();
    const game = new LocalGameSimulator();
    let snapshot: GameSnapshot | null = null;
    const subscription = game.snapshots$.subscribe((value) => (snapshot = value));

    const room = await rooms.create({ name: 'Batalla local', maxPlayers: 4 }, player);
    const withBot = await rooms.addBot(room.id, player.id);
    const started = await rooms.start(room.id, player.id);

    expect(withBot.participants.some((participant) => participant.kind === 'bot')).toBe(true);
    expect(started.status).toBe('playing');

    game.start(player.id);
    const initialVersion = snapshot!.version;
    game.send({ type: 'move', direction: 'right' });
    expect(snapshot!.version).toBeGreaterThan(initialVersion);

    const finished = structuredClone(snapshot!);
    finished.phase = 'finished';
    finished.winnerPlayerId = player.id;
    const playerState = finished.players.find((item) => item.playerId === player.id)!;
    const result = await scores.record({
      gameId: finished.gameId,
      playerId: player.id,
      displayName: player.displayName,
      outcome: 'victory',
      remainingLives: playerState.lives,
      remainingSeconds: finished.remainingSeconds,
    });
    const ranking = await scores.leaderboard();

    expect(result.earnedPoints).toBeGreaterThan(1000);
    expect(ranking[0]).toMatchObject({ rank: 1, playerId: player.id, victories: 1 });

    game.stop();
    subscription.unsubscribe();
  });
});
