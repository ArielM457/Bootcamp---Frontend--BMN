# **Arquitectura del frontend**

`src/app/core` contiene configuración, guards, interceptores y servicios comunes. `features` reúne pantallas y facades por función. `shared` contiene modelos y componentes sin reglas de una función. `infrastructure` contiene API, simulaciones, SignalR y almacenamiento. `src/styles` contiene tokens de diseño.

Cada facade depende de interfaces de repositorio. Los componentes solo invocan facades y leen Signals. Ningún componente llama a `HttpClient`, SignalR o almacenamiento. Elegimos la implementación mock o real desde configuración al iniciar la aplicación. Las interfaces se definirán junto con cada función aprobada, para evitar métodos sin uso.

Las rutas de funciones se cargarán de forma diferida. El shell solo expone inicio y una ruta informativa en esta entrega. Angular Material se reserva para formularios y diálogos. El tablero futuro usa Canvas 2D y recibe un `GameSnapshot` tipado; el renderer no calcula reglas, persiste datos ni se comunica por red.

No incorporamos NgRx: Signals y facades cubren el estado previsto con menos conceptos para el bootcamp. Revisaremos la decisión si aparecen flujos que no podamos mantener de forma clara.
