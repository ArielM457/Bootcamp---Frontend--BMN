# **Diseño GAME-01**

`GameFacade` mantiene el último snapshot confirmado y descarta versiones anteriores. `GameInputController` transforma teclado y controles visibles en comandos. `CanvasRenderer` recibe un estado tipado y dibuja capas: terreno, bloques, bombas, explosiones y jugadores. El renderer se puede sustituir por sprites y animaciones sin tocar transporte ni reglas. Las animaciones visuales nunca alteran vidas o colisiones. `LocalGameSimulator` produce snapshots confirmados y concentra las reglas locales.

La pantalla de partida lleva el patrón cuadriculado, el degradado morado y el relieve rosado del inicio al marco del tablero y sus controles. Esta adaptación no cambia el canvas, los comandos ni las reglas de la simulación.

El HUD usa una cuadrícula de dos columnas en escritorio: métricas verticales a la izquierda y, a la derecha, temporizador y Canvas. En móvil se ordena como temporizador, tablero y métricas en dos columnas. `GameFacade.activeOpponents` deriva los rivales vivos y `GameFacade.powerUpName` expone el nombre opcional de `PlayerState.powerUpName`; si no existe, la interfaz muestra `Sin poder`. Las animaciones respetan `prefers-reduced-motion`.

Cuando el resultado termina, `Game` llama a `RoomFacade.returnToWaiting`. El repositorio conserva la sala y sus participantes, cambia su estado a `waiting` y la navegación vuelve a `/salas/:roomId`. Si no existe una sala activa, la acción regresa al menú.
