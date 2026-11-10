import * as signalR from '@microsoft/signalr';

const apiUrl = requiredEnvironment('BOMBERMAN_API_URL').replace(/\/$/, '');
const hubUrl = requiredEnvironment('BOMBERMAN_HUB_URL');
const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const users = await Promise.all([
  register(`Jugador A ${suffix}`, `a-${suffix}@example.com`),
  register(`Jugador B ${suffix}`, `b-${suffix}@example.com`),
  register(`Jugador C ${suffix}`, `c-${suffix}@example.com`),
  register(`Jugador D ${suffix}`, `d-${suffix}@example.com`),
]);

await verifyRejectedConnection();

const firstRoom = await request('/api/rooms', 'POST', users[0].accessToken, {
  name: `Sala A ${suffix}`,
  maxPlayers: 2,
});
await request(`/api/rooms/${firstRoom.id}/join`, 'POST', users[1].accessToken);
await request(`/api/rooms/${firstRoom.id}/ready`, 'PUT', users[1].accessToken, { isReady: true });
const firstGame = await request(`/api/games/${firstRoom.id}/start`, 'POST', users[0].accessToken);

const secondRoom = await request('/api/rooms', 'POST', users[2].accessToken, {
  name: `Sala B ${suffix}`,
  maxPlayers: 2,
});
await request(`/api/rooms/${secondRoom.id}/join`, 'POST', users[3].accessToken);
await request(`/api/rooms/${secondRoom.id}/ready`, 'PUT', users[3].accessToken, { isReady: true });
const secondGame = await request(`/api/games/${secondRoom.id}/start`, 'POST', users[2].accessToken);

const firstPlayer = connection(users[0].accessToken);
const secondPlayer = connection(users[1].accessToken);
const otherRoomPlayer = connection(users[2].accessToken);
let firstUpdates = 0;
let secondUpdates = 0;
let otherRoomUpdates = 0;
let secondPlayerPosition = null;
let latestFirstState = null;
const commandRejections = [];

firstPlayer.on('GameStateUpdated', (state) => {
  firstUpdates += 1;
  latestFirstState = state;
});
firstPlayer.on('CommandRejected', (commandId, message) => {
  commandRejections.push({ commandId, message });
});
secondPlayer.on('GameStateUpdated', (state) => {
  secondUpdates += 1;
  secondPlayerPosition = state.players.find(
    (player) => player.playerId === users[0].usuario.playerId,
  );
});
otherRoomPlayer.on('GameStateUpdated', () => {
  otherRoomUpdates += 1;
});

try {
  await Promise.all([firstPlayer.start(), secondPlayer.start(), otherRoomPlayer.start()]);
  await firstPlayer.invoke('JoinGame', firstGame.id);
  await secondPlayer.invoke('JoinGame', firstGame.id);
  await expectRejected(() => otherRoomPlayer.invoke('JoinGame', firstGame.id));
  await otherRoomPlayer.invoke('JoinGame', secondGame.id);
  firstUpdates = 0;
  secondUpdates = 0;
  otherRoomUpdates = 0;

  const initialPosition = latestFirstState.players.find(
    (player) => player.playerId === users[0].usuario.playerId,
  );
  const movement = freeMovement(latestFirstState.map, initialPosition);
  await firstPlayer.invoke('MovePlayer', movement.direction, commandId());
  await expectCommandRejected(firstPlayer, 'MovePlayer', movement.direction);
  await wait(300);

  assert(firstUpdates > 0, 'El jugador que se movió no recibió el estado actualizado.');
  assert(secondUpdates > 0, 'El segundo jugador de la sala no recibió la actualización.');
  assert(otherRoomUpdates === 0, 'Un jugador de otra sala recibió una actualización ajena.');
  assert(
    secondPlayerPosition?.x === movement.x && secondPlayerPosition?.y === movement.y,
    'La posición confirmada por el servidor no coincide con el movimiento.',
  );

  firstUpdates = 0;
  secondUpdates = 0;
  const movedPlayer = latestFirstState.players.find(
    (player) => player.playerId === users[0].usuario.playerId,
  );
  await expectCommandRejected(
    firstPlayer,
    'MovePlayer',
    blockedDirection(latestFirstState.map, movedPlayer),
  );
  await wait(200);
  await expectCommandRejected(firstPlayer, 'MovePlayer', 'diagonal');
  await wait(200);
  assert(firstUpdates === 0 && secondUpdates === 0, 'Un movimiento inválido fue difundido.');

  for (const expectedLives of [2, 1, 0]) {
    await firstPlayer.invoke('PlaceBomb', commandId());
    await wait(200);
    assert(latestFirstState?.bombs.length === 1, 'La bomba no apareció en el estado compartido.');
    if (expectedLives === 2) await expectCommandRejected(firstPlayer, 'PlaceBomb');
    await wait(2100);
    assert(latestFirstState?.bombs.length === 0, 'La bomba no desapareció después del fusible.');
    assert(latestFirstState?.explosions.length === 1, 'La explosión no se publicó en tiempo real.');
    const damagedPlayer = latestFirstState?.players.find(
      (player) => player.playerId === users[0].usuario.playerId,
    );
    assert(damagedPlayer?.lives === expectedLives, 'La explosión no restó exactamente una vida.');
    assert(
      damagedPlayer?.isAlive === expectedLives > 0,
      'El estado vivo del jugador no coincide con sus vidas.',
    );
    if (expectedLives > 0) {
      assert(
        latestFirstState?.status === 'playing',
        'La partida terminó antes de perder tres vidas.',
      );
    } else {
      assert(
        latestFirstState?.status === 'finished',
        'La partida no terminó cuando un jugador perdió sus tres vidas.',
      );
      assert(
        latestFirstState?.winnerPlayerId === users[1].usuario.playerId,
        'El servidor no confirmó al jugador ganador.',
      );
    }
    await wait(800);
    assert(latestFirstState?.explosions.length === 0, 'La explosión no se limpió del tablero.');
  }
} finally {
  await Promise.all([firstPlayer.stop(), secondPlayer.stop(), otherRoomPlayer.stop()]);
}

console.log('OK: JWT rechazado cuando falta el token.');
console.log('OK: dos jugadores de la misma sala reciben el movimiento en tiempo real.');
console.log('OK: otra sala no recibe eventos ajenos.');
console.log('OK: el servidor rechaza y no difunde un movimiento inválido.');
console.log('OK: chocar con una pared usa CommandRejected sin fallar la llamada del Hub.');
console.log('OK: el servidor limita movimientos enviados demasiado rápido.');
console.log('OK: cada explosión resta una de tres vidas y la tercera confirma al ganador.');

async function register(name, email) {
  return request('/api/auth/register', 'POST', null, {
    nombre: name,
    correo: email,
    password: 'Bomberman123!',
  });
}

async function request(path, method, token, body) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  }
  return response.status === 204 ? null : response.json();
}

function connection(token) {
  return new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { accessTokenFactory: () => token })
    .build();
}

async function verifyRejectedConnection() {
  const unauthenticated = connection('');
  try {
    await expectRejected(() => unauthenticated.start());
  } finally {
    await unauthenticated.stop();
  }
}

async function expectRejected(action) {
  let rejected = false;
  try {
    await action();
  } catch {
    rejected = true;
  }
  assert(rejected, 'El servidor aceptó una operación que debía rechazar.');
}

async function expectCommandRejected(connection, method, ...args) {
  const currentCommandId = commandId();
  await connection.invoke(method, ...args, currentCommandId);
  await wait(50);
  assert(
    commandRejections.some((rejection) => rejection.commandId === currentCommandId),
    `El servidor no envió CommandRejected para ${method}.`,
  );
}

function commandId() {
  return globalThis.crypto.randomUUID();
}

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en el archivo .env.`);
  return value;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function freeMovement(map, player) {
  const candidates = [
    { direction: 'up', x: player.x, y: player.y - 1 },
    { direction: 'down', x: player.x, y: player.y + 1 },
    { direction: 'left', x: player.x - 1, y: player.y },
    { direction: 'right', x: player.x + 1, y: player.y },
  ];
  const movement = candidates.find((candidate) => map[candidate.y]?.[candidate.x] === 0);
  if (!movement) throw new Error('El jugador no tiene una casilla libre para validar movimiento.');
  return movement;
}

function blockedDirection(map, player) {
  const candidates = [
    { direction: 'up', x: player.x, y: player.y - 1 },
    { direction: 'down', x: player.x, y: player.y + 1 },
    { direction: 'left', x: player.x - 1, y: player.y },
    { direction: 'right', x: player.x + 1, y: player.y },
  ];
  const movement = candidates.find((candidate) => map[candidate.y]?.[candidate.x] !== 0);
  if (!movement) throw new Error('El jugador no tiene una pared cercana para validar el bloqueo.');
  return movement.direction;
}
