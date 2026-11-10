# **Diseño ROOM-01**

`HttpRoomRepository` conecta el listado, consulta, creación, unión por ID, unión por código e inicio de salas. `RoomFacade` expone el estado mediante Signals y los componentes no llaman directamente a HTTP.

El modelo contiene únicamente los datos entregados por el backend: identificador, código, creador, nombre, estado, capacidad, participantes y `gameId` cuando la partida existe. No contiene pista, modo, bots ni tipo de participante.

La respuesta identifica al creador mediante `hostPlayerId` y cada participante incluye `isReady`. El creador controla el inicio. Los demás participantes solo cambian su propio estado mediante `PUT /api/rooms/{roomId}/ready`. El backend vuelve a validar creador, cantidad mínima y jugadores listos antes de crear la partida.

La sala de espera habilita el inicio cuando el jugador autenticado pertenece a la sala y existen al menos dos participantes. El jugador que inicia recibe el `gameId` y navega a la partida. Los demás participantes consultan el detalle cada segundo; cuando reciben estado `playing` y `gameId`, navegan a la misma partida.

El backend no ofrece configuración, abandono, sala actual ni retorno a espera. El inicio compartido usa consulta periódica del detalle porque todavía no existe un evento de sala previo a la conexión de la partida.
