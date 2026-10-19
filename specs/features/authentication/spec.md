# **AUTH-01 · Autenticación**

Estado: aprobado para implementación el 18 de octubre de 2026. Como jugador quiero registrarme e iniciar sesión para acceder a mis partidas.

Requisitos: registro con nombre, correo y contraseña; login; perfil propio; cierre de sesión; rutas protegidas. La UI debe mostrar errores claros, no exponer contraseñas y conservar solo el estado de sesión que se acuerde. Contrato: `RegisterRequest`, `LoginRequest`, `TokenResponse`, `Player` en OpenAPI.

Errores: datos inválidos, correo repetido, credenciales incorrectas, sesión vencida y red no disponible. La primera entrega usa un repositorio local. La sesión local se conserva en `sessionStorage` y no guarda contraseñas. El token de una integración real se mantendrá en memoria y una respuesta 401 cerrará la sesión hasta acordar la renovación con el backend.
