# **Validación SCORE-01**

Fecha: 18 de octubre de 2026.

Estado: resultado y ranking local implementados y comprobados manualmente por el usuario el 18 de octubre de 2026. Integración con servidor pendiente.

Implementamos puntuación para victoria y derrota, acumulación por jugador, registro único por partida, orden del ranking y estado vacío. Al terminar una partida se muestran puntos, vidas y tiempo restante. El menú abre el ranking local y destaca al jugador actual.

Reglas comprobadas:

- Una victoria suma 1000 puntos, 100 por vida y 5 por segundo restante.
- Una derrota suma 100 puntos y 50 por vida restante.
- Un resultado repetido no aumenta partidas ni puntos.
- El ranking ordena por puntos, victorias y nombre.
- Una lista sin partidas muestra una invitación para jugar.
- Un error de carga muestra una acción para reintentar.

Comprobaciones realizadas:

- `npm test -- --watch=false`: correcto, 6 archivos y 23 pruebas.
- `npm run build`: correcto.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.

Pendiente de validación final:

- Cálculo y orden confirmados por un backend real.

El usuario confirmó en navegador que el resultado y el ranking funcionan correctamente.
