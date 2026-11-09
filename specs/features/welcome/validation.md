# **Validación HOME-01**

Fecha: 18 de octubre de 2026.

Estado: implementación inicial terminada. Revisión visual manual pendiente.

El 18 de octubre de 2026 ajustamos el panel izquierdo para usar cuadros medianos en lugar de líneas cruzadas. También oscurecimos y redondeamos los botones, y dejamos blanco todo su texto.

En la segunda revisión quitamos las etiquetas CodeSprint, Bomberman Online, Simulación visual y Base en desarrollo. Aumentamos el título y las opciones, ampliamos el degradado central y reducimos la escena arcade.

En la tercera revisión quitamos el texto inferior de la escena y aumentamos el patrón del fondo de `64 px` a `192 px`.

Comprobaciones realizadas:

- `npm test -- --watch=false`: correcto, 2 archivos y 2 pruebas.
- `npm run build`: correcto, salida generada en `dist/bomberman-online`.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.
- `npm start -- --host 127.0.0.1 --port 4200`: servidor iniciado correctamente.

La prueba de `Welcome` comprueba el menú con cuatro enlaces, el aviso de Fase 0, la etiqueta de simulación visual y la ausencia de encabezado global.

No se completó la revisión visual en navegador. El entorno de ejecución bloqueó el inicio automatizado de Chrome. Queda pendiente revisar la composición y las animaciones en escritorio y móvil antes de cerrar HOME-01.

## **Revisión 2 · Rediseño visual**

Fecha: 22 de octubre de 2026.

Estado: implementada. Falta revisar con lector de pantalla y con movimiento reducido real.

Cambios:

- Tokens nuevos en `_tokens.scss`: `$purple-deep`, `$purple-glass`, `$lilac`, `$lilac-white`, `$pink-light`, `$pink-shadow` y `$console-body`.
- Título con relieve hecho con `text-shadow`, opciones de cristal e iconos SVG.
- El arcade CSS se reemplazó por una consola SVG con `aria-hidden="true"`.

Comprobaciones:

- `npm run validate`: correcto. 7 archivos y 26 pruebas, lint, build y prettier.
- `welcome.spec.ts` comprueba las rutas de los cuatro enlaces y que la consola y los iconos estén ocultos para lectores de pantalla.
- En Chrome a 1150 px el menú está a la izquierda y la consola a la derecha.
- A 900 px la consola aparece debajo del menú. A 375 px está oculta y no hay scroll horizontal.
- Con Tab, la opción enfocada muestra un contorno blanco y un borde magenta.
- No se emuló `prefers-reduced-motion` en el navegador. La regla está en `welcome.scss`.

**Ajuste del bomber y simulación (22 de octubre de 2026).** El bomber se redibujó siguiendo `personaje-referencia.png`. La consola ahora reproduce un bucle de 12 s: el bomber pone una bomba y se cubre, y la explosión elimina al fantasma A. Luego repite con el fantasma B, y los dos reaparecen al final del ciclo. Se revisó en Chrome deteniendo la animación en 3.2 s, 5.2 s y 7.15 s: cada explosión alcanza a su fantasma y no al bomber. `npm run validate`: correcto, 26 pruebas.
