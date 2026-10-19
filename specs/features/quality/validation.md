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
