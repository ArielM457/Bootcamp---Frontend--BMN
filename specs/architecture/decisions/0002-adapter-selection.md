# **ADR 0002: adaptadores reales por configuración**

Estado: implementado. Fecha de actualización: 9 de noviembre de 2026.

## **Contexto**

La aplicación usaba repositorios mock y un simulador local. El backend ya ofrece autenticación, parte de las salas y movimiento en tiempo real.

## **Decisión**

`app.config.ts` registra directamente `HttpAuthRepository`, `HttpRoomRepository` y `SignalRGameAdapter`. Los componentes conservan las facades y no conocen HTTP, SignalR ni almacenamiento.

Las URLs se leen desde `.env`. Un script genera `public/runtime-config.js` antes de ejecutar, probar o compilar la aplicación. El archivo generado no se publica en Git.

No se registra `ScoreRepository` porque el backend no ofrece resultados ni ranking. De igual forma no existen proveedores alternativos ni un modo demo.

## **Consecuencias**

- La aplicación necesita el backend para registro, login, salas y partida.
- Las funciones sin endpoint permanecen deshabilitadas o muestran que el backend todavía no las ofrece.
- Los mocks y el simulador local fueron eliminados.
