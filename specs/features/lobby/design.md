# **Diseño LOBBY-01**

La ruta `/menu` se carga de forma diferida y está protegida por `authGuard`. La pantalla usa Signals para alternar el menú, el perfil y la creación de sala sin navegar a otra ruta. El panel izquierdo se desliza y el derecho cambia entre la consola, el personaje y la pista. El popup de unión conserva el menú detrás.

La pantalla lee y actualiza el jugador por medio de `AuthFacade`, crea o une salas por medio de `RoomFacade` y consulta el score desde `ScoreFacade`. Los componentes no acceden al almacenamiento. El personaje guardado define el color del jugador en la partida local. La pantalla no muestra nombres de fases ni información interna del proyecto.

El menú y sus vistas internas conservan la identidad visual del inicio. Usamos el mismo degradado de morado oscuro a fondo claro, el patrón de cuadros, el título rosado con relieve y las opciones de cristal. Perfil, Crear sala y el popup para entrar conservan sus controles y cambian únicamente su presentación. El panel derecho sigue mostrando una vista previa distinta para la consola, el personaje y la pista.

La vista previa de Perfil construye el personaje con capas CSS separadas en profundidad. El casco y el cuerpo tienen cara frontal y posterior, el rostro se oculta al mirar desde atrás y el conjunto gira de `0deg` a `360deg` sobre el eje vertical. La plataforma permanece fija y combina un disco en perspectiva con una sombra que cambia durante el giro. `prefers-reduced-motion` detiene ambas animaciones y deja el personaje inclinado en una posición legible.
