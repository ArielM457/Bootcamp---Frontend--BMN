# **Guía de integración con backend**

Estado: implementado parcialmente con los contratos disponibles del backend de las sesiones 05 a 08.

El frontend usa `HttpAuthRepository`, `HttpRoomRepository` y `SignalRGameAdapter`. Los componentes conservan las facades y no llaman directamente a HTTP ni SignalR. Las URLs se cargan desde `.env` mediante `BOMBERMAN_API_URL` y `BOMBERMAN_HUB_URL`.

## **Operaciones conectadas**

- Registro, login y validación de sesión.
- Listado, consulta, creación y unión a salas.
- Inicio de partida.
- Conexión al Hub y movimiento confirmado por el servidor.
- Recepción del mapa y posiciones de jugadores.

## **Operaciones pendientes en backend**

- Consultar y actualizar el perfil completo.
- Consultar la sala actual aunque esté llena o jugando.
- Identificar anfitrión, pista, modo y bots.
- Configurar o abandonar una sala.
- Informar a los demás participantes que una partida empezó y entregarles el `gameId`.
- Volver una sala al estado de espera.
- Colocar bombas, resolver explosiones y terminar partidas.
- Resultados, puntuaciones y ranking.

Estas operaciones no tienen mocks ni resultados inventados en el frontend.

## **Configuración**

Copia `.env.example` como `.env` y ajusta las URLs si el backend usa otro puerto. Los comandos `npm start`, `npm test` y `npm run build` generan `public/runtime-config.js` antes de iniciar Angular. El archivo generado y `.env` permanecen fuera de Git.

## **Ejemplo de conexión y movimiento**

```typescript
const connection = new signalR.HubConnectionBuilder()
  .withUrl(environment.hubUrl, {
    accessTokenFactory: () => session.accessToken,
  })
  .withAutomaticReconnect()
  .build();

connection.on('GameStateUpdated', (gameState) => {
  console.log(gameState.map, gameState.players);
});

connection.on('PlayerMoved', (playerId, x, y) => {
  console.log(playerId, x, y);
});

await connection.start();
await connection.invoke('JoinGame', gameId);
await connection.invoke('MovePlayer', 'right');
```

El cliente envía una dirección, no una posición. El servidor valida el movimiento y recién entonces publica el estado al grupo de la sala.

## **Prueba de integración**

Con el backend local en ejecución y `.env` configurado:

```bash
npm run verify:backend
```

La prueba registra jugadores temporales, crea dos salas y comprueba autenticación JWT, actualización inmediata entre dos jugadores, aislamiento entre salas y ausencia de difusión para un movimiento inválido.
