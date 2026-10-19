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
