# **ADR 0001: límites iniciales**

Estado: propuesto. Fecha: 14 de octubre de 2026.

## **Decisión**

Usamos Angular 21 porque Node 24.12 del entorno cumple su rango de compatibilidad. Angular 22 pide Node 24.15 o superior. Usamos componentes standalone, Signals, rutas diferidas y Vitest. El estado compartido real llega del backend; el modo demostración tendrá adaptadores propios. Dejamos las interfaces concretas para cada función aprobada.

## **Consecuencias**

El shell inicial no ofrece login ni partida. Los documentos pueden revisarse sin rehacer pantallas. Material y SignalR están instalados para próximas fases, pero no hay uso funcional todavía.

## **Dudas para validar**

- Formato final de identificadores y expiración de JWT.
- Tamaño del tablero, reglas de bombas, vidas y empate.
- Capacidad de sala y quién puede iniciar.
- Contrato de reconexión y orden de eventos SignalR.
- Criterio del ranking: puntos, victorias o ambos.
