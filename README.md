# GiftWallLive

GiftWallLive será una página web visual para usar como contenido principal de un TikTok LIVE. Representará los regalos de los espectadores en una cinta digital animada y mostrará un Top 3 según el aporte acumulado.

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
│   ├── printer.css
│   └── top-three.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── feed.js
│   └── top-three.js
├── prototypes/
│   └── printer/
│       ├── printer-components.html
│       └── printer-types.html
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

- [`printer/printer-types.html`](prototypes/printer/printer-types.html): compara la altura y el tamaño de imagen asignados a cada nivel de impresión.
- [`printer/printer-components.html`](prototypes/printer/printer-components.html): laboratorio para diseñar cada componente del printer por separado antes de reutilizarlo en el loop principal.

### Diseños conservados

La versión visual experimental anterior se conserva en `tests/legacy-effects/` para poder recuperar sus efectos en el futuro. No forma parte del diseño principal actual.

### Instrucciones para IA

`AGENTS.md` contiene las instrucciones permanentes para trabajar con asistentes de IA dentro de este repositorio.

La skill externa `frontend-design` guía la dirección artística y la implementación de interfaces distintivas. La skill local `giftwall-design` añade los criterios propios de GiftWallLive. Las decisiones generales del proyecto permanecen en `AGENTS.md`.

## Principios

- Una sola página web vertical.
- HTML, CSS y JavaScript nativos.
- Datos y regalos simulados durante la primera versión.
- Sin frameworks, backend, base de datos ni autenticación mientras no sean necesarios.

## Componentes actuales

- Top 3 compacto que solo se actualiza cuando cambia un aporte.
- Recibo continuo que calcula automáticamente cuántos registros necesita para llenar la altura disponible.
- Registro de regalo con avatar, nombre, regalo, cantidad y aporte acumulado.
- Registro de seguidor a media altura, sin fotografía.
- Siete niveles de regalo simulados, desde impresión normal hasta impresión máxima, con exposición proporcional a sus puntos.
- Loop de impresión con datos simulados.
- `assets/images/printer-frame.png`: marco transparente de la impresora; el contenido del papel continúa siendo HTML dinámico.

## Escala inicial de puntos

La altura de cada impresión representa la importancia de la acción. Estos valores son la base de prueba y podrán ajustarse después de validar la integración real con TikTok.

| Acción o nivel | Rango | Altura base |
| --- | ---: | ---: |
| Nuevo seguidor | Sin puntos | 40 px |
| Regalo básico | 1–30 puntos | 80 px |
| Regalo destacado | 31–99 puntos | 80 px |
| Regalo estelar | 100–999 puntos | 160 px |
| Regalo épico | 1,000–2,999 puntos | 200 px |
| Regalo legendario | 3,000–4,999 puntos | 240 px |
| Regalo mítico | 5,000–9,999 puntos | 240 px |
| Regalo máximo | 10,000 puntos o más | 240 px |

Los seguidores no muestran fotografía. `Regalo básico` y `Regalo destacado` comparten la composición horizontal de 80 px: el básico aplica una capa gris sobre la foto y el destacado conserva sus colores originales. Desde `Regalo estelar`, la imagen se presenta centrada y aumenta progresivamente hasta `Regalo legendario`. Los niveles `Legendario`, `Mítico` y `Máximo` comparten el mismo tamaño base; su jerarquía visual se definirá mediante estilos y animaciones.
