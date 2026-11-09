# **Diseño GAME-01**

`GameFacade` mantiene el último snapshot confirmado y descarta versiones anteriores. `GameInputController` transforma teclado y controles visibles en comandos. `CanvasRenderer` recibe un estado tipado y dibuja capas: terreno, bloques, bombas, explosiones y jugadores. El renderer se puede sustituir por sprites y animaciones sin tocar transporte ni reglas. Las animaciones visuales nunca alteran vidas o colisiones. `LocalGameSimulator` produce snapshots confirmados y concentra las reglas locales.

`CanvasRenderer` conserva solo estado visual temporal para interpolar entre la posición anterior y la confirmada. La diferencia de coordenadas define la dirección. Cada dirección usa `public/bomberman/<dirección>/first.png` cuando el jugador está quieto y alterna las otras dos imágenes durante el desplazamiento. Si el sistema pide reducir movimiento, el personaje llega directamente a la celda confirmada. Este estado visual no forma parte del contrato ni cambia las reglas de la partida.

La transición entre celdas dura 360 milisegundos y avanza de forma lineal. `LocalGameSimulator` usa el mismo tiempo como espera mínima entre movimientos confirmados, por lo que mantener presionada una tecla no permite recorrer varias celdas de forma instantánea. Los dos pasos del sprite duran 180 milisegundos cada uno para acompañar el recorrido completo. Un intento bloqueado por una pared no inicia la espera.

El terreno, las paredes de piedra y las cajas de madera se dibujan por capas con degradados, bordes, uniones y sombras. El tipo de cada celda sigue llegando únicamente desde el snapshot.

Los recursos de `public/game-assets/items` contienen dos imágenes por elemento: normal y brillante. El Canvas selecciona la imagen según el tiempo visual, pero `BombState.kind` y `GameSnapshot.powerUps` siguen llegando desde el estado confirmado. La bomba clásica y la espacial alternan en la simulación local. Los poderes aparecen como capas del snapshot y el simulador confirma cuándo el jugador los recoge.

Antes de crear una bomba, el simulador comprueba si otro jugador vivo ocupa la celda del dueño. En ese caso no confirma la bomba. Esta regla pertenece al estado del juego y deberá aplicarse en el backend al conectar el modo multijugador.

El poder del mapa permanece ocho segundos, pero el Canvas solo dibuja su imagen y no muestra una barra. En el modo local, `LocalGameSimulator` controla esa duración, elige una celda libre aleatoria, elimina el poder al vencer, recogerlo o recibir una explosión, y espera 2,5 segundos antes de crear otro.

Al recoger un poder, `PlayerState.powerUpRemainingSeconds` empieza en ocho y disminuye en el snapshot confirmado. `GameFacade` transforma ese número en el progreso visual del borde del recuadro PODER. Cuando llega a cero, el nombre se limpia. El frontend no inventa este tiempo fuera del modo local; el adaptador real deberá recibirlo desde el backend.

Los archivos verticales recibidos tenían invertida su orientación visual. El mapeo de sprites usa las imágenes de `up` para bajar y las de `down` para subir. La base de color se dibuja después del borde inferior de la celda para quedar debajo de los pies, sin modificar la posición lógica.

La simulación local muestra cuatro participantes en las cuatro esquinas. Los rivales adicionales son datos de demostración y no representan todavía jugadores conectados por SignalR.

La pantalla de partida lleva el patrón cuadriculado, el degradado morado y el relieve rosado del inicio al marco del tablero y sus controles. Esta adaptación no cambia el canvas, los comandos ni las reglas de la simulación.

El HUD usa una cuadrícula de dos columnas en escritorio: métricas verticales a la izquierda y, a la derecha, temporizador y Canvas. En móvil se ordena como temporizador, tablero y métricas en dos columnas. `GameFacade.activeOpponents` deriva los rivales vivos y `GameFacade.powerUpName` expone el nombre opcional de `PlayerState.powerUpName`; si no existe, la interfaz muestra `Sin poder`. Las animaciones respetan `prefers-reduced-motion`.

El resumen final usa iconos SVG con trazo uniforme para puntos, vidas y tiempo. Cada icono forma parte de la línea del título y los estilos de tarjeta se aplican solo a los hijos directos de `result-stats`, evitando que los iconos reciban bordes o espacios de una tarjeta completa.

Cuando el resultado termina, `Game` llama a `RoomFacade.returnToWaiting`. El repositorio conserva la sala y sus participantes, cambia su estado a `waiting` y la navegación vuelve a `/salas/:roomId`. Si no existe una sala activa, la acción regresa al menú.
