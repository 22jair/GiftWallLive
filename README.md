# GiftWallLive

GiftWallLive será una página web visual para usar como contenido principal de un TikTok LIVE. Representará los regalos de los espectadores en una cinta digital animada y mostrará los tres envíos de regalos más valiosos del LIVE.

## Estado

Prototipo local con un recibo animado que mezcla regalos y nuevos seguidores simulados. Incluye un puente experimental opcional que lee un LIVE público y publica eventos normalizados por WebSocket.

## Ejecución local

Abre `index.html` directamente en un navegador moderno: ahora es la galería para elegir diseño. Usa **Try the demo** para datos simulados o **Open LIVE printer** para la fuente de transmisión. No requiere instalaciones ni servidor para explorar los diseños.

Para probar eventos reales, instala e inicia el puente desde `server/`:

```bash
npm install
npm start -- nombre_del_creador
```

El estado queda disponible en `http://127.0.0.1:8081/health` y los eventos en `ws://127.0.0.1:8081/live`.

Cada printer abre el modo LIVE por defecto y permanece vacío hasta recibir actividad real:

- Default: `designs/default/index.html`
- Halloween: `designs/halloween/index.html`

Añade `?source=dummy` a cualquiera para ejecutar el loop de demostración. El modo LIVE nunca mezcla ni sustituye eventos reales con datos simulados. Los enlaces antiguos a `index.html?source=dummy` o `index.html?source=live` redirigen a Default conservando los parámetros. El enlace raíz sin parámetros ahora muestra la galería; si lo usabas en LIVE Studio, sustitúyelo por la ruta directa de Default.

## Estructura

```text
GiftWallLive/
├── index.html
├── designs/
│   ├── README.md
│   ├── default/
│   │   └── index.html
│   └── halloween/
│       ├── index.html
│       ├── components.js
│       └── theme.css
├── css/
│   ├── gallery.css
│   ├── base.css
│   ├── gift-showcase.css
│   ├── printer-components.css
│   ├── printer.css
│   └── top-three.css
├── js/
│   ├── gallery.js
│   ├── printer-shell.js
│   ├── app.js
│   ├── data.js
│   ├── feed.js
│   ├── gift-tiers.js
│   ├── live-events.js
│   ├── printer-components.js
│   └── top-three.js
├── prototypes/
│   └── printer/
│       └── printer-components.html
├── server/
│   ├── domain/
│   │   └── live-event.js
│   ├── mappers/
│   │   └── piratetok-mapper.js
│   ├── providers/
│   │   └── piratetok-provider.js
│   ├── live-bridge.js
│   └── package.json
├── tests/
│   └── legacy-effects/
├── AGENTS.md
├── README.md
├── .gitignore
├── .agents/
│   └── skills/
│       ├── frontend-design/
│       │   ├── SKILL.md
│       │   └── LICENSE.txt
│       └── giftwall-design/
│           └── SKILL.md
└── assets/
    ├── images/
    └── sounds/
```

### Aplicación principal

`index.html` es únicamente el selector. Cada página en `designs/` carga el mismo escenario de `js/printer-shell.js` y el motor común de `js/`. Los estilos existentes de `css/` conservan Default; Halloween añade su renderer y estilos sin copiar datos, rangos, ranking, WebSocket ni animación de avance.

Halloween incluye diez variantes (seguidor y nueve tiers), monedas redondas, podio de retratos arqueados y una prensa de hierro violeta y cobre. Sus ilustraciones SVG se dibujan en `components.js`; no necesita imágenes externas ni fuentes descargadas. Véase `designs/README.md` para añadir otro diseño.

### Prototipos visuales

La carpeta `prototypes/` contiene páginas independientes para definir y aprobar partes de la interfaz antes de incorporarlas a la aplicación principal. Se pueden abrir directamente en el navegador y no necesitan un servidor local.

- [`printer/printer-components.html`](prototypes/printer/printer-components.html): laboratorio para diseñar cada componente del printer por separado antes de reutilizarlo en el loop principal.

El catálogo se concentra únicamente en la estructura y presentación visual de cada componente. No asigna rangos de puntos, porque esa decisión pertenece a la lógica de la aplicación.

### Diseños conservados

La versión visual experimental anterior se conserva en `tests/legacy-effects/` para poder recuperar sus efectos en el futuro. No forma parte del diseño principal actual.

### Puente de eventos

La carpeta `server/` contiene la integración experimental con proveedores de LIVE:

- `providers/` recibe los eventos originales de cada proveedor.
- `mappers/` convierte esos datos al contrato común de GiftWallLive.
- `domain/live-event.js` define la forma estable que recibe el frontend.
- `live-bridge.js` publica estados y eventos normalizados en `/live`.
- `js/live-events.js` consume ese contrato y reintenta la conexión automáticamente.

El printer no debe depender del formato particular de PirateTok. Un proveedor futuro, como TikFinity, tendrá su propio provider y mapper, pero emitirá el mismo contrato.

### Instrucciones para IA

`AGENTS.md` contiene las instrucciones permanentes para trabajar con asistentes de IA dentro de este repositorio.

La skill externa `frontend-design` guía la dirección artística y la implementación de interfaces distintivas. La skill local `giftwall-design` añade los criterios propios de GiftWallLive. Las decisiones generales del proyecto permanecen en `AGENTS.md`.

## Principios

- Una sola página web vertical.
- Lienzo maestro 9:16 con salida objetivo en 720 × 1280 y 1080 × 1920.
- Una única composición móvil de referencia de 464 px de ancho. El tamaño raíz se calcula como ancho del escenario / 29; tarjetas, avatares, texto, bordes y efectos usan `rem` para crecer juntos. No se amplía una captura ni se usa zoom de la fuente.
- En ventanas anchas se centra el escenario 9:16 y el sobrante se rellena con fondo. En móviles más altos se utiliza todo el ancho y la altura disponible. No hay una variante de escritorio ni un límite aislado de 360/720 px para el printer.
- Tres columnas alineadas bajo la zona segura: niveles compactos a la izquierda, printer prioritario en el centro y Top 3 apilado a la derecha. Las columnas laterales miden 3.6 y 5.25 rem; el printer recibe el espacio restante.
- Zona segura superior adaptable para barras de estado, notch y Dynamic Island en móviles.
- HTML, CSS y JavaScript nativos.
- Datos y regalos simulados durante la primera versión.
- Sin frameworks de interfaz, base de datos ni autenticación mientras no sean necesarios.

### Fuente Enlace en LIVE Studio

Copia la URL directa de un printer en `designs/`, no la dirección de la galería.

Usa una resolución de fuente de **1080 × 1920** para un lienzo vertical de la misma proporción. Para pruebas simuladas añade `?source=dummy` a la URL. El navegador dibuja los componentes a esa resolución: las medidas son 1.5 veces las de 720 × 1280, conservando su proporción. No compenses el diseño cambiando solo el ancho a 400 px ni estirando los ejes por separado.

La previsualización de LIVE Studio puede mostrar la fuente reducida. Esa reducción no cambia la composición interna. Recarga la fuente después de publicar cambios; la validación en LIVE Studio se realiza sobre la versión publicada, no sobre los archivos locales sin publicar.

## Componentes actuales

- Top Gifts compacto con foto, usuario, cantidad, icono y valor total; oro, platino y cobre distinguen visualmente cada posición. Las tres posiciones permanecen visibles con valor `0` hasta recibir regalos reales.
- Dirección visual experimental de prensa de coleccionista: acero oscuro, salida térmica iluminada y papel perlado; Top Gifts con placas de oro, platino y cobre.
- Niveles identificados por número, color y rango exacto de monedas; el nombre completo se conserva para accesibilidad. El Top 3 vertical libera altura para el recibo.
- Carcasa térmica con tapa elevada, rejillas, pantalla de estado, control decorativo, rodillo y borde de corte. Los diseños y animaciones de las cards permanecen independientes de la carcasa.
- Recibo continuo que calcula automáticamente cuántos registros necesita para llenar la altura disponible.
- Registro de regalo con avatar, nombre, agradecimiento, cantidad e icono del regalo.
- Registro de seguidor a media altura, sin fotografía.
- Catálogo visual con nueve niveles de regalo: Basic, Featured, Stellar, Epic, Legendary, Mythic, Celestial, Primordial y Cosmic.
- Loop de impresión con datos simulados que recorre New Follower y los nueve componentes visuales.
- `js/printer-components.js`: genera el HTML de cada componente reutilizable del printer.
- `css/printer-components.css`: contiene su presentación, jerarquía visual y animaciones.
- La carcasa del printer y el escenario se dibujan con CSS. La colección progresa desde tinta monocroma hasta acabados iridiscentes, oro, cristal, luz solar, mineral y espacio profundo. Se respeta `prefers-reduced-motion`.
- `assets/images/printer-frame-obsidian.png`: marco de la versión anterior conservado como recurso; no se muestra en la propuesta visual actual.
- `assets/images/printer-frame.png`: versión arcade anterior conservada como referencia visual.
- `assets/images/obsidian-gallery-bg.png`: fondo de la galería anterior conservado como recurso.

En los datos simulados, `gift.points` representa el valor unitario del regalo. El aporte total de cada envío se calcula como `gift.points × gift.amount`; por ejemplo, veinte regalos de 1 punto producen un envío de 20 puntos.

## Rangos de regalos

`js/gift-tiers.js` es la fuente única para clasificar regalos y generar los rangos visibles en `Gift collection`. La clasificación utiliza el aporte total de la acción (`valor unitario × cantidad`), por lo que enviar varias unidades sí puede elevar el componente visual. Un regalo de 1 punto enviado 20 veces utiliza Featured.

| Evento o tier | Aporte total de la acción |
| --- | ---: |
| New Follow | Sin monedas |
| Basic | 1–10 |
| Featured | 11–29 |
| Stellar | 30–50 |
| Epic | 51–100 |
| Legendary | 101–350 |
| Mythic | 351–499 |
| Celestial | 500–1,500 |
| Primordial | 1,501–4,800 |
| Cosmic | 4,801 o más |

Los datos dummy de `js/data.js` solo declaran los puntos y la cantidad. La aplicación obtiene automáticamente el `tier` desde esta configuración antes de imprimir cada evento.
