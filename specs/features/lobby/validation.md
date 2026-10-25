# **Validación LOBBY-01**

Fecha: 18 de octubre de 2026.

Estado: menú local implementado. Revisión manual en navegador pendiente.

Implementamos una ruta protegida con saludo, perfil, acceso a Salas, acceso al ranking local y cierre de sesión. La pantalla solo muestra el nombre del jugador confirmado y no presenta estadísticas inventadas.

El build, las pruebas, el lint y el formato pasan. No afirmamos todavía una revisión visual o de teclado en navegador real.

## **Integración visual del 25 de octubre de 2026**

Conservamos el inicio refinado y recuperamos Perfil, Crear sala, Entrar a una sala y Ranking desde la rama de Ariel. Adaptamos el menú, acceso, registro, salas, espera, ranking, partida y Próximamente a la misma identidad visual.

Comprobaciones realizadas:

- `npm run lint`: correcto.
- `npm run build`: correcto, con el aviso conocido de presupuesto en `lobby.scss`.
- `npm run format:check`: correcto después de aplicar Prettier.
- Revisión en Chrome de inicio, acceso y menú autenticado: las pantallas cargan y mantienen el estilo acordado.
- `npm test -- --watch=false`: Vitest compiló, pero no ejecutó pruebas porque agotó el tiempo al iniciar el worker.

Pendiente:

- Recorrer Perfil, Crear sala y el popup con teclado en un navegador real.
- Probar la adaptación en un dispositivo móvil.
- Reducir `lobby.scss`, que supera el presupuesto de aviso sin alcanzar el límite de error.

## **Personaje 3D del 25 de octubre de 2026**

Reemplazamos la oscilación corta y la imagen plana por una vuelta de 360 grados compuesta por ocho renders 3D del mismo personaje. La vista previa incluye frente, vistas en tres cuartos, ambos perfiles y espalda. También conserva una plataforma fija y una sombra que cambia durante el giro.

Comprobaciones realizadas:

- Revisión en Chrome del frente, perfil derecho, espalda y perfil izquierdo.
- En ambos perfiles el personaje conserva volumen, proporciones y materiales, y no desaparece.
- La espalda es un render propio y no una copia plana oscurecida.
- La plataforma y la sombra permanecen debajo del personaje durante toda la vuelta.
- Con movimiento reducido, el personaje queda fijo y la sombra deja de animarse.

## **Referencia visual y selector de color del 25 de octubre de 2026**

Usamos la ilustración entregada en `public` como referencia para producir la hoja transparente de ocho vistas. La vista previa conserva el giro completo y mantiene la plataforma y la sombra. El color elegido se aplica sobre la zona del traje sin modificar la cara ni la bomba.

El selector muestra únicamente muestras circulares de azul, violeta y coral. Eliminamos los iconos pequeños de personaje y conservamos el nombre, el foco y el borde de selección.

Comprobaciones realizadas:

- Revisión en Chrome del personaje frontal con la opción coral seleccionada.
- Revisión en Chrome de los perfiles derecho e izquierdo durante el giro.
- Revisión en Chrome de la vista posterior completa.
- Confirmación visual de la plataforma, la sombra y las tres muestras de color.
