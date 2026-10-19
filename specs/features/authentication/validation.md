# **Validación AUTH-01**

Fecha: 18 de octubre de 2026.

Estado: flujo local implementado. Integración HTTP y revisión manual en navegador pendientes.

Implementamos registro, login, restauración de sesión, cierre de sesión y protección de rutas. La sesión se guarda en `sessionStorage` y no contiene la contraseña. Las cuentas creadas se mantienen en memoria durante la ejecución.

Comprobaciones realizadas:

- Registro válido crea jugador y sesión.
- La sesión guardada no contiene la contraseña.
- Login válido vuelve a crear la sesión.
- Login incorrecto devuelve un error visible.
- Un correo repetido se rechaza.
- Una sesión vencida se elimina.
- `npm test -- --watch=false`: correcto, 3 archivos y 5 pruebas.
- `npm run build`: correcto.
- `npm run lint`: correcto.
- `npm run format:check`: correcto.

No afirmamos todavía funcionamiento contra una API ni revisión visual en navegador.
