# **Roadmap propuesto**

Estado: fases 1 a 6 pendientes de aprobación. El esfuerzo es relativo: S, M o L. Dentro de cada fase seguimos el orden escrito.

## **Fase 0 · Fundamentos** - Ariel

Objetivo: dejar una base Angular que compile. Funciones: configuración, estructura, diseño, rutas, contratos, herramientas y shell. Dependencias: Node compatible. Entregables: proyecto, bienvenida retro HOME-01, documentos y skills locales. Aceptación: build, pruebas y lint pasan; la UI informa que aún no hay juego. HOME-01 tiene implementación inicial y revisión visual manual pendiente. Riesgo: contratos sin validar. Esfuerzo: M. Orden: proyecto → estructura → contratos → shell → validación.

## **Fase 1 · Autenticación y navegación** - Ariel

Estado: autenticación y menú local implementados el 18 de octubre de 2026. Integración HTTP y revisión manual en navegador pendientes.

Objetivo: permitir acceso identificado. Funciones: registro, login, sesión, dashboard y guard. Dependencias: Fase 0 y contrato JWT. Entregables: AUTH-01 y LOBBY-01. Aceptación: flujos válidos y errores probados en demo y contra API acordada. Riesgo: manejo de tokens sin acuerdo. Esfuerzo: M. Orden: aprobar contratos → repositorios mock → UI → API → pruebas.

## **Fase 2 · Lobby y salas**

Estado: flujo local de salas implementado el 18 de octubre de 2026. HTTP, presencia en tiempo real y revisión manual en navegador pendientes.

Objetivo: preparar jugadores para una partida. Funciones: listado, creación, unión, espera y participantes. Dependencias: Fase 1 y contrato de salas. Entregable: ROOM-01. Aceptación: sala llena, permisos y presencia se muestran de forma correcta. Riesgo: estados simultáneos. Esfuerzo: M. Orden: reglas → mock → pantallas → HTTP y eventos → pruebas.

## **Fase 3 · Motor visual**

Estado: partida local implementada el 18 de octubre de 2026. Revisión visual y táctil en navegador pendiente.

Objetivo: representar una partida local en Canvas. Funciones: tablero, personajes, movimiento, bombas y explosiones. Dependencias: modelos y reglas de GAME-01 aprobados. Entregable: renderer y demostración local. Aceptación: snapshots fijos se dibujan bien y comandos locales son verificables. Riesgo: reglas ambiguas. Esfuerzo: L. Orden: modelos → renderer → entrada → simulación → pruebas.

## **Fase 4 · Tiempo real**

Objetivo: sincronizar partidas. Funciones: SignalR, conexión, eventos, versiones y reconexión. Dependencias: Fases 2 y 3; hub disponible. Entregable: REAL-01 integrado. Aceptación: eventos confirmados actualizan el tablero y reconexión recupera snapshot. Riesgo: eventos fuera de orden. Esfuerzo: L. Orden: contrato → adaptador → sincronización → recuperación → pruebas.

## **Fase 5 · Resultados**

Estado: resultado y ranking local implementados el 18 de octubre de 2026. Integración con servidor y revisión manual en navegador pendientes.

Objetivo: cerrar partidas y mostrar progreso. Funciones: victoria, derrota, puntuaciones, ranking y estadísticas acordadas. Dependencias: Fase 4 y reglas de puntos. Entregable: SCORE-01. Aceptación: resultado confirmado y ranking coherente. Riesgo: fórmulas sin definir. Esfuerzo: M. Orden: fórmula → repositorio → pantallas → integración → pruebas.

## **Fase 6 · Calidad y entrega**

Estado: accesibilidad base, prueba de flujo y guía de integración implementadas el 18 de octubre de 2026. Revisión manual final y backend real pendientes.

Objetivo: preparar uso por estudiantes. Funciones: pruebas de flujo, accesibilidad, rendimiento, documentación y guía de integración. Dependencias: Fases 1 a 5. Entregables: versión validada y guía. Aceptación: criterios de funciones aprobadas pasan; guía permite conectar backend sin cambiar componentes. Riesgo: diferencias entre implementaciones backend. Esfuerzo: M. Orden: auditoría → correcciones → pruebas completas → documentación.
