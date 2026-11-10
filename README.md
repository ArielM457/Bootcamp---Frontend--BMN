# **Bomberman Online**

Frontend Angular de Bomberman conectado al backend del bootcamp. Incluye bienvenida, registro, inicio de sesión, menú, salas y movimiento en tiempo real sobre Canvas.

La aplicación usa adaptadores HTTP y SignalR. Los mocks y el simulador local fueron eliminados.

## **Requisitos**

- Node.js 24.12 o una versión compatible con Angular 21.
- npm 11.

## **Ejecución**

```bash
npm ci
copy .env.example .env
npm start
```

Abre `http://localhost:4200`.

El archivo `.env` define `BOMBERMAN_API_URL` y `BOMBERMAN_HUB_URL`. `npm start`, `npm test` y `npm run build` generan la configuración pública antes de iniciar Angular.

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

Con el backend ejecutándose, prueba JWT, dos jugadores en una sala, aislamiento entre salas y rechazo de movimientos inválidos:

```bash
npm run verify:backend
```

## **Estado actual**

Conectado al backend:

- Registro, inicio y cierre de sesión.
- Menú protegido.
- Listado, creación y unión a salas.
- Inicio de partida.
- Conexión SignalR, mapa y movimiento confirmado por el servidor.

Pendiente:

- Perfil editable, anfitrión, bots, salida y configuración de sala.
- Aviso de inicio y `gameId` para los demás participantes.
- Bombas, explosiones, final de partida, puntuaciones y ranking.
- Validación táctil en un dispositivo real.

## Cambios

- Rediseño de la pantalla de bienvenida según referencia visual (specs/features/welcome)
- Adaptadores HTTP y SignalR reales por configuración (ADR 0002)
- Revisión de accesibilidad en todas las pantallas (specs/features/quality)

## **Documentación**

Lee [specs/README.md](specs/README.md) para conocer las funciones y su estado. La guía para conectar el backend está en [specs/integration/backend-guide.md](specs/integration/backend-guide.md).
