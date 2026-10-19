# **Diseño AUTH-01**

Pantallas standalone de registro y login con formularios reactivos y controles accesibles adaptados al estilo visual del juego. `AuthFacade` expone sesión y estado de carga mediante Signals. `AuthRepository` tiene un adaptador local y tendrá un adaptador HTTP cuando el backend esté validado. Un guard lee la facade. Un interceptor añadirá el token solo a la API acordada. Las contraseñas no se guardan ni se registran en logs. La interfaz informa que los datos se guardan solo en el navegador.
