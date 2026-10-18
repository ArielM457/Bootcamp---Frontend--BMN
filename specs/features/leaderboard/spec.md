# **SCORE-01 · Puntuaciones y ranking**

Estado: propuesta sin aprobar. Como jugador quiero ver el resultado de una partida y mi lugar en el ranking.

Requisitos: puntuación por partida, resultado de victoria o derrota, ranking ordenado y estados vacíos. Contratos: `/games/{gameId}/scores` y `/leaderboard`. Los puntos los calcula el backend. Errores: partida no encontrada, ranking no disponible y sesión vencida para datos privados. Depende de GAME-01 y de criterios de puntuación aprobados.
