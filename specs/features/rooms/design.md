# **Diseño ROOM-01**

`RoomFacade` usa `RoomRepository` y `RoomRealtimePort`. El repositorio consulta y crea; el puerto de eventos actualiza participantes. Habrá adaptadores mock y reales. La sala de espera muestra anfitrión y plazas. El botón de iniciar solo se habilita para el anfitrión cuando el servidor indica que se puede iniciar.
