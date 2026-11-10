# **Modelos iniciales del juego**

Estado: contrato integrado. Las coordenadas son enteros con origen arriba a la izquierda. `x` crece a la derecha y `y` hacia abajo.

- `Cell`: `x`, `y`, `kind` con `floor`, `wall` o `crate`.
- `PlayerState`: `playerId`, `x`, `y`, `lives` e `isAlive`. Cada jugador inicia la partida con tres vidas.
- `BombState`: `id`, `ownerPlayerId`, `x`, `y`, `placedAtUtc`, `explodesAtUtc` y `range`.
- `ExplosionState`: `id`, `cells` y `endsAtUtc`.
- `GameSnapshot`: `gameId`, `version`, `phase`, `width`, `height`, `cells`, `players`, `bombs`, `explosions` y `winnerPlayerId` opcional.

`phase` admite `waiting`, `running` y `finished`. Una celda tiene un solo terreno; jugadores, bombas y explosiones son capas separadas. `version` aumenta en el frontend con cada estado confirmado por el servidor. Los tiempos se expresan en UTC ISO 8601.
