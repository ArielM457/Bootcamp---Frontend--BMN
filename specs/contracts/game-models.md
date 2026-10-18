# **Modelos iniciales del juego**

Estado: propuesta. Las coordenadas son enteros con origen arriba a la izquierda. `x` crece a la derecha y `y` hacia abajo.

- `Cell`: `x`, `y`, `kind` con `floor`, `wall` o `crate`.
- `PlayerState`: `playerId`, `x`, `y`, `lives`, `alive`, `color`.
- `BombState`: `id`, `ownerId`, `x`, `y`, `placedAtUtc`, `detonatesAtUtc`, `range`.
- `ExplosionState`: `id`, `cells`, `endsAtUtc`.
- `GameSnapshot`: `gameId`, `version`, `phase`, `width`, `height`, `cells`, `players`, `bombs`, `explosions`, `remainingSeconds`, `winnerPlayerId` opcional.

`phase` admite `waiting`, `running` y `finished`. Una celda tiene un solo terreno; jugadores, bombas y explosiones son capas separadas. `version` aumenta con cada estado confirmado por el servidor. Los tiempos se expresan en UTC ISO 8601. El tamaño, la frecuencia y los valores límite quedan por validar con el backend.
