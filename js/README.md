# JavaScript

El código está separado por responsabilidad para que sea fácil encontrar cada parte sin cambiar el flujo de la aplicación:

- `core/`: datos dummy compartidos y clasificación de niveles (`data.js`, `gift-tiers.js`).
- `live/`: conexión con el bridge/WebSocket y normalización de eventos LIVE.
- `printer/`: estructura y comportamiento del printer, feed, componentes y arranque de la escena.
- `ui/`: piezas de presentación que no pertenecen al motor del printer, como Top 3, galería y previews.

Los diseños pueden aportar un renderer propio en `designs/<tema>/components.js`, pero reutilizan los datos y el motor común.
