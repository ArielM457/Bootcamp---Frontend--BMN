# **Especificaciones de Bomberman Online**

Este directorio es la fuente de verdad del proyecto. Cada función sigue requisitos, diseño, tareas, implementación y validación.

## **Implementado localmente**

- `welcome`: bienvenida retro.
- `authentication`: registro, acceso y sesión local.
- `lobby`: menú del jugador.
- `rooms`: salas, participantes y bot inmóvil.
- `gameplay`: partida Canvas local.
- `realtime`: recuperación simulada mediante snapshots.
- `leaderboard`: resultado y ranking durante la sesión.
- `quality`: accesibilidad, pruebas de flujo y documentación.

## **Pendiente de backend**

OpenAPI y SignalR continúan como propuestas. Antes de crear adaptadores reales debemos validar URL, autenticación, DTO, errores, eventos y reglas de autoridad con el equipo de backend.

Lee [integration/backend-guide.md](integration/backend-guide.md) para conocer los puntos de conexión y las validaciones necesarias.
