# **LOBBY-01 · Menú principal**

Estado: aprobado para implementación el 18 de octubre de 2026. Como jugador autenticado quiero ver mis opciones para entrar a salas, consultar ranking y conocer mi perfil.

Requisitos: menú legible con perfil, creación de sala, entrada con código, ranking y cierre de sesión. Perfil y creación se abren en la misma composición mediante un panel lateral; entrar a una sala usa un popup. Si el jugador ya pertenece a una sala, la opción de crear cambia a volver a la sala y abre su sala de espera. El perfil permite guardar nombre, nickname y personaje, y muestra el score confirmado por el repositorio. No debe mostrar nombres de fases, CodeSprint, estados técnicos ni estadísticas inventadas. Contratos: perfil propio y ranking. Errores: sesión vencida y fallo de carga. Depende de AUTH-01 y navegación base.
