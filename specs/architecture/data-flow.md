# **Flujo de datos actual**

**Lecturas.** Pantalla → facade → interfaz de repositorio → adaptador HTTP → respuesta del backend → modelo de vista → Signal → pantalla.

**Comandos de partida.** Teclado → controlador de entrada → `MovePlayer` por SignalR → servidor → `PlayerMoved` o `GameStateUpdated` → estado de partida → Canvas. El Canvas solo dibuja.

**Reconexión.** SignalR se reconecta automáticamente y vuelve a invocar `JoinGame`. El backend envía el estado actual al entrar. No existe un método `RequestSnapshot` ni una versión de estado en el contrato actual.

**Errores.** Los adaptadores transforman errores de transporte en fallos tipados. La facade decide el mensaje visible y conserva el estado recuperable. No mostramos como confirmada una acción que el servidor rechazó.
