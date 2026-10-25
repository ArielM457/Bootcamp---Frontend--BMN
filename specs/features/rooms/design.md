# **Diseño ROOM-01**

`RoomFacade` usa `RoomRepository`. El repositorio local consulta, crea, une, añade un bot, permite salir e inicia una partida. `RoomParticipant` distingue jugadores humanos y bots sin cambiar el modelo global de autenticación. `Room` conserva `arenaId` para usar la pista abierta o la fortaleza al iniciar. La futura integración usará HTTP y `RoomRealtimePort` para actualizar participantes. La sala de espera muestra anfitrión, bot y plazas. Añadir bot e iniciar son acciones exclusivas del anfitrión. El inicio se habilita con al menos 2 participantes. Los componentes solo leen Signals y llaman a la facade.

La lista y la sala de espera usan el fondo cuadriculado, el degradado morado, las tarjetas de cristal y los acentos rosas del inicio. El cambio visual no modifica los estados de carga, error, sala vacía ni los permisos del anfitrión.
