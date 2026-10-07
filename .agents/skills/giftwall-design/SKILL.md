---
name: giftwall-design
description: Diseñar, implementar o revisar la experiencia visual vertical de GiftWallLive, incluidos el muro de regalos, las animaciones y el Top 3. Usar en tareas de interfaz y dirección visual; no usar para mantenimiento técnico sin impacto visual.
---

# Diseño de GiftWallLive

Crear una experiencia atractiva para ocupar el área principal de un TikTok LIVE y seguir siendo legible durante una transmisión.

## Resultado esperado

- Diseñar primero para un lienzo vertical de relación 9:16 y comprobar que siga funcionando en otros tamaños razonables.
- Mantener visibles y distinguibles el avatar, el nombre, el regalo, la cantidad y el aporte acumulado de cada participante.
- Dar jerarquía permanente al Top 3 sin competir con la llegada de regalos nuevos.
- Usar animación para comunicar entrada, avance y celebración; evitar movimiento decorativo que dificulte la lectura.
- Mantener una composición clara cuando haya nombres largos, avatares ausentes o cifras grandes.

## Dirección visual

- Buscar una estética festiva, digital y reconocible en pocos segundos.
- Priorizar contraste, tipografía grande y áreas seguras para que la interfaz sobreviva a compresión de video y superposiciones del LIVE.
- Definir colores, espaciado, radios, sombras y tiempos de animación como variables CSS reutilizables.
- Mantener el protagonismo en las personas y sus regalos, no en adornos estáticos.
- Incluir una alternativa sobria para `prefers-reduced-motion`.

## Flujo de trabajo

1. Revisar el estado actual de `index.html` y los recursos existentes.
2. Identificar la información y los estados que la tarea debe representar antes de decidir la decoración.
3. Implementar con HTML, CSS y JavaScript nativos, salvo que el usuario apruebe otra tecnología.
4. Revisar visualmente el resultado en formato vertical y corregir recortes, solapamientos, desbordes y contraste.
5. Confirmar que la interfaz también sea comprensible sin sonido y que las animaciones no oculten datos esenciales.

## Recursos visuales

Usar CSS para formas, luces y fondos simples. Cuando un fondo, textura o ilustración raster aporte valor real, generar o incorporar el recurso en `assets/images/`, optimizarlo para la web y documentar su procedencia cuando corresponda.
