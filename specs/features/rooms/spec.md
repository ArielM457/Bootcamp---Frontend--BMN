# **ROOM-01 · Salas**

Estado: aprobado para implementación local el 18 de octubre de 2026. Como jugador quiero listar, crear y unirme a una sala para esperar una partida.

Requisitos: listado y detalle, participantes, límite de 2 a 8 plazas, anfitrión e inicio autorizado. Cada jugador puede estar en una sola sala de espera. El anfitrión puede añadir un único bot local si existe una plaza libre. El bot ocupa una plaza, cuenta para el mínimo de 2 participantes y no ejecuta acciones. El anfitrión puede iniciar con al menos 2 participantes. Al salir el anfitrión, el siguiente jugador humano ocupa su lugar. Si solo queda el bot, la sala se elimina. Contratos: `/rooms`, `/rooms/{roomId}`, participantes y creación de partida en OpenAPI; `JoinRoom`, `RoomJoined` y presencia en SignalR. Errores: sala llena, cerrada, inexistente, sesión vencida y desconexión. Depende de AUTH-01 y LOBBY-01.
