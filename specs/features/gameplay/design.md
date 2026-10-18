# **Diseño GAME-01**

`GameFacade` mantiene el último snapshot confirmado. `GameInputController` transforma teclado en intenciones. `CanvasRenderer` recibe un estado tipado y dibuja capas: terreno, bloques, bombas, explosiones, jugadores e indicadores. El render se puede sustituir por sprites y animaciones sin tocar transporte ni reglas. Las animaciones visuales nunca alteran puntos o colisiones. En modo demostración, un simulador local separado produce snapshots.
