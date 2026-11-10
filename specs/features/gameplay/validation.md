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

## **Bloqueos controlados y sprite más lento del 9 de noviembre de 2026**

Los movimientos bloqueados ya no lanzan una excepción desde `MovePlayer`. El Hub envía `CommandRejected` con el identificador del comando y el frontend muestra el mensaje sin registrar `Failed to invoke hub method`. Las excepciones permanecen para errores reales de conexión, identidad o acceso a otra partida.

El movimiento continúa cada 220 milisegundos, pero cada sprite de caminata se mantiene durante 180 milisegundos para que el cambio de pie sea más fácil de ver.

Comprobaciones realizadas:

- La integración real confirmó rechazos por límite de movimiento y dirección inválida mediante `CommandRejected`.
- El registro de la instancia temporal no mostró fallos de `MovePlayer` durante esos rechazos.
- `npm test -- --watch=false`: correcto, 7 archivos y 16 pruebas aprobadas.
- `npm run lint`, `npm run build` y la compilación Release del backend: correctos.

## **Tres vidas y movimiento mantenido del 9 de noviembre de 2026**

Cada jugador inicia la sesión con tres vidas. Una explosión resta una sola vida y la eliminación ocurre al llegar a cero. El snapshot entrega las vidas al frontend y el HUD muestra el valor confirmado por el servidor.

Reemplazamos la repetición automática del navegador por un control propio. La primera pulsación mueve de inmediato y, si la tecla sigue presionada, envía otra casilla cada 220 milisegundos. El backend rechaza movimientos separados por menos de 180 milisegundos.

Comprobaciones realizadas:

- La prueba del componente confirmó un movimiento inmediato, ningún segundo movimiento antes de 220 milisegundos, un nuevo movimiento al cumplir el tiempo y la detención al soltar la tecla.
- La integración con dos clientes confirmó que una ráfaga enviada al backend se rechaza.
- Tres explosiones consecutivas dejaron las vidas en 2, 1 y 0. La partida terminó solo con la tercera.
- `npm test -- --watch=false`: correcto, 7 archivos y 16 pruebas aprobadas.
- `npm run lint` y `npm run build`: correctos. Continúa el aviso conocido de 110 bytes del presupuesto de `lobby.scss`.
- `dotnet build Bomberman.Api.csproj -c Release`: correcto. Continúa la advertencia nullable preexistente de `PlayerService.cs`.

## **Bombas multijugador y pasos continuos del 9 de noviembre de 2026**

La bomba ya forma parte del estado real de la partida. SignalR permite colocarla y el backend controla una bomba activa por jugador, fusible de dos segundos, alcance de dos celdas, paredes, cadenas, eliminación y ganador. El frontend recibe y dibuja bombas y explosiones sin decidir el resultado.

La animación conserva el tiempo de caminata entre posiciones consecutivas. Mantener una dirección ya no reinicia siempre el mismo sprite: los dos pies cambian cada 180 milisegundos. Las pulsaciones separadas también alternan el primer paso.

Comprobaciones realizadas:

- `dotnet build Bomberman.Api.csproj -c Release`: correcto, con una advertencia nullable preexistente en `PlayerService.cs`.
- `npm test -- --watch=false`: correcto, 7 archivos y 16 pruebas aprobadas.
- `npm run verify:backend` contra una instancia temporal: correcto; ambos clientes recibieron la bomba, la explosión, la eliminación, el ganador y la limpieza del fuego.

Queda pendiente una revisión manual en navegador para confirmar visualmente los controles mantenidos.

## **Carga segura del Canvas del 9 de noviembre de 2026**

Corregimos el acceso prematuro a `nativeElement`. El Canvas ahora se entrega al renderer mediante el setter de `ViewChild` y solo se dibuja cuando existen el elemento y un snapshot confirmado. Antes del primer snapshot, la pantalla muestra un spinner con el estado Preparando partida.

El cambio elimina la condición que producía `Cannot read properties of undefined` en `game.ts`. La revisión visual con una partida real en dos navegadores sigue pendiente.

La prueba enfocada confirmó que primero aparece el spinner, que el renderer no se ejecuta sin snapshot y que después recibe un `HTMLCanvasElement` válido. La ejecución completa terminó con 7 archivos y 15 pruebas aprobadas.

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
