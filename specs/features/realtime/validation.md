# **Validación REAL-01**

Fecha: 18 de octubre de 2026.

Estado: recuperación local implementada. Conexión SignalR real pendiente.

Implementamos un adaptador que envuelve el motor local y expone estados de conexión, snapshots y rechazos correlacionados. Durante una interrupción, la partida bloquea los controles. Al recuperarse, publica primero el último tablero confirmado y después vuelve a aceptar acciones. Si la recuperación falla, permite reintentar o salir.

Comprobaciones realizadas:

- Un snapshot anterior no reemplaza al estado actual.
- Una acción enviada sin conexión se rechaza y no modifica el tablero.
- La recuperación publica el snapshot antes del estado conectado.
- Una recuperación fallida queda visible y un reintento puede restablecer la partida.
- Los controles quedan deshabilitados mientras el estado no es seguro.
- `npm test -- --watch=false`: correcto, 5 archivos y 16 pruebas.
- `npm run build`: correcto.
- `npm run lint`: correcto.

Pendiente de validación final:

- Revisión visual y táctil en navegador real.
- URL, autenticación y eventos acordados con el backend.
- Reconexión y recuperación contra SignalR y API reales.
