# **HOME-01 · Bienvenida retro**

Estado: aprobada el 18 de octubre de 2026 mediante solicitud directa del usuario.

Como visitante quiero encontrar un menú inicial inspirado en Bomberman para entender qué ofrecerá el proyecto y acceder a las siguientes fases cuando estén disponibles.

La pantalla debe ocupar toda la ventana y no debe tener barra de navegación ni pie global. Debe usar la paleta CodeSprint basada en morado, magenta, rosa y blanco. La mitad izquierda debe tener el color fuerte, la unión central debe desvanecerse hacia blanco y el lado derecho debe mostrar una simulación visual animada del juego.

El menú debe incluir opciones comunes de inicio, salas, ranking y ayuda. Las funciones que todavía no están implementadas deben llevar a una pantalla de Próximamente y mostrar su fase, sin simular que ya funcionan.

La animación es decorativa y pertenece al shell de la Fase 0. No implementa Canvas, reglas, movimiento del jugador ni estado de partida.

## **Revisión 2 · Rediseño visual**

Estado: aprobada por Jhos el 22 de octubre de 2026.

La bienvenida debe parecerse a la referencia `material-referencia/referencia-menu.jpg`. La imagen no se usa como fondo ni como recurso.

- La paleta amplía el morado, el lila y el rosa. Los tokens nuevos viven en `src/styles/_tokens.scss` y no cambian los existentes.
- El título y el menú quedan a la izquierda. Las opciones parecen tarjetas de cristal y la principal se destaca con borde y brillo.
- A la derecha se ve una consola portátil dibujada con un SVG propio. Es decorativa y no se anuncia a lectores de pantalla.
- En pantallas medianas la consola baja debajo del menú. En móviles se oculta.
- Las cuatro opciones mantienen sus rutas y parámetros actuales.
- El foco es visible, el texto cumple contraste AA y las animaciones se detienen con `prefers-reduced-motion`.
- No se cargan fuentes externas. El relieve del título se logra con sombras de texto.
