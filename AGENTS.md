# AGENTS.md

## Proyecto

GiftWallLive es una experiencia web vertical para TikTok LIVE. Muestra en una cinta digital los regalos simulados de los espectadores y un Top 3 por aporte acumulado.

## Alcance actual

- Mantener una sola página que funcione localmente en el navegador.
- Usar datos simulados hasta que se solicite explícitamente integrar TikTok.
- Priorizar una interfaz vertical, legible, animada y apta para una transmisión en vivo.
- Mantener el proyecto pequeño y fácil de entender.

## Reglas de implementación

- Usar HTML, CSS y JavaScript nativos mientras cubran las necesidades del proyecto.
- No añadir frameworks, servidores, bases de datos, gestores de paquetes ni dependencias sin explicar primero su necesidad y obtener aprobación.
- No crear autenticación, panel administrativo, SaaS ni infraestructura no solicitada.
- Conservar los recursos visuales en `assets/images/` y los sonidos en `assets/sounds/`.
- Mantener accesibilidad básica: HTML semántico, contraste suficiente, texto alternativo y respeto por `prefers-reduced-motion`.
- Evitar secretos, tokens y datos personales en el repositorio.

## Forma de trabajo

- Revisar el estado de Git y el contenido existente antes de modificar archivos.
- No sobrescribir cambios del usuario ni eliminar archivos sin autorización explícita.
- Hacer cambios pequeños, claros y relacionados con la tarea solicitada.
- Probar la página en el navegador después de cambios visuales o funcionales.
- Actualizar `README.md` cuando cambien el uso, la estructura o las decisiones importantes.
- Crear una skill en `.agents/skills/` solo cuando exista un procedimiento estable que se repita y aporte valor real.

## Mapa de skills

- Para crear o rediseñar la interfaz, usar primero `.agents/skills/frontend-design/SKILL.md` para definir una dirección visual distintiva y después `.agents/skills/giftwall-design/SKILL.md` para aplicar las reglas específicas de GiftWallLive.
- Para revisiones visuales pequeñas, usar únicamente `.agents/skills/giftwall-design/SKILL.md` cuando no sea necesario replantear la dirección artística.
- Para generar fondos, texturas o ilustraciones raster, usar una skill de generación de imágenes únicamente cuando la tarea necesite esos recursos.
- Para cambios sencillos de contenido o mantenimiento técnico, trabajar directamente sin cargar una skill de diseño.
- Añadir nuevas skills solo cuando representen otro flujo repetible y distinto; no duplicar instrucciones que ya estén en este archivo.

## Criterio de finalización

Una tarea queda terminada cuando el comportamiento solicitado funciona, la interfaz no presenta errores visibles en el tamaño vertical objetivo y la documentación afectada está actualizada.
