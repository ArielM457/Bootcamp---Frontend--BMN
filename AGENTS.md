# **Reglas del repositorio**

Seguimos `Requirements → Specification → Design → Tasks → Implementation → Validation`. `specs/` es la fuente de verdad. Las especificaciones actuales son propuestas y requieren aprobación antes de implementar cada función.

Usa TypeScript estricto, componentes standalone y Signals para estado local. Los componentes no llaman a `HttpClient` ni a SignalR. Los adaptadores viven en `infrastructure/` y se conectan mediante interfaces. El servidor confirma el estado multijugador.

En la primera entrega solo está autorizado el shell y la bienvenida. No desarrolles Fase 1 sin aprobación explícita.

Las skills locales están en `.agents/skills/` y se ignoran en Git. Usa la que corresponda al trabajo: `spec-driven-development` al planificar, `angular-architecture` al cambiar estructura, `api-contract-design` al cambiar contratos, `mock-driven-development` al crear simulaciones, `bomberman-game-engine` al trabajar en Canvas, `frontend-testing` al probar, `codesprint-ui-design` al diseñar UI y `documentation-maintenance` al cerrar cambios. Si no están disponibles en otro clon, sigue directamente `specs/`.

Para prosa en español, aplica `C:/Users/ariel/.codex/skills/escritura-simple-ariel/SKILL.md` si está disponible. No cambies formatos técnicos por estilo.
