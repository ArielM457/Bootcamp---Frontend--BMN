# **Diseño ROOM-01**

`RoomFacade` usa `RoomRepository`. El repositorio local consulta, crea, une, añade un bot, permite salir e inicia una partida. `RoomParticipant` distingue jugadores humanos y bots sin cambiar el modelo global de autenticación. La futura integración usará HTTP y `RoomRealtimePort` para actualizar participantes. La sala de espera muestra anfitrión, bot y plazas. Añadir bot e iniciar son acciones exclusivas del anfitrión. El inicio se habilita con al menos 2 participantes. Los componentes solo leen Signals y llaman a la facade.
