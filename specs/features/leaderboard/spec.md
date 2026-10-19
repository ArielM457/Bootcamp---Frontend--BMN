# **SCORE-01 · Puntuaciones y ranking**

Estado: aprobado para implementación local el 18 de octubre de 2026. Como jugador quiero ver el resultado de una partida y mi lugar en el ranking.

Requisitos locales: puntuación por partida, resultado de victoria o derrota, ranking ordenado y estado vacío. Una victoria entrega 1000 puntos, más 100 por cada vida restante y 5 por cada segundo restante. Una derrota entrega 100 puntos, más 50 por cada vida restante. El ranking se ordena por puntos totales, victorias y nombre. Un mismo resultado no puede registrarse dos veces. Contratos futuros: `/games/{gameId}/scores` y `/leaderboard`. Cuando exista backend, el servidor calculará los puntos. Errores: partida no encontrada, ranking no disponible y sesión vencida para datos privados. Depende de GAME-01.
