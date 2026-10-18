# **Diseño AUTH-01**

Pantallas de registro y login con Angular Material. `AuthFacade` expone sesión y estado de carga mediante Signals. `AuthRepository` tendrá adaptadores mock y HTTP. Un guard lee la facade; un interceptor añade el token solo a la API acordada. Las contraseñas no se registran en logs. El modo demostración identifica claramente que la sesión es local.
