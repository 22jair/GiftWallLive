# K-pop Radio

Experimento independiente de GiftWallLive para una radio K-pop vertical. La base visual usa un fondo espacial reutilizable; las reacciones y el reproductor se dibujan encima para poder conectarlos después a Spotify y TikTok.

## Probar en local

Abre `index.html` directamente o sírvelo con cualquier servidor estático. Para ver las reacciones simuladas:

```text
designs/kpop-radio/index.html?source=dummy
```

Las cards especiales empiezan ocultas. Un evento de **100 monedas** para BTS, BLACKPINK, TWICE o ENHYPEN muestra el arte de ese grupo durante **15 segundos**: entra con un giro, flota suavemente con destellos mientras está visible y luego sale. La card grande siempre se dibuja por encima de las bolitas y del resto del escenario. Un nuevo evento sustituye la card y reinicia la secuencia con el usuario más reciente. El movimiento se simplifica cuando está activo `prefers-reduced-motion`.

El arte de `../../assets/images/kpop-bts-special-card-photo.png` se generó tomando la fotografía de BTS proporcionada por el usuario como referencia principal y la primera card como inspiración visual: siete integrantes, color violeta, lightsticks y destellos. El arte anterior (`../../assets/images/kpop-bts-special-card.png`) se conserva intacto. El avatar circular de muestra (`../../assets/images/kpop-demo-user-avatar.svg`) y el nombre se dibujan centrados sobre la franja inferior, sin cápsula adicional, para poder sustituirlos con datos reales después.

Los artes de BLACKPINK, TWICE y ENHYPEN están en `../../assets/images/kpop-blackpink-special-card.png`, `../../assets/images/kpop-twice-special-card.png` y `../../assets/images/kpop-enhypen-special-card.png`. Se generaron con las fotos aportadas por el usuario: rosa cristalino para BLACKPINK, dorado cálido para TWICE y azul plateado para ENHYPEN. Todos dejan libre la franja inferior para el avatar y el nombre editables.

En modo `dummy` aparecen varias burbujas de 30 monedas y botones independientes **100 · BTS**, **100 · BLACKPINK**, **100 · TWICE** y **100 · ENHYPEN** para probar cada card directamente. También se puede activar desde JavaScript con `window.dispatchEvent(new CustomEvent('kpop:gift', { detail: { group: 'BLACKPINK', coins: 100, username: '@usuario', avatarUrl: 'https://...' } }))`. El mapeo de los regalos reales de TikTok a estos eventos todavía no está conectado.

Las reacciones de **30 monedas** son medallones con la foto circular del usuario, un aro del color del grupo y una pequeña insignia BTS, BLACKPINK, TWICE o ENHYPEN. Rebotan contra los bordes del escenario y entre ellas. Se mantienen como máximo **15 activas**; los nuevos regalos esperan en cola si se alcanza ese límite. Cada medallón permanece al menos **30 segundos** y solo se retira para dar paso a uno en espera: si no hay cola, sigue visible. Con `prefers-reduced-motion` permanecen quietos, pero conservan la misma regla de permanencia. Si falta la foto o no carga, se usa el avatar local de muestra. Para probar una con datos de un usuario: `window.dispatchEvent(new CustomEvent('kpop:bubble', { detail: { group: 'TWICE', coins: 30, username: '@usuario', avatarUrl: 'https://...' } }))`. En modo `dummy`, selecciona un grupo de la columna derecha y pulsa **+1 bolita** para añadir una sola reacción; **30 · burbujas** conserva la prueba por lotes con avatares de muestra.

Los cuatro grupos aparecen como filas en la columna derecha, debajo de los regalos, para que los comentarios del LIVE no los tapen. Cada fila muestra regalos de 30 y 100 monedas; los de 100 se reservaron para cards grandes. Cada recuadro `＋` reserva el lugar de una imagen de regalo independiente.

La columna derecha muestra una leyenda compacta: 30 monedas crean un círculo (máximo 15), 100 monedas muestran una card especial del grupo y el usuario puede escribir `Love BTS`, `Love BP`, `Love Tw` o `Love En` durante la ventana de 60 segundos. En cada fila de grupo, el regalo se representa con un icono y un contador de envíos acumulados, listo para conectarse a los datos reales. La columna también actúa como obstáculo para los medallones: rebotan al tocarla y no se generan encima de ella. La card grande de 100 monedas permanece por encima de todos.

## Estructura

- `index.html`: composición semántica del escenario.
- `radio.css`: tokens visuales, layout vertical y animaciones.
- `radio.js`: modo dummy y funciones reutilizables para eventos reales.
- `../../assets/images/kpop-radio-background.png`: fondo espacial generado para esta experiencia.
