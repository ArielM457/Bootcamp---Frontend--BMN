# **Diseño HOME-01**

La ruta de inicio mantiene la carga diferida del componente standalone `Welcome`. El shell global se reduce al área de rutas para que la bienvenida controle toda la ventana.

La composición usa dos zonas. La zona izquierda presenta un título grande y un menú vertical sobre un patrón de cuadros medianos. Los botones tienen forma redondeada, fondo morado oscuro y texto blanco para mantener el contraste. El degradado central ocupa una zona amplia. La zona derecha contiene una escena decorativa más pequeña con tablero, personaje, bombas y explosiones animadas con CSS.

Los enlaces usan rutas reales y foco visible. En pantallas pequeñas, las zonas se apilan y conservan el orden del menú antes de la escena. Si el sistema pide reducir movimiento, las animaciones se detienen.

No se añaden servicios, adaptadores ni estado de juego. La pantalla de Próximamente recibe el nombre y la fase mediante parámetros de consulta para explicar el estado real de cada acceso.
