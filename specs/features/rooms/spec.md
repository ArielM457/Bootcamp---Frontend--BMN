# **ROOM-01 · Salas**

Estado: propuesta sin aprobar. Como jugador quiero listar, crear y unirme a una sala para esperar una partida.

Requisitos: listado y detalle, participantes, límite de plazas, anfitrión e inicio autorizado. Contratos: `/rooms`, `/rooms/{roomId}`, participantes y creación de partida en OpenAPI; `JoinRoom`, `RoomJoined` y presencia en SignalR. Errores: sala llena, cerrada, inexistente, sesión vencida y desconexión. Depende de AUTH-01 y LOBBY-01. Hay que aprobar el número de plazas y reglas de salida.
