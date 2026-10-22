# **Aceptación HOME-01**

- El inicio no muestra barra de navegación ni pie global.
- El fondo combina morado, magenta, rosa y blanco con un desvanecido central.
- El menú ofrece accesos a jugar, salas, ranking y ayuda mediante enlaces que funcionan con teclado.
- Cada función pendiente abre una pantalla que muestra Próximamente y su fase correspondiente.
- La escena de la derecha es decorativa: no muestra textos de desarrollo y no se anuncia a lectores de pantalla.
- La composición se adapta a escritorio y móvil sin perder contenido.
- Las animaciones se desactivan cuando el sistema pide reducir movimiento.

## **Revisión 2**

- Los cuatro enlaces apuntan a `/entrar` y a `/proximamente?opcion=Buscar sala`, `Ranking` y `Cómo jugar`.
- La consola es un SVG con `aria-hidden="true"`.
- Hasta 920 px la consola aparece debajo del menú. Hasta 560 px está oculta.
- Cada opción muestra un foco visible al navegar con Tab.
- Los tokens nuevos están en `_tokens.scss` y los existentes no cambian.
