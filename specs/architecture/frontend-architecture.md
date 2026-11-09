# **Arquitectura del frontend**

`src/app/core` contiene configuración, guards, puertos y servicios comunes. `features` reúne pantallas y facades por función. `shared` contiene componentes sin reglas de una función. `infrastructure` contiene los adaptadores HTTP, SignalR y el almacenamiento de sesión. `src/styles` contiene tokens de diseño.

Cada facade depende de interfaces de repositorio o puertos. Los componentes solo invocan facades y leen Signals. Ningún componente llama directamente a `HttpClient`, SignalR o almacenamiento. La configuración registra únicamente los adaptadores reales. Las interfaces contienen solo operaciones respaldadas por el contrato actual.

Las rutas de funciones se cargan de forma diferida. El tablero usa Canvas 2D y recibe un `GameSnapshot` tipado; el renderer no calcula reglas, persiste datos ni se comunica por red.

No incorporamos NgRx: Signals y facades cubren el estado previsto con menos conceptos para el bootcamp. Revisaremos la decisión si aparecen flujos que no podamos mantener de forma clara.
