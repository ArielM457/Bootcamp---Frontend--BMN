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

## **Actualización del 28 de octubre de 2026**

Incorporamos los sprites de `public/bomberman` y el nuevo acabado del tablero.

Comprobaciones realizadas:

- La prueba enfocada confirmó que `first.png` se usa en reposo y que los otros dos sprites se alternan al caminar en las cuatro direcciones.
- La revisión en Chrome a 1440 × 1000 confirmó el personaje quieto, el sprite lateral durante un movimiento a la derecha, las paredes de piedra y las cajas de madera.
- La revisión en Chrome a 390 × 844 confirmó el Canvas y los controles sin desplazamiento horizontal. `scrollWidth` y `clientWidth` fueron 390 px.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- El ejecutor completo `npm test -- --watch=false` compiló las pruebas, pero el worker quedó detenido sin entregar el resumen. No contamos esa ejecución como aprobada.

La revisión sigue limitada al modo local. No confirma sincronización HTTP o SignalR ni controles táctiles en un dispositivo físico.

## **Recursos y cuatro jugadores del 28 de octubre de 2026**

Agregamos imágenes transparentes para bomba clásica, bomba espacial y poder. Cada elemento tiene un momento normal y otro más grande con brillo. También ampliamos el personaje y mostramos cuatro participantes en la simulación local.

Comprobaciones realizadas:

- Chrome a 1440 × 1000 mostró cuatro personajes en las cuatro esquinas y el HUD indicó tres rivales.
- Chrome cargó correctamente los seis archivos de `public/game-assets/items`.
- La captura del Canvas confirmó los personajes ampliados, los dos poderes y la bomba clásica en su momento brillante.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- `git diff --check`: correcto.
- La prueba enfocada con `ng test` y Vitest inició, pero el proceso quedó detenido sin entregar el resumen. No contamos esa prueba como aprobada.

Los tres rivales siguen siendo datos locales de demostración. Esta revisión no confirma cuatro clientes conectados ni sincronización por SignalR.

## **Orientación, duración de poderes e iconos del 28 de octubre de 2026**

Corregimos la orientación vertical del personaje, movimos su base debajo de los pies y agregamos iconos al HUD y al resultado. El poder aparece en una celda libre aleatoria durante ocho segundos.

Comprobaciones realizadas:

- Chrome a 1440 × 1000 confirmó la cara del personaje al bajar y su espalda al subir.
- La base de color quedó debajo de los pies y no cambió la posición lógica del jugador.
- El HUD mostró iconos para vidas, rivales, bombas y poder. El botón de bomba usa de igual forma su imagen.
- El primer poder observado estaba en la celda `7,5`. Después de vencer, reapareció en `7,6`.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- La prueba enfocada compiló, pero el worker volvió a quedar detenido sin entregar el resumen. No contamos esa prueba como aprobada.

La destrucción y reaparición del poder por explosión está cubierta en la prueba enfocada, pero queda pendiente obtener un resumen exitoso del worker de Vitest.

## **Temporizador del poder equipado del 28 de octubre de 2026**

Quitamos la barra que estaba debajo del poder del mapa. Al recogerlo, el mock entrega `powerUpRemainingSeconds` dentro del jugador y el HUD muestra los segundos junto con un borde que se consume alrededor del recuadro PODER. Al llegar a cero, el jugador vuelve al estado `Sin poder`.

Comprobaciones realizadas:

- La prueba enfocada terminó correctamente con 15 pruebas aprobadas.
- La ejecución completa terminó correctamente con 9 archivos y 46 pruebas aprobadas.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- Chrome a 1440 × 1000 mostró `Bomba espacial`, seis segundos restantes y el borde consumido al 75 %.
- El poder del tablero se mostró solo como imagen, sin barra debajo.

## **Velocidad y posición de bombas del 28 de octubre de 2026**

Duplicamos la duración del movimiento de 240 a 480 milisegundos y agregamos la misma espera al simulador local. También impedimos crear una bomba cuando otro jugador vivo comparte la celda del dueño.

Comprobaciones realizadas:

- La prueba enfocada terminó correctamente con 17 pruebas aprobadas.
- La ejecución completa terminó correctamente con 9 archivos y 48 pruebas aprobadas.
- La prueba de velocidad confirmó que un segundo movimiento se rechaza antes de 480 milisegundos y se acepta al cumplir ese tiempo.
- La prueba de ocupación llevó al jugador hasta una celda compartida con un rival y confirmó que no se creó ninguna bomba.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- `npm run format:check` y `git diff --check`: correctos.

No hicimos una revisión visual nueva en navegador para este ajuste. La velocidad y la regla de la bomba quedaron comprobadas en el simulador local.

## **Iconos del resultado del 28 de octubre de 2026**

Reemplazamos los símbolos de puntos, vidas y tiempo por iconos SVG de tamaño y trazo uniforme. También corregimos el selector que aplicaba el estilo de tarjeta a los iconos internos. Ahora cada icono queda en la misma línea que su título.

Comprobaciones realizadas:

- Chrome a 1440 × 1000 mostró tres tarjetas parejas con los iconos junto a PUNTOS, VIDAS y TIEMPO.
- Los tres iconos midieron 14,39 px y compartieron la misma posición vertical que sus títulos.
- La captura confirmó que los iconos ya no reciben el borde circular ni el espacio de una tarjeta.
- La prueba enfocada terminó correctamente con 17 pruebas aprobadas.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.

## **Sincronización del movimiento del 28 de octubre de 2026**

Después de la revisión visual, cambiamos el movimiento de 480 a 360 milisegundos por celda. Quitamos la aceleración que avanzaba rápido al inicio y frenaba al final. El desplazamiento ahora es lineal y cada una de las dos imágenes de caminata dura 180 milisegundos.

Comprobaciones realizadas:

- Chrome confirmó que el personaje empieza en la celda 1, pasa por la posición 1,5 a los 180 milisegundos y llega a la celda 2 a los 360 milisegundos.
- Chrome confirmó una imagen de caminata distinta para cada mitad del recorrido.
- La prueba enfocada terminó correctamente con 17 pruebas aprobadas.
- La ejecución completa terminó correctamente con 9 archivos y 48 pruebas aprobadas.
- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- `npm run format:check` y `git diff --check`: correctos.
