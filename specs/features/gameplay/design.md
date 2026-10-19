# **Diseño GAME-01**

`GameFacade` mantiene el último snapshot confirmado y descarta versiones anteriores. `GameInputController` transforma teclado y controles visibles en comandos. `CanvasRenderer` recibe un estado tipado y dibuja capas: terreno, bloques, bombas, explosiones y jugadores. El renderer se puede sustituir por sprites y animaciones sin tocar transporte ni reglas. Las animaciones visuales nunca alteran vidas o colisiones. `LocalGameSimulator` produce snapshots confirmados y concentra las reglas locales.
