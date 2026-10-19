# **GAME-01 · Partida y tablero**

Estado: aprobado para implementación local el 18 de octubre de 2026. Como jugador quiero moverme, colocar bombas y ver el resultado de mis acciones en un tablero 2D.

Requisitos: tablero local de 13 × 11, 3 vidas, 120 segundos, bombas con espera de 1.5 segundos y alcance de 2 celdas. Las paredes detienen la explosión y no se destruyen. Las cajas se destruyen y detienen el alcance. Entrada por teclado y controles visibles. Canvas dibuja `GameSnapshot`; el simulador local confirma colisiones, daño y ganador. El servidor será la autoridad al conectar multijugador. Contratos: modelos del juego, partida HTTP y comandos/eventos SignalR. Errores: comando rechazado, evento fuera de orden, desconexión y estado incompleto. Depende de ROOM-01.
