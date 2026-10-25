# **Diseño LOBBY-01**

La ruta `/menu` se carga de forma diferida y está protegida por `authGuard`. La pantalla usa Signals para alternar el menú, el perfil y la creación de sala sin navegar a otra ruta. El panel izquierdo se desliza y el derecho cambia entre la consola, el personaje y la pista. El popup de unión conserva el menú detrás.

La pantalla lee y actualiza el jugador por medio de `AuthFacade`, crea o une salas por medio de `RoomFacade` y consulta el score desde `ScoreFacade`. Los componentes no acceden al almacenamiento. El personaje guardado define el color del jugador en la partida local. La pantalla no muestra nombres de fases ni información interna del proyecto.
