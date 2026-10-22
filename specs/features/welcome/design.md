# **Diseño HOME-01**

La ruta de inicio mantiene la carga diferida del componente standalone `Welcome`. El shell global se reduce al área de rutas para que la bienvenida controle toda la ventana.

La composición usa dos zonas. La zona izquierda presenta un título grande y un menú vertical sobre un patrón de cuadros medianos. Los botones tienen forma redondeada, fondo morado oscuro y texto blanco para mantener el contraste. El degradado central ocupa una zona amplia. La zona derecha contiene una escena decorativa más pequeña con tablero, personaje, bombas y explosiones animadas con CSS.

Los enlaces usan rutas reales y foco visible. En pantallas pequeñas, las zonas se apilan y conservan el orden del menú antes de la escena. Si el sistema pide reducir movimiento, las animaciones se detienen.

No se añaden servicios, adaptadores ni estado de juego. La pantalla de Próximamente recibe el nombre y la fase mediante parámetros de consulta para explicar el estado real de cada acceso.

## **Revisión 2 · Rediseño visual**

**Composición.** Grid de dos columnas (≈55/45). Hasta 920 px pasa a una columna con la consola debajo. Hasta 560 px la consola se oculta con `display: none`.

**Fondo.** Degradado horizontal de `$purple-deep` a `$purple`, `$purple-soft`, `$pink-soft` y `$lilac-white`. A la izquierda se mantiene el patrón de cuadros con máscara. Se suman partículas pequeñas hechas con `radial-gradient` y fragmentos rosas que flotan cerca de la consola. Todo es decorativo y usa `pointer-events: none`.

**Título.** "BOMBER" y "MAN" en dos líneas, con fuente del sistema gruesa. El relleno es `$pink-light` y el relieve sale de varias capas de `text-shadow` en `$pink-shadow` y `$purple-deep`.

**Opciones.** Cada opción es una tarjeta de cristal: base `rgba($purple-deep, .55)`, una capa blanca del 6 al 10 %, borde rosa al 35 %, `backdrop-filter: blur` y un reflejo diagonal en `::after`. La opción principal lleva borde magenta y brillo exterior. El icono es un SVG pequeño dentro de un cuadro redondeado. El nombre va en mayúsculas monoespaciadas y debajo lleva un subtítulo.

**Consola.** Un `<svg>` inline con `viewBox`, `aria-hidden="true"` y `focusable="false"`. Contiene la carcasa redondeada, una pantalla oscura, el HUD `1P 00350` / `TIME 007`, un tablero de 8×6 con bloques rosas y lilas, el bomber, dos fantasmas, una bomba, el texto "NIVEL 01 · LISTO", la cruceta, la rejilla del altavoz y dos botones amarillos. Los colores salen de los tokens mediante clases en `welcome.scss`. Las animaciones CSS (flotar, mecha y fantasmas) se anulan con `prefers-reduced-motion`.

**Accesibilidad.** El foco usa un `outline` blanco de 3 px con separación y un borde magenta. El texto blanco sobre la tarjeta alcanza al menos 4.5:1 gracias a la base oscura. Hover y foco no dependen solo del color: la tarjeta se desplaza con `translateX` y cambia su borde.

**Sin cambios.** El componente `Welcome`, sus rutas y la pantalla de Próximamente siguen igual. No se añaden servicios ni dependencias.

**Ajuste del 22 de octubre de 2026 (pedido directo de Jhos).** El bomber sigue `material-referencia/personaje-referencia.png`: casco morado, pompón magenta, cara clara con ojos verticales, guantes, cinturón y botas rosas. La consola muestra una simulación decorativa en bucle de 12 segundos hecha con keyframes CSS. El bomber camina por celdas libres, pone una bomba, se aleja y la explosión en cruz elimina a un fantasma. Luego repite con el segundo, y los fantasmas reaparecen al final del ciclo. No usa TypeScript ni el estado del juego. Con `prefers-reduced-motion` la escena queda fija, sin bombas ni explosiones.
