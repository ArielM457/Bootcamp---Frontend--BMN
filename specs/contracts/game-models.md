# **Modelos iniciales del juego**

Estado: propuesta. Las coordenadas son enteros con origen arriba a la izquierda. `x` crece a la derecha y `y` hacia abajo.

- `Cell`: `x`, `y`, `kind` con `floor`, `wall` o `crate`.
- `PlayerState`: `playerId`, `x`, `y`, `lives`, `alive`, `color`, `powerUpName` opcional y `powerUpRemainingSeconds` opcional como número confirmado por el backend.
- `BombState`: `id`, `ownerId`, `x`, `y`, `placedAtUtc`, `detonatesAtUtc`, `range` y `kind` opcional con `classic` o `space`.
- `PowerUpState`: `id`, `x`, `y` y `kind` con `energy`.
- `ExplosionState`: `id`, `cells`, `endsAtUtc`.
- `GameSnapshot`: `gameId`, `version`, `phase`, `width`, `height`, `cells`, `players`, `bombs`, `powerUps` opcional, `explosions`, `remainingSeconds`, `winnerPlayerId` opcional.

`phase` admite `waiting`, `running` y `finished`. Una celda tiene un solo terreno; jugadores, bombas, poderes y explosiones son capas separadas. `version` aumenta con cada estado confirmado por el servidor. Los tiempos se expresan en UTC ISO 8601. El tamaño, la frecuencia y los valores límite quedan por validar con el backend.
