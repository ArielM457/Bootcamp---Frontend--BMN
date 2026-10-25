# **Validación GAME-01**

Fecha: 25 de octubre de 2026.

Estado: partida local implementada y HUD revisado en navegador. La sincronización con servidor permanece pendiente.

Implementamos un tablero Canvas de 13 × 11, paredes, cajas, jugador, rival local, movimiento, bombas, explosiones, vidas, tiempo y resultado. El resultado muestra puntos, vidas y tiempo restante. El menú permite abrir una partida local y una sala iniciada también dirige al tablero.

Separación comprobada:

- `CanvasRenderer` solo dibuja un `GameSnapshot`.
- `GameInputController` convierte teclado en comandos.
- `LocalGameSimulator` decide movimiento, colisiones, daño y resultado local.
- `GameFacade` conserva el último snapshot confirmado y descarta versiones anteriores.

Comprobaciones realizadas:

- Un movimiento contra una pared no cambia la versión.
- Un movimiento válido actualiza la celda y la versión.
- Una bomba detona y produce celdas de explosión.
- Flechas y espacio generan los comandos correctos.
- Las coordenadas del Canvas corresponden a celdas de 48 px.
- Un snapshot antiguo no reemplaza uno nuevo.
- El HUD calcula solo los rivales vivos y muestra el nombre del poder equipado.
- Revisión visual en Chromium a 1440 × 1000: métricas apiladas a la izquierda y tiempo sobre el tablero.
- Revisión visual en Chromium a 390 × 844: sin desplazamiento horizontal; tiempo, tablero, métricas y controles siguen visibles.
- `npm test -- --watch=false`: correcto, 9 archivos y 40 pruebas.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- `npm run format:check`: correcto.

No afirmamos todavía comportamiento multijugador, audio ni prueba táctil en un dispositivo físico.
