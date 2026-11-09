# **Diseño AUTH-01**

`HttpAuthRepository` usa `POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/me`. `AuthFacade` expone la sesión y el estado de carga mediante Signals. El guard protege las rutas privadas.

El JWT se conserva en `AuthSessionStore` y se envía únicamente a las operaciones reales del backend. SignalR obtiene el mismo token mediante `accessTokenFactory`. Las contraseñas no se guardan ni se registran en logs.

El backend no ofrece consulta ni actualización del perfil completo. El formulario permanece deshabilitado y no guarda datos locales.
