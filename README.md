# GiftWallLive

GiftWallLive será una página web visual para usar como contenido principal de un TikTok LIVE. Representará los regalos de los espectadores en una cinta digital animada y mostrará un Top 3 según el aporte acumulado.

## Estado

Estructura inicial del proyecto. La conexión real con TikTok todavía no forma parte del alcance; la primera versión utilizará datos simulados.

## Ejecución local

Abre `index.html` directamente en un navegador moderno. No se requieren instalaciones, dependencias ni servidor local.

## Estructura

```text
GiftWallLive/
├── index.html
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

`AGENTS.md` contiene las instrucciones permanentes para trabajar con asistentes de IA dentro de este repositorio.

La skill externa `frontend-design` guía la dirección artística y la implementación de interfaces distintivas. La skill local `giftwall-design` añade los criterios propios de GiftWallLive. Las decisiones generales del proyecto permanecen en `AGENTS.md`.

## Principios

- Una sola página web vertical.
- HTML, CSS y JavaScript nativos.
- Datos y regalos simulados durante la primera versión.
- Sin frameworks, backend, base de datos ni autenticación mientras no sean necesarios.
