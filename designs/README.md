# Diseños de printer

Cada carpeta contiene una entrada independiente que se abre directamente o se usa como fuente Enlace en LIVE Studio. No hay compilación ni dependencias nuevas.

| Diseño | Entrada | Vista simulada |
| --- | --- | --- |
| Default | `default/index.html` | `default/index.html?source=dummy` |
| Halloween | `halloween/index.html` | `halloween/index.html?source=dummy` |

## Qué se comparte

- `../js/printer-shell.js`: única estructura de tres columnas y carcasa.
- `../js/data.js`: mismos datos dummy para todos.
- `../js/gift-tiers.js`: clasificación y rangos, nunca duplicarlos por diseño.
- `../js/top-three.js`: ranking y contenido del podio.
- `../js/printer-components.js`: renderer Default y helpers de avatar, texto y regalo.
- `../js/feed.js`: inserción, animación de avance y recorte del recibo.
- `../js/live-events.js` y `../js/app.js`: conexión y ejecución.
- `../css/`: escala proporcional, layout y apariencia original. Halloween extiende estos estilos; Default no carga ningún recurso de Halloween.

## Qué puede cambiar un diseño

Un `theme.css` modifica fondo, carcasa, podio y niveles. Un `components.js` opcional define `window.GWLTheme = { title, render }` antes de cargar la estructura y la aplicación.

`render(event, helpers)` devuelve un solo elemento raíz `article.receipt-item` por evento. Recibe el evento ya clasificado; no cambia puntos, cantidad, persona o nivel. Los helpers `escapeText`, `avatar` y `message` reutilizan los formatos compartidos. Escapa siempre el contenido externo que agregues al HTML.

Las medidas utilizan `rem` para conservar la misma escala entre móvil, 720 × 1280 y 1080 × 1920. Mantén la clase de impresión, altura estable, recorte interno, zona segura superior y soporte de movimiento reducido.

## Añadir otro

1. Crea una carpeta con un `index.html` basado en la entrada de Halloween.
2. Carga primero los estilos comunes y después el CSS del diseño.
3. Carga la configuración visual antes de `printer-shell.js`; deja `app.js` al final. Todos los scripts usan `defer`.
4. Añade los dos enlaces (demo y LIVE) a la galería raíz.
5. Prueba seguidor, los nueve niveles, nombres largos, imágenes reales, LIVE vacío y escala 720/1080. No copies el motor ni los datos.

Halloween combina fondos originales WebP en `assets/images/halloween/` con capas CSS/SVG. La documentación de esos recursos contiene los prompts de generación. Los regalos y avatares reales no se sustituyen por adornos del tema.

## Colección Halloween

El [catálogo interactivo](halloween/preview.html) permite comparar y repetir entradas sin arrancar la conexión LIVE. Reutiliza `js/data.js` y `js/gift-tiers.js`; no agrega eventos al printer.

| Nivel | Escena | Acción y material |
| --- | --- | --- |
| Follow | Aparición breve | Fantasma discreto y nombre |
| Basic | A little spark | Retrato pequeño y vela |
| Featured | Sealed in wax | Nota con sello de cera granate |
| Stellar | The looking glass | Espejo plateado y reflejo |
| Epic | Nightfall | Murciélago cavernario y enjambre en primer plano |
| Legendary | The gilded curse | Calavera coronada, impacto y fragmentos dorados |
| Mythic | Soul keeper | Espectro de plata, niebla y almas ascendentes |
| Celestial | Crimson reign | Colmillos, gotas brillantes y ondulación |
| Primordial | Night rider | Vehículo original de carbono, llegada y haces de luz |
| Cosmic | Sovereign of the eclipse | Puertas que se abren, catedral, eclipse y fragmentos orbitales |

Las dimensiones son las mismas que Default: Follow 2.5rem, Basic/Featured 5rem, Stellar 10rem y Epic–Cosmic 15rem. El lujo aumenta mediante arte y efectos, nunca agrandando las cards. El motor sigue imprimiendo cada evento con sus tiempos originales. No se garantiza un tiempo mínimo exclusivo: una futura cola de celebraciones sería una mejora funcional independiente.

Las entradas de escena comienzan después de los 700 ms de impresión. El listener compartido de `feed.js` solo finaliza al recibir `print-row` del artículo; un `animationend` de las capas decorativas no debe recortar prematuramente el papel. Evita animar el transform del artículo: úsalo únicamente para la impresión y anima hijos para efectos visuales.

Los efectos se recortan dentro de cada card para no tapar identidad ni tarjetas vecinas. Solo las primeras tres cards del feed animan; el catálogo permite pausar todo. Con movimiento reducido se eliminan entradas y partículas, pero siempre se conserva avatar, nombre, cantidad e icono.

## Pruebas de contrato

Ejecuta `node --test tests/design-contract.test.cjs` desde la raíz. Verifica los nueve tiers y seguidores en ambos renderers, escape de texto, conservación de imágenes reales y rutas compartidas. No requiere instalar paquetes. La revisión visual y de animación se hace abriendo las demos en el navegador; LIVE Studio debe probarse con la URL publicada.
