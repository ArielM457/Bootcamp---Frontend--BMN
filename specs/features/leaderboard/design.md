# **Diseño SCORE-01**

`ScoreFacade` consulta `ScoreRepository`. La pantalla de resultado muestra los puntos de la partida y el ranking local se carga aparte. `MockScoreRepository` calcula la regla local, acumula resultados en memoria y evita duplicados por partida y jugador. Adaptadores mock y HTTP comparten la interfaz. El futuro adaptador HTTP conservará el orden confirmado por el backend y no calculará puntos en el frontend.
