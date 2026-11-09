# **Diseño ROOM-01**

`HttpRoomRepository` conecta el listado, consulta, creación, unión e inicio de salas. `RoomFacade` expone el estado mediante Signals y los componentes no llaman directamente a HTTP.

El modelo contiene únicamente los datos entregados por el backend: identificador, nombre, estado, capacidad y participantes. No contiene anfitrión, pista, modo, bots ni tipo de participante.

La sala de espera habilita el inicio cuando el jugador autenticado pertenece a la sala y existen al menos dos participantes. El jugador que inicia recibe el `gameId` y navega a la partida.

El backend no ofrece configuración, abandono, sala actual, retorno a espera ni una notificación de inicio que entregue el `gameId` al resto de participantes. Esas acciones no tienen reemplazo local.
