# **REAL-01 · Sincronización**

Estado: propuesta sin aprobar. Como jugador quiero que las acciones y la presencia se actualicen en una partida compartida.

Requisitos: conectar con identidad válida, unirse a grupo, enviar comandos, recibir eventos confirmados, detectar desconexión y recuperar snapshot. Contrato: `signalr-events.md`. Errores: token vencido, comando rechazado, pérdida de red, mensajes viejos y reconexión fallida. Depende de AUTH-01, ROOM-01 y acuerdo del hub backend.
