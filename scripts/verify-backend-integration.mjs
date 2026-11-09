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
const firstGame = await request(`/api/games/${firstRoom.id}/start`, 'POST', users[0].accessToken);

const secondRoom = await request('/api/rooms', 'POST', users[2].accessToken, {
  name: `Sala B ${suffix}`,
  maxPlayers: 2,
});
await request(`/api/rooms/${secondRoom.id}/join`, 'POST', users[3].accessToken);
const secondGame = await request(`/api/games/${secondRoom.id}/start`, 'POST', users[2].accessToken);

const firstPlayer = connection(users[0].accessToken);
const secondPlayer = connection(users[1].accessToken);
const otherRoomPlayer = connection(users[2].accessToken);
let firstUpdates = 0;
let secondUpdates = 0;
let otherRoomUpdates = 0;
let secondPlayerPosition = null;

firstPlayer.on('GameStateUpdated', () => {
  firstUpdates += 1;
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

  await firstPlayer.invoke('MovePlayer', 'right');
  await wait(300);

  assert(firstUpdates > 0, 'El jugador que se movió no recibió el estado actualizado.');
  assert(secondUpdates > 0, 'El segundo jugador de la sala no recibió la actualización.');
  assert(otherRoomUpdates === 0, 'Un jugador de otra sala recibió una actualización ajena.');
  assert(
    secondPlayerPosition?.x === 2 && secondPlayerPosition?.y === 1,
    'La posición confirmada por el servidor no coincide con el movimiento.',
  );

  firstUpdates = 0;
  secondUpdates = 0;
  await expectRejected(() => firstPlayer.invoke('MovePlayer', 'up'));
  await wait(200);
  assert(firstUpdates === 0 && secondUpdates === 0, 'Un movimiento inválido fue difundido.');
} finally {
  await Promise.all([firstPlayer.stop(), secondPlayer.stop(), otherRoomPlayer.stop()]);
}

console.log('OK: JWT rechazado cuando falta el token.');
console.log('OK: dos jugadores de la misma sala reciben el movimiento en tiempo real.');
console.log('OK: otra sala no recibe eventos ajenos.');
console.log('OK: el servidor rechaza y no difunde un movimiento inválido.');

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
