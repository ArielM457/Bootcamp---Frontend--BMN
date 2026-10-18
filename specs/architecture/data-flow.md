# **Flujo de datos propuesto**

**Lecturas.** Pantalla → facade → interfaz de repositorio → adaptador mock o HTTP → DTO validado → modelo de vista → Signal → pantalla.

**Comandos de partida.** Teclado → controlador de entrada → comando SignalR → servidor → evento confirmado con versión de estado → estado de partida → Canvas. El Canvas solo dibuja.

**Reconexión.** Al recuperar SignalR pedimos un snapshot al servidor y sustituimos el estado compartido local. Descartamos eventos viejos según versión. La forma exacta de reanudación queda pendiente de acordar con el backend.

**Errores.** Los adaptadores transforman errores de transporte en fallos tipados. La facade decide el mensaje visible y conserva el estado recuperable. No mostramos como confirmada una acción que el servidor rechazó.
