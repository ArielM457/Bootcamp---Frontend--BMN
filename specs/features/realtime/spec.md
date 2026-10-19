# **REAL-01 · Sincronización**

Estado: aprobado para implementación local el 18 de octubre de 2026. Como jugador quiero que la partida se recupere de una interrupción sin aceptar acciones sobre un estado incierto.

Requisitos aprobados para el adaptador local: conectar con identidad válida, enviar comandos identificados, recibir snapshots confirmados, descartar versiones anteriores, bloquear controles durante una interrupción, recuperar el último snapshot antes de habilitarlos y permitir reintentar o salir si la recuperación falla.

El contrato de servidor sigue en `signalr-events.md` como propuesta. La conexión SignalR, la presencia compartida, la autenticación del hub y la recuperación mediante API dependen de un acuerdo con el backend y no se consideran implementadas.
