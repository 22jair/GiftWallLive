# K-pop Radio

Radio K-pop vertical de GiftWallLive. La página consume el WebSocket del servidor local para mostrar regalos de TikTok LIVE y la canción que el anfitrión reproduce en Spotify.

La composición usa un lienzo lógico de **393 × 852** (formato de celular). Se escala como una sola pieza para ajustarse a la ventana o a la fuente de TikTok LIVE Studio, conservando la misma proporción del contenido y el tamaño relativo de los textos. En una fuente más ancha quedan bandas laterales oscuras.

## Probar en local

Inicia el servidor desde `server/` y conecta TikTok y Spotify en su panel. Abre `index.html` directamente o desde GitHub Pages. El modo normal intenta conectarse a `ws://127.0.0.1:8081/live`; puedes especificar otra dirección con `?source=live&socket=ws%3A%2F%2F127.0.0.1%3A8081%2Flive`. Por defecto el servidor deja Spotify bajo control manual y solo transmite la canción actual. Para recuperar los pedidos musicales y la reproducción automática de la radio anterior, configura `GIFTWALL_AUTO_MUSIC=true` en `server/.env` y reinicia el servidor. El modo de demostración no abre el WebSocket:

```text
designs/kpop-radio/index.html?source=dummy
```

Las cards especiales empiezan ocultas. Tras un regalo de **Corazón** y la elección de BTS, BLACKPINK, TWICE o ENHYPEN, aparece el arte de ese grupo durante **15 segundos**: entra con un giro, flota suavemente con destellos mientras está visible y luego sale. La card grande siempre se dibuja por encima de las bolitas y del resto del escenario. Un nuevo evento sustituye la card y reinicia la secuencia con el usuario más reciente. El movimiento se simplifica cuando está activo `prefers-reduced-motion`.

El arte de `../../assets/images/kpop-bts-special-card-photo.png` se generó tomando la fotografía de BTS proporcionada por el usuario como referencia principal y la primera card como inspiración visual: siete integrantes, color violeta, lightsticks y destellos. El arte anterior (`../../assets/images/kpop-bts-special-card.png`) se conserva intacto. El avatar circular de muestra (`../../assets/images/kpop-demo-user-avatar.svg`) y el nombre se dibujan centrados sobre la franja inferior, sin cápsula adicional, para poder sustituirlos con datos reales después.

Los artes de BLACKPINK, TWICE y ENHYPEN están en `../../assets/images/kpop-blackpink-special-card.png`, `../../assets/images/kpop-twice-special-card.png` y `../../assets/images/kpop-enhypen-special-card.png`. Se generaron con las fotos aportadas por el usuario: rosa cristalino para BLACKPINK, dorado cálido para TWICE y azul plateado para ENHYPEN. Todos dejan libre la franja inferior para el avatar y el nombre editables.

En modo `dummy` aparecen varias burbujas y botones independientes **100 · BTS**, **100 · BLACKPINK**, **100 · TWICE** y **100 · ENHYPEN** para probar cada card directamente. También hay cuatro botones **Círculo · BTS/BLACKPINK/TWICE/ENHYPEN** para añadir un círculo del equipo elegido, más **Llenar círculos** para probar varios a la vez. La card se puede activar desde JavaScript con `window.dispatchEvent(new CustomEvent('kpop:gift', { detail: { group: 'BLACKPINK', coins: 100, username: '@usuario', avatarUrl: 'https://...' } }))`.

Los círculos son medallones compactos de **38 px** con la foto circular del usuario, su nombre, un aro del color del grupo y una pequeña insignia BTS, BLACKPINK, TWICE o ENHYPEN. Dejan una estela corta, pulsan suavemente y destellan al rebotar contra los bordes, la columna de regalos o entre ellos. Se mantienen como máximo **20 activos**; las nuevas reacciones esperan en cola si se alcanza ese límite. Cada medallón permanece al menos **15 segundos** y solo se retira para dar paso a uno en espera: si no hay cola, sigue visible. Con `prefers-reduced-motion` permanecen quietos y sin efectos animados. Si falta la foto o no carga, se usa el avatar local de muestra.

La columna derecha muestra los **últimos cinco regalos** recibidos, con avatar, usuario, monedas y foto del regalo, sin importar el tipo. El más reciente aparece arriba. Cada grupo muestra por separado el total de círculos y cards generados durante la sesión.

Solo **Doughnut** (ID `5879`) habilita un círculo, y solo **Hand Heart** (ID `5660`) habilita una card. Primero se compara el ID y se usa exactamente el nombre que entrega TikTok como respaldo. El remitente tiene **60 segundos** para escribir `Love BTS`, `Love BP`, `Love Tw` o `Love En` (o los nombres completos, sin distinguir mayúsculas) en el chat. Cada mensaje válido consume un regalo pendiente del mismo usuario; otros regalos solo aparecen en la lista. Los círculos rebotan al tocar la columna derecha y no se generan encima de ella. La card grande permanece por encima de todos. Spotify solo refleja la reproducción actual del anfitrión, sin aceptar pedidos desde este diseño.

Para probar directamente en un LIVE, cualquier usuario puede escribir `dona_b`, `dona_bp`, `dona_tw` o `dona_en` para generar un círculo, y `cora_b`, `cora_bp`, `cora_tw` o `cora_en` para mostrar una card. Los comandos no exigen un regalo previo, aceptan mayúsculas y usan el avatar y nombre del autor del comentario. Como no son regalos, no aparecen en la lista de últimos regalos ni consumen un regalo pendiente.

## Estructura

- `index.html`: composición semántica del escenario.
- `radio.css`: tokens visuales, layout vertical y animaciones.
- `radio.js`: modo dummy y funciones reutilizables para eventos reales.
- `../../assets/images/kpop-radio-background.png`: fondo espacial generado para esta experiencia.
