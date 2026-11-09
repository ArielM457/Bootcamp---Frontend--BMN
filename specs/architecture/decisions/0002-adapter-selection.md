# **ADR 0002: selección de adaptadores por configuración**

Estado: aprobado. Fecha: 22 de octubre de 2026.

## **Contexto**

`app.config.ts` registraba los adaptadores simulados de forma fija. Para conectar el backend necesitamos elegir la implementación sin cambiar componentes ni facades.

## **Decisión**

El modo de la aplicación vive en los environments de Angular. `src/environments/environment.ts` usa `demo` y `src/environments/environment.api.ts` usa `api`. La configuración `api` de `angular.json` cambia un archivo por el otro con `fileReplacements`.

El tipo `AppMode` (`'demo' | 'api'`) y la interfaz `AppEnvironment` viven en `src/app/core/config/`. Core no importa nada de `infrastructure/`.

`app.config.ts` llama a `provideDataAdapters(environment.mode)`. Esa función registra `AUTH_REPOSITORY`, `ROOM_REPOSITORY`, `GAME_PORT` y `SCORE_REPOSITORY`. `AUTH_SESSION_STORE` y `provideHttpClient` son comunes a los dos modos.

Mientras no existan adaptadores reales, el modo `api` lanza un error al construir la configuración:

> Modo 'api' no disponible: faltan los adaptadores HTTP y SignalR reales. Usa el modo 'demo' o implementa los adaptadores en src/app/infrastructure/api y src/app/infrastructure/realtime (ADR 0002).

La aplicación no arranca con mocks escondidos.

## **Consecuencias**

`ng serve` y `ng build` siguen en `demo`. El modo api se pide de forma explícita: `ng serve --configuration api` o `ng build --configuration production,api`. Cuando existan los adaptadores reales, solo cambia la rama `api` de `provideDataAdapters`.

## **Fuera de alcance**

- Adaptadores HTTP y SignalR.
- URL del backend.
- Interceptor de autenticación.
