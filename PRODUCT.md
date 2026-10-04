# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Hispanohablantes aficionados a los coches míticos, desde el visitante curioso sin formación técnica hasta el entusiasta que ya conoce el motor y la transmisión. Cada sala atiende a los dos a la vez: una capa de historia accesible y una capa técnica opcional que el visitante activa cuando quiere profundidad.

## Product Purpose
Museo digital del automóvil, multi-sala. Un Hall da acceso a salas dedicadas a un coche cada una; cada sala cuenta su historia, su anatomía y la ingeniería de sus piezas mediante fotografía de estudio y despieces técnicos interactivos. Éxito: el visitante entiende por qué ese coche cambió las reglas y explora sus piezas por iniciativa propia.

## Positioning
Cada sala es una inmersión con identidad propia, construida alrededor del carácter de su coche; ninguna sala es una plantilla recoloreada de otra. Profundidad técnica real (despieces pieza a pieza) en un formato de exposición, no de ficha comercial.

## Operating Context
Navegación Hall → sala → vuelta al Hall. Salas actuales: 01 Ferrari F40 (`f40/`, terminada) y 02 Nissan Skyline GT-R R34 (`r34/`). Uso en escritorio y móvil, pensado para pantallas OLED.

## Capabilities and Constraints
- HTML, CSS y JS estáticos, sin build ni framework; funciona servido y abierto con doble clic (`file://`).
- Arquitectura guiada por datos: todo el contenido (coches, ficha técnica, paleta, catálogo de imágenes, textos, coordenadas de los puntos, módulos y tema de cada sala) vive en `data/cars.json` (esquema en `data/cars.schema.md`); `data/cars.js` es una copia generada con `node tools/build-data.mjs` para abrir el museo sin servidor. El motor `engine/` (núcleo, arranque de sala, Hall y módulos reutilizables) compone el Hall y las salas; cada sala es un `index.html` mínimo con `data-car="<id>"` y sus recursos en `<sala>/img/`. Añadir un coche = una entrada en `data/cars.json` + imágenes + carpeta con el `index.html` mínimo.
- Identidad por sala mediante temas (`themes/<tema>.css`) que definen los tokens y la piel de los componentes; cualquier módulo funciona con cualquier tema.
- Pie común con aviso legal: las marcas, logotipos e imágenes pertenecen a sus propietarios y se muestran con fines educativos y expositivos, sin afiliación; cada coche declara sus marcas en `marks`.
- Módulo común de consentimiento y privacidad en `assets/museo-consent.{css,js}`, tematizable con `--mc-accent`, `--mc-primary` y `--mc-primary-ink`.
- Cada sala ofrece un modo Historia y un modo Técnico; la preferencia se guarda por sala en `localStorage`.
- Negro puro `#000` como fondo: es una restricción del medio OLED que el usuario ha fijado.
- Hay que respetar `prefers-reduced-motion` y la navegación por teclado.

## Brand Commitments
- Proyecto conceptual; las marcas pertenecen a sus propietarios y el pie de página lo indica.
- Rigor factual: las cifras técnicas son las oficiales de serie; los datos no oficiales se etiquetan como tales (p. ej. R34: 280 PS homologados por el pacto de caballeros, unos 330 PS reales en banco).

## Evidence on Hand
- F40: fotos de estudio y despieces en `f40/img/`, audio del motor en `f40/f40-engine.mp3`.
- R34: diez renders de estudio en `r34/img/` (perfil, tres cuartos trasero, cabina, despieces de motor RB26DETT, frenos Brembo, rueda, alerón, ópticas, chasis y suspensión). No hay audio del R34.

## Product Principles
- Cada coche dicta su sala: identidad derivada de su cultura y su época, nunca de la sala anterior.
- Dos lecturas, un recorrido: historia para todos, técnica para quien la pida, sin duplicar la navegación.
- La pieza es la protagonista: la interfaz se retira y la fotografía lleva el peso.
- Verdad antes que espectáculo: ninguna cifra inventada ni exagerada.

## Accessibility & Inclusion
Navegación completa por teclado con foco visible, respeto a `prefers-reduced-motion`, contraste alto sobre negro y textos alternativos en todas las imágenes de contenido.
