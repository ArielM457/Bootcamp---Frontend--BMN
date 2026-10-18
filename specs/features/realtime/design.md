# **Diseño REAL-01**

`RealtimePort` abstrae conexión, envío y suscripción. `SignalRRealtimeAdapter` usa el cliente JavaScript. `MockRealtimeAdapter` reproduce eventos locales. Una facade aplica solo versiones nuevas y consulta `GET /games/{gameId}` tras reconexión. Los errores de comandos se correlacionan por `commandId`. No usamos la conexión como autoridad de presencia hasta recibir confirmación.
