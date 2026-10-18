# **AUTH-01 · Autenticación**

Estado: propuesta sin aprobar. Como jugador quiero registrarme e iniciar sesión para acceder a mis partidas.

Requisitos: registro con nombre, correo y contraseña; login; perfil propio; cierre de sesión; rutas protegidas. La UI debe mostrar errores claros, no exponer contraseñas y conservar solo el estado de sesión que se acuerde. Contrato: `RegisterRequest`, `LoginRequest`, `TokenResponse`, `Player` en OpenAPI.

Errores: datos inválidos, correo repetido, credenciales incorrectas, sesión vencida y red no disponible. Depende de la Fase 0 y del contrato backend aprobado. No está decidido el almacenamiento de JWT ni el refresco de sesión.
