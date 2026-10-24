# **Bomberman Online**

Frontend Angular de Bomberman con funcionamiento local. Incluye bienvenida retro, registro, inicio de sesión, menú, salas, bot inmóvil, partida Canvas, recuperación local, resultados y ranking.

La aplicación usa repositorios y adaptadores locales para funcionar sin backend. Las integraciones HTTP y SignalR todavía están pendientes y no se presentan como servicios reales.

## **Requisitos**

- Node.js 24.12 o una versión compatible con Angular 21.
- npm 11.

## **Ejecución**

```bash
npm ci
npm start
```

Abre `http://localhost:4200`.

## **Validación**

```bash
npm run validate
```

También puedes ejecutar las comprobaciones por separado:

```bash
npm run build
npm test -- --watch=false
npm run lint
npm run format:check
```

## **Estado actual**

Funcionan de forma local:

- Registro, inicio y cierre de sesión.
- Menú protegido.
- Listado, creación y unión a salas.
- Bot inmóvil para iniciar con un jugador humano.
- Tablero, movimiento, bombas, explosiones, vidas y resultado.
- Recuperación simulada del último estado confirmado.
- Puntuación y ranking durante la sesión actual.

Pendiente:

- Persistencia real de cuentas, salas y puntuaciones.
- API HTTP y hub SignalR confirmados por el backend.
- Partidas compartidas entre navegadores.
- Validación táctil en un dispositivo real.

## Cambios
- Rediseño de la pantalla de bienvenida según referencia visual (specs/features/welcome)
- Selección de adaptadores mock/api por configuración (ADR 0002)
- Revisión de accesibilidad en todas las pantallas (specs/features/quality)

## Validación
npm run validate en verde.

## **Documentación**

Lee [specs/README.md](specs/README.md) para conocer las funciones y su estado. La guía para conectar el backend está en [specs/integration/backend-guide.md](specs/integration/backend-guide.md).
