# **Decisiones para iniciar la Fase 1**

Estado: aprobado por el usuario el 18 de octubre de 2026 al solicitar continuar con las siguientes partes. La interfaz no debe mostrar nombres de fases, CodeSprint ni estados técnicos. Solo debe mostrar información útil para el jugador.

## **Decisiones aprobadas**

**1. Primera entrega funcional.** Implementamos primero el modo demostración con un adaptador mock. El registro, el login, la sesión y el cierre deben funcionar sin backend. Después conectamos el adaptador HTTP cuando el contrato esté validado.

**2. Registro.** Pedimos nombre visible, correo y contraseña. La contraseña debe tener al menos ocho caracteres. No exigimos combinaciones difíciles de recordar en esta primera entrega.

**3. Sesión de demostración.** Guardamos la sesión mock en `sessionStorage`. Al cerrar la pestaña se elimina. La interfaz debe indicar que es una sesión de demostración.

**4. Sesión real.** Mantenemos el token de acceso en memoria. Proponemos que el backend renueve la sesión mediante una cookie segura y no accesible desde JavaScript. Si el backend no admite renovación, una respuesta 401 cierra la sesión y devuelve al login.

**5. Navegación.** Después de entrar mostramos un menú con perfil, salas, ranking y cerrar sesión. Salas y ranking pueden seguir mostrando Próximamente hasta que se aprueben sus fases.

La implementación debe conservar el aspecto limpio de la bienvenida y no presentar datos simulados como información de un servidor real.
