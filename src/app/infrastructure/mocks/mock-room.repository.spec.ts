import { Player } from '../../core/auth/auth.models';
import { MockRoomRepository } from './mock-room.repository';

describe('MockRoomRepository ROOM-01', () => {
  let repository: MockRoomRepository;
  const ariel: Player = { id: 'player-ariel', displayName: 'Ariel' };
  const luna: Player = { id: 'player-luna', displayName: 'Luna' };
  const sol: Player = { id: 'player-sol', displayName: 'Sol' };

  beforeEach(() => {
    repository = new MockRoomRepository();
  });

  it('crea una sala válida con el creador como anfitrión', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);

    expect(room.name).toBe('Batalla Rosa');
    expect(room.hostPlayerId).toBe(ariel.id);
    expect(room.participants).toEqual([{ ...ariel, kind: 'player' }]);
  });

  it('permite unirse una vez y rechaza una sala llena', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    const joined = await repository.join(room.id, luna);
    const joinedAgain = await repository.join(room.id, luna);

    expect(joined.participants).toHaveLength(2);
    expect(joinedAgain.participants).toHaveLength(2);
    await expect(repository.join('room-night', sol)).rejects.toMatchObject({ code: 'full' });
    await expect(repository.join('room-pink', ariel)).rejects.toMatchObject({
      code: 'already-in-room',
    });
  });

  it('solo permite iniciar al anfitrión cuando hay dos jugadores', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    await expect(repository.start(room.id, ariel.id)).rejects.toMatchObject({
      code: 'not-enough-players',
    });

    await repository.join(room.id, luna);
    await expect(repository.start(room.id, luna.id)).rejects.toMatchObject({ code: 'not-host' });

    const started = await repository.start(room.id, ariel.id);
    expect(started.status).toBe('playing');
  });

  it('añade un bot que ocupa una plaza y permite iniciar', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    const withBot = await repository.addBot(room.id, ariel.id);

    expect(withBot.participants).toHaveLength(2);
    expect(withBot.participants[1]).toMatchObject({ displayName: 'Bombot', kind: 'bot' });
    expect((await repository.start(room.id, ariel.id)).status).toBe('playing');
  });

  it('no duplica el bot ni permite que otro jugador lo añada', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    await repository.join(room.id, luna);
    await expect(repository.addBot(room.id, luna.id)).rejects.toMatchObject({ code: 'not-host' });
    await repository.addBot(room.id, ariel.id);
    await expect(repository.addBot(room.id, ariel.id)).rejects.toMatchObject({
      code: 'bot-already-added',
    });
  });

  it('elimina la sala si al salir el anfitrión solo queda el bot', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    await repository.addBot(room.id, ariel.id);
    await repository.leave(room.id, ariel.id);

    await expect(repository.get(room.id)).rejects.toMatchObject({ code: 'not-found' });
  });

  it('transfiere el anfitrión al salir y elimina una sala vacía', async () => {
    const room = await repository.create({ name: 'Batalla Rosa', maxPlayers: 4 }, ariel);
    await repository.join(room.id, luna);
    await repository.leave(room.id, ariel.id);

    expect((await repository.get(room.id)).hostPlayerId).toBe(luna.id);
    await repository.leave(room.id, luna.id);
    await expect(repository.get(room.id)).rejects.toMatchObject({ code: 'not-found' });
  });
});
