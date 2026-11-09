# **Validación QA-01**

Fecha: 18 de octubre de 2026.

Estado: mejoras locales de calidad implementadas. Revisión manual final pendiente.

Implementamos un enlace para saltar al contenido, foco global visible, reducción de animaciones, controles direccionales más grandes y un ranking móvil que conserva todos sus datos. Actualizamos la documentación y añadimos una guía para reemplazar adaptadores locales por integraciones reales.

La prueba de flujo recorre:

- Creación de una sala.
- Incorporación del bot.
- Inicio de la partida.
- Movimiento confirmado mediante snapshot.
- Registro de una victoria.
- Aparición del jugador en el primer lugar del ranking.

Comprobaciones realizadas:

- `npm test -- --watch=false`: correcto, 7 archivos y 24 pruebas.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm run format:check`: correcto.
- `npm run validate`: correcto.

Pendiente:

- Recorrer con teclado todas las pantallas en un navegador real.
- Probar los controles táctiles en un dispositivo físico.
- Probar el flujo compartido cuando exista backend.

## **Selección de adaptadores (tarea 7)**

Fecha: 22 de octubre de 2026.

Estado: implementado según el ADR 0002. El modo `demo` registra los adaptadores locales. El modo `api` falla al iniciar con un mensaje que nombra los adaptadores HTTP y SignalR pendientes.

`src/app/app.config.spec.ts` añade tres pruebas:

- Modo `demo`: cada token resuelve a su adaptador local.
- Modo `api`: `provideDataAdapters('api')` lanza el error esperado.
- `appConfig` usa el modo `demo` del environment por defecto.

Comprobaciones realizadas:

- `npm run validate`: correcto. 8 archivos y 29 pruebas, de las cuales 2 vienen de cambios de `welcome` en curso; esta tarea deja 27 pruebas.
- `npx ng build --configuration production,api`: compila y el bundle contiene el mensaje del modo `api`.
- Revisión manual con `npx ng serve --configuration api`: la consola del navegador muestra `Uncaught Error: Modo 'api' no disponible…` desde `provideDataAdapters` y la app no arranca.

Pendiente:

- Implementar los adaptadores reales.

## **Revisión de accesibilidad en el código**

Fecha: 22 de octubre de 2026.

Estado: revisión del código terminada. Corregidos P1, G1, G2 y G3 (ver abajo). El resto de hallazgos y la prueba manual siguen pendientes.

Pantallas revisadas: bienvenida (incluida la nueva), próximamente, entrar, registro, menú, lista de salas, sala de espera, partida, resultado y ranking.

Qué se revisó en el código:

- Foco visible: estilos `:focus-visible` globales y por pantalla.
- Orden de tabulación: orden del DOM, controles desactivados y contenido que aparece o desaparece.
- Etiquetas: `label` de campos, nombres accesibles de botones y enlaces, landmarks e idioma.
- Contraste: pares de colores de `_tokens.scss` calculados con la fórmula WCAG.
- Mensajes de estado: `role="alert"`, `role="status"` y `aria-live`.
- Movimiento reducido: regla global de `styles.scss` y reglas propias de cada pantalla.
- Controles táctiles: tamaño de los controles según su CSS.

Hallazgos principales:

- Alta: en la partida, Enter y Espacio se capturan en `window` con `preventDefault`. Con teclado no se pueden activar «Salir», «Jugar otra vez», «Ver ranking» ni «Reintentar».
- Alta: `index.html` declara `lang="en"` y todo el contenido está en español.
- Alta: texto blanco sobre `$magenta` tiene contraste 4,31:1. Por debajo de 4,5:1 en texto normal. Afecta a los botones principales de casi todas las pantallas.
- Alta: el foco global `$magenta` sobre `$purple` tiene 2,83:1. Por debajo de 3:1. Afecta a enlaces sin estilo de foco propio en entrar, registro, menú y próximamente.
- Media: los errores de campo no están ligados al campo (`aria-describedby`, `aria-invalid`).
- Media: los mensajes de estado se insertan con `@if` junto con su región viva. Algunos lectores no los anuncian.
- Media: el foco se pierde cuando un botón con foco se desactiva (envío de formularios, fin de partida).
- Media: el ranking no tiene semántica de tabla y la fila del jugador actual solo se distingue por estilo.
- Media: en el lienzo, jugador y rival solo se distinguen por color (contraste 2,25:1 entre sí).

El detalle completo por pantalla está en la conversación de revisión del 22 de octubre de 2026.

Contrastes calculados (texto sobre fondo):

| Par                                        | Contraste |
| ------------------------------------------ | --------- |
| Blanco sobre `$magenta`                    | 4,31:1    |
| `$pink` sobre `$magenta`                   | 2,25:1    |
| Contorno `$magenta` sobre `$purple`        | 2,83:1    |
| Contorno `$magenta` sobre `$purple-dark`   | 4,04:1    |
| `$pink` sobre `$purple`                    | 6,37:1    |
| Blanco sobre `$purple-soft`                | 5,87:1    |
| Texto de lugar vacío en sala de espera     | 3,05:1    |
| Borde de campo en reposo (`$pink` al 34 %) | 2,17:1    |

Qué no se puede comprobar solo leyendo el código:

- Recorrido real con teclado en un navegador: orden de tabulación, foco visible y trampas de foco.
- Anuncios reales con un lector de pantalla (NVDA o Narrador).
- Contraste sobre degradados y transparencias tal como se pintan.
- Comportamiento con «reducir movimiento» activado en el sistema.
- Uso de los controles táctiles en un dispositivo físico.
- Zoom al 200 % y ancho de 320 px.

Pendiente:

- Elegir y corregir los hallazgos restantes (G4–G6, W1, A1–A4, M1–M2, R1–R5, P2–P4, K1–K3).
- Recorrer la lista de comprobación manual con teclado en un navegador real.

### **Correcciones P1, G1, G2 y G3**

Fecha: 22 de octubre de 2026.

- P1: `GameInputController` ya no convierte Enter ni Espacio en bomba si el foco está en un enlace, un campo o un botón sin `data-game-control`. El d-pad y el botón de bomba llevan `data-game-control`, así que Espacio sigue colocando bombas tras pulsarlos.
- G1: `index.html` declara `lang="es"`.
- G2: nuevo token `$magenta-action` (`#b734ba`, 4,98:1 con blanco). Sustituye a `$magenta` en los fondos de botones y tarjetas con texto blanco. `$magenta` se mantiene para acentos, sombras y bordes.
- G3: el foco global de enlaces y botones pasa a contorno blanco (12,2:1 sobre `$purple`, 17,4:1 sobre `$purple-dark`).

Comprobaciones realizadas:

- Prueba nueva en `game-engine.spec.ts`: Enter en un enlace y Espacio en un botón de la página no generan comando; Espacio en un control del juego y en el cuerpo sí colocan bomba. Falla con el controlador anterior y pasa con el nuevo.
- `npm run validate`: correcto. 8 archivos y 30 pruebas.

Pendiente de comprobar a mano:

- En la partida, activar «← Salir», «Jugar otra vez», «Ver ranking» y «Reintentar» con Enter y Espacio.
- Ver el contorno blanco de foco en entrar, registro, menú y próximamente.
- Revisar que el nuevo tono de los botones encaja con la identidad visual.
