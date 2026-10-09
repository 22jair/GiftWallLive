# GiftWallLive

GiftWallLive será una página web visual para usar como contenido principal de un TikTok LIVE. Representará los regalos de los espectadores en una cinta digital animada y mostrará los tres envíos de regalos más valiosos del LIVE.

## Estado

Prototipo local con un recibo animado que mezcla regalos y nuevos seguidores simulados. La conexión real con TikTok todavía no forma parte del alcance.

## Ejecución local

Abre `index.html` directamente en un navegador moderno. No se requieren instalaciones, dependencias ni servidor local.

## Estructura

```text
GiftWallLive/
├── index.html
├── css/
│   ├── base.css
│   ├── gift-showcase.css
│   ├── printer-components.css
│   ├── printer.css
│   └── top-three.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── feed.js
│   ├── gift-tiers.js
│   ├── printer-components.js
│   └── top-three.js
├── prototypes/
│   └── printer/
│       └── printer-components.html
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

`index.html`, `css/`, `js/` y `assets/` forman la experiencia que se mostrará durante el LIVE.

### Prototipos visuales

La carpeta `prototypes/` contiene páginas independientes para definir y aprobar partes de la interfaz antes de incorporarlas a la aplicación principal. Se pueden abrir directamente en el navegador y no necesitan un servidor local.

- [`printer/printer-components.html`](prototypes/printer/printer-components.html): laboratorio para diseñar cada componente del printer por separado antes de reutilizarlo en el loop principal.

El catálogo se concentra únicamente en la estructura y presentación visual de cada componente. No asigna rangos de puntos, porque esa decisión pertenece a la lógica de la aplicación.

### Diseños conservados

La versión visual experimental anterior se conserva en `tests/legacy-effects/` para poder recuperar sus efectos en el futuro. No forma parte del diseño principal actual.

### Instrucciones para IA

`AGENTS.md` contiene las instrucciones permanentes para trabajar con asistentes de IA dentro de este repositorio.

La skill externa `frontend-design` guía la dirección artística y la implementación de interfaces distintivas. La skill local `giftwall-design` añade los criterios propios de GiftWallLive. Las decisiones generales del proyecto permanecen en `AGENTS.md`.

## Principios

- Una sola página web vertical.
- Zona segura superior adaptable para barras de estado, notch y Dynamic Island en móviles.
- HTML, CSS y JavaScript nativos.
- Datos y regalos simulados durante la primera versión.
- Sin frameworks, backend, base de datos ni autenticación mientras no sean necesarios.

## Componentes actuales

- Top Gifts compacto con foto, usuario, cantidad, icono y valor total; oro, platino y cobre distinguen visualmente cada posición.
- Escenario premium de obsidiana con Top Gifts a todo el ancho.
- Zona inferior dividida entre una colección de tiers y el printer en vivo; en pantallas estrechas, los tiers usan una cinta horizontal deslizable que centra el nivel del último evento.
- Recibo continuo que calcula automáticamente cuántos registros necesita para llenar la altura disponible.
- Registro de regalo con avatar, nombre, agradecimiento, cantidad e icono del regalo.
- Registro de seguidor a media altura, sin fotografía.
- Catálogo visual con nueve niveles de regalo: Basic, Featured, Stellar, Epic, Legendary, Mythic, Celestial, Primordial y Cosmic.
- Loop de impresión con datos simulados que recorre New Follower y los nueve componentes visuales.
- `js/printer-components.js`: genera el HTML de cada componente reutilizable del printer.
- `css/printer-components.css`: contiene su presentación, jerarquía visual y animaciones.
- `assets/images/printer-frame-obsidian.png`: marco transparente activo del printer, construido con obsidiana, acero, detalles champaña y luz cian; el papel continúa siendo HTML dinámico.
- `assets/images/printer-frame.png`: versión arcade anterior conservada como referencia visual.
- `assets/images/obsidian-gallery-bg.png`: fondo vertical de la galería premium que organiza visualmente el Top 3, la colección de tiers y la bahía del printer.

En los datos simulados, `gift.points` representa el valor unitario del regalo. El valor mostrado y sumado para cada envío se calcula como `gift.points × gift.amount`; por ejemplo, dos regalos de 30,000 puntos producen un envío de 60,000 puntos.

## Rangos de regalos

`js/gift-tiers.js` es la fuente única para clasificar regalos y generar los rangos visibles en `Gift collection`. La clasificación utiliza el valor unitario del regalo; enviar varias unidades multiplica el valor mostrado en Top Gifts, pero no cambia el componente visual seleccionado.

| Evento o tier | Valor unitario |
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
