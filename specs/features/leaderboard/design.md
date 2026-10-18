# **Diseño SCORE-01**

`ScoreFacade` consulta `ScoreRepository`. La pantalla de resultado muestra puntos confirmados por partida; ranking público se carga aparte. Adaptadores mock y HTTP comparten la interfaz. El orden recibido del backend se conserva, salvo regla de desempate acordada.
