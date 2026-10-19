# **Diseño REAL-01**

`GamePort` abstrae snapshots, estado de conexión, envío, rechazos y reconexión. `MockRealtimeGameAdapter` envuelve el simulador local, conserva el último snapshot y lo publica antes de volver al estado conectado. `GameFacade` aplica solo versiones nuevas, genera un `commandId` por acción y bloquea comandos cuando la conexión no está lista.

`LocalGameSimulator` conserva las reglas y no conoce la conexión. El Canvas continúa limitado al renderizado. El futuro adaptador SignalR implementará el mismo puerto cuando se validen la URL, la autenticación y el contrato con el backend. La conexión nunca se usa como autoridad de presencia sin una confirmación del servidor.
