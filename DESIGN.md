---
name: Museo digital del automóvil
description: Museo multi-sala sobre negro OLED; cada sala tiene su propio mundo visual. Este archivo fija las invariantes del museo y el mundo de la Sala 02 (Skyline GT-R R34, "Shuto nocturna").
colors:
  oled-black: "#000000"
  sign-blue: "#0b3f9c"
  sign-blue-deep: "#072c70"
  sign-ink: "#ffffff"
  led-lamp: "#c4eeff"
  wet-cyan: "#40e0ff"
  bayside-blue: "#285cff"
  cold-white: "#f2f5f8"
  reading-mist: "#c6cfd9"
  fog: "#a3afbc"
  dim: "#7d8995"
  rule: "rgba(150, 190, 255, 0.14)"
  rule-strong: "rgba(170, 205, 255, 0.28)"
typography:
  display:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.1rem, 3.7vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.45rem, 2.4vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.04rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  data:
    fontFamily: "Overpass Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "clamp(1.2rem, 2.6vw, 2.1rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\" 1"
  data-inline:
    fontFamily: "Overpass Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.88rem"
    fontWeight: 600
    lineHeight: 1.5
    fontFeature: "\"tnum\" 1"
  kana:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, Yu Gothic, Meiryo, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  tag: "4px"
  plate: "6px"
  mode-sign: "7px"
  sign: "8px"
  sign-fillet: "5px"
  shield: "0.38em"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  topbar: "64px"
  topbar-mobile: "58px"
  section-top: "clamp(96px, 14vh, 160px)"
  head-bottom: "clamp(36px, 5vh, 56px)"
  lane-gap: "10px"
  exit-gap: "14px"
components:
  sign-panel:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.sign}"
  sign-head:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.sign}"
    padding: "14px 22px 14px 16px"
  route-shield:
    backgroundColor: "{colors.sign-ink}"
    textColor: "{colors.sign-blue}"
    rounded: "{rounded.shield}"
    height: "1.9em"
    padding: "0 0.35em"
  mode-toggle:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    height: "30px"
    padding: "0 14px"
  mode-toggle-active:
    backgroundColor: "{colors.sign-ink}"
    textColor: "{colors.sign-blue}"
  lane-tab:
    backgroundColor: "{colors.sign-blue-deep}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.sign}"
    padding: "16px 18px 40px"
    height: "128px"
  lane-tab-selected:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
  exit-plate:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.sign}"
    padding: "18px 22px 18px 18px"
  exit-tag:
    backgroundColor: "{colors.sign-ink}"
    textColor: "{colors.sign-blue}"
    rounded: "{rounded.tag}"
    padding: "4px 8px 3px"
  distance-board:
    backgroundColor: "{colors.sign-blue}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.data}"
    rounded: "{rounded.sign}"
  detail-spot:
    backgroundColor: "{colors.oled-black}"
    textColor: "{colors.led-lamp}"
    rounded: "{rounded.round}"
    size: "44px"
  detail-pop:
    backgroundColor: "{colors.oled-black}"
    textColor: "{colors.cold-white}"
    rounded: "{rounded.sign}"
    width: "clamp(240px, 23vw, 340px)"
  part-marker:
    backgroundColor: "{colors.oled-black}"
    textColor: "{colors.sign-ink}"
    typography: "{typography.data-inline}"
    rounded: "{rounded.round}"
    size: "26px"
  part-marker-on:
    backgroundColor: "{colors.wet-cyan}"
    textColor: "{colors.oled-black}"
  back-link:
    textColor: "{colors.fog}"
    typography: "{typography.label}"
    height: "36px"
---

# Design System: Museo digital del automóvil

Este archivo recoge dos niveles. Primero, las **invariantes del museo**, compartidas por el Hall y todas las salas. Segundo, el **mundo de la Sala 02** (tema `wangan`, Nissan Skyline GT-R R34), que es el único mundo de sala documentado en detalle aquí. La Sala 01 y el Hall usan el tema `maranello` (Inter, luz de galería, acentos rojos), anterior y aparte; este archivo no lo describe y nada de lo que sigue se le aplica. La Sala 03 (McLaren P1) usa el tema `woking`, derivado de `maranello`: un laboratorio del McLaren Technology Centre: Inter para el texto, Titillium Web para los titulares, JetBrains Mono para rótulos y cifras de telemetría, un único acento Volcano Orange `#FF8C00` con tinta negra encima, filetes de precisión con marcas de calibración, micro-rejilla de túnel de viento y trama de fibra de carbono casi invisible. Su sección central es el módulo `telemetry-lab` (banco Road/Race, flujo aerodinámico, sensores y panel cockpit). La Sala 04 (BMW M3 E30) usa el tema `motorsport` ("DTM Paddock / Bavarian Homologation"): negro OLED con el haz de luz frío del museo, Barlow Condensed como tipografía técnica estilo DIN 1451 para títulos, rótulos y cifras, Rojo M Competición `#E2231A` como acento y la franja M a 45° (`#0066B1`, `#0C2340`, `#E2231A`); su sección central es el módulo `homologation-bay`. La Sala 05 (Porsche 911 GT3 RS) usa el tema `weissach` ("Flacht Motorsport Lab / Nordschleife Aero Dev"): negro OLED con el haz de luz frío, Saira para títulos y rótulos, IBM Plex Mono para la telemetría, Oro Neodyme `#C5A059` como acento, verde de telemetría `#00E676` para el reglaje DRS y púrpura Viola Metallic `#4B0082` como color de la sala; reutiliza el módulo `homologation-bay` con el esquema del alerón en lugar del cámber; tampoco se le aplica el mundo de la Sala 02. Una sala nueva elige un tema existente o se diseña con su propio mundo, y hereda solo las invariantes del museo.

**Arquitectura de temas.** Las salas se componen desde `data/cars.js` con los módulos de `engine/modules/`. La hoja `engine/sala.css` define la estructura de todos los módulos usando solo tokens semánticos; cada tema (`themes/<tema>.css`) da valor a esos tokens y la piel de los componentes compartidos (cabecera, conmutador de modo, progreso, salidas, pie). Contrato de tokens: colores `--text --text-soft --text-body --text-2 --text-3 --line --line-2 --accent --accent-2 --accent-3` (tripletas R, G, B) `--accent-ink --panel --panel-2 --panel-ink --plaque-rule`; tipos `--font-body --font-display --font-data --font-kana`; forma `--radius-plaque --glass --blur --shadow-card --shadow-ctrl --shadow-pin --shadow-pin-active`; movimiento `--ease --out --inout`; medidas `--topbar`. En el tema `wangan`, `--panel` es el azul de señal y `--accent` el cian; en `maranello`, `--panel` es cristal negro y `--accent` el rojo de carreras.

## Overview

**Creative North Star: "Shuto nocturna"**

**Invariantes del museo (todas las páginas).** El fondo es negro puro (#000) en todas partes: lo exige el medio OLED y no se rebaja a un gris oscuro. Cada sala tiene una barra superior con la vuelta al Hall arriba a la izquierda (`../index.html`, flecha a la izquierda y la palabra "Hall"). Todas las páginas terminan en el mismo pie (`Museo.footer`): el aviso legal (marcas, logotipos e imágenes de sus propietarios, con fines educativos y expositivos, sin afiliación; las marcas de cada coche desde `marks`) y el enlace "Privacidad y preferencias" con `data-open-privacy`; cada tema le da su propio estilo, pero el aviso nunca va en mayúsculas forzadas. Todas cargan el módulo común de consentimiento `assets/museo-consent.{css,js}` y lo adaptan solo con `--mc-accent` (tripleta R, G, B), `--mc-primary` y `--mc-primary-ink`, sin sobrescribir sus clases. En el Hall, la tarjeta de cada sala anuncia su mundo en miniatura. La de la R34 tiene la foto en penumbra en reposo; con hover o foco se enciende, pasa la farola fría por encima y la placa de ruta B 湾岸線 cambia de azul de señal profundo a azul de señal.

**Mundo de la Sala 02.** La sala es una vuelta de noche por la ruta B (Wangan) de la autopista metropolitana de Tokio. Sobre el negro OLED, la única luz es la de las farolas LED: una banda blanca y fría con un poco de cian que barre la carrocería azul Bayside. La navegación y los títulos están hechos con el sistema japonés de señales de orientación: paneles azules con un filete blanco interior, escudo de ruta, flechas de carril, postes kilométricos, un panel de destinos y distancias, y placas de salida. Se usa el azul de las señales de carretera general, no el verde de autopista. La fotografía es la protagonista; la interfaz habla como la señalización vial: breve, en mayúsculas, con las cifras en columnas.

Ritmo pausado y oscuro, con poca densidad salvo en las tablas técnicas. El movimiento es luz que pasa: un barrido de farola, un brillo retrorreflectante que cruza una señal, una marca de carril que se enciende según se avanza. Rechazos confirmados: la página de producto (titular + foto + fila de tarjetas iguales) y el decorado synthwave anterior (sol magenta, rejilla Tron).

**Key Characteristics:**
- Negro OLED #000 como único fondo; la profundidad sale de la luz, no de superficies grises.
- Las señales de orientación azules son a la vez los títulos, la navegación, las pestañas, las cifras y las salidas.
- Tres familias con un papel cada una: Overpass para las señales, Overpass Mono para las cifras tabulares y Zen Kaku Gothic New para el kana.
- Barrido de farola y brillo retrorreflectante como único lenguaje de luz en movimiento.
- Enfoque óptico: la foto se desenfoca y oscurece, y solo queda nítido un círculo alrededor de la pieza elegida.
- Escenario fijo: en los despieces cambia el contenido, nunca el marco.

## Colors

Una noche de autopista: negro absoluto, el azul esmaltado de las señales, blanco frío de LED y un cian que solo aparece cuando algo está activo o encendido.

### Primary
- **Azul de señal** (sign-blue): el panel de todas las señales (H1, títulos de sección, pestaña de carril activa, panel de cifras, placas de salida, conmutador de modo, etiquetas de los puntos de detalle) y el botón principal del módulo de consentimiento en esta sala. En pantallas P3 se sustituye por `color(display-p3 0.05 0.24 0.62)`.
- **Azul de señal profundo** (sign-blue-deep): carriles del pórtico en reposo y placa de ruta de la tarjeta del Hall en reposo. Pasa a azul de señal al seleccionar.

### Secondary
- **Cian de asfalto mojado** (wet-cyan): el estado "encendido". Anillo de foco, subrayado de la sección actual, aro y relleno de los puntos activos, marcador numerado activo, tramo de carril ya recorrido, código del sistema en los despieces, fila de pieza activa y `--mc-accent` del módulo común.
- **Lámpara LED** (led-lamp): la luz de las farolas. Banda del barrido, marcas discontinuas del carril y de la barra de progreso, núcleo de los puntos de detalle, borde de los marcadores numerados.

### Tertiary
- **Azul Bayside** (bayside-blue): el color de la carrocería, usado muy poco en la interfaz. Color de selección de texto (al 70 %) y reflejo bajo la vista de detalle. No se usa para rellenar paneles; ese papel es del azul de señal.

### Neutral
- **Negro OLED** (oled-black): el fondo de toda la página, de la barra superior, de las vistas de detalle y de los marcadores.
- **Blanco frío** (cold-white): texto principal y cifras.
- **Niebla de lectura** (reading-mist): párrafos largos de historia y despieces.
- **Niebla** (fog): texto secundario, etiquetas, enlaces de barra en reposo (9:1 sobre negro).
- **Tenue** (dim): notas al pie, pies de foto, avisos y pie de página (5,5:1 sobre negro).
- **Filete** (rule) y **filete marcado** (rule-strong): líneas de tabla y bordes, en un blanco azulado translúcido, nunca gris neutro.
- **Tinta de señal** (sign-ink): filete interior, escudo, flechas y texto sobre azul de señal.

### Named Rules
**The Lamp Light Rule.** La luz en movimiento es siempre el blanco frío de la lámpara LED, en `mix-blend-mode: screen`, con poca opacidad (pico 0,17). El cian marca lo que está encendido o activo; nunca es un color de relleno.

**The Signage Blue Rule.** Un panel azul en esta sala es siempre una señal: azul de señal, filete blanco interior y tinta blanca. Nada más usa un relleno azul.

**The Black Is The Road Rule.** No hay superficies grises ni tarjetas elevadas sobre el fondo. Fuera de las señales, cualquier contenedor es negro #000 con un filete azulado.

## Typography

**Display Font:** Overpass (con Helvetica Neue, Arial)
**Body Font:** Overpass (misma familia, peso 400)
**Label/Mono Font:** Overpass Mono para cifras; Zen Kaku Gothic New para el kana (cargada solo con los glifos usados mediante `&text=`)

**Character:** Overpass deriva de la Highway Gothic de la señalización vial: se lee como un rótulo, no como una revista. La mono hermana alinea todas las cifras en columnas; el kana de Zen Kaku acompaña cada señal como en las señales bilingües reales.

### Hierarchy
- **Display** (800, clamp(2.1rem, 3.7vw, 4rem), 0.95, mayúsculas, sin salto de línea): solo el nombre del coche dentro de la señal H1.
- **Headline** (800, clamp(1.6rem, 3vw, 2.4rem), 1): título de sección dentro de una señal de sección. El panel de cifras usa clamp(1.4rem, 2.6vw, 2rem).
- **Title** (800, clamp(1.45rem, 2.4vw, 2rem), 1.1, `text-wrap: balance`): títulos de los tramos de historia. El título del sistema activo en los despieces sube a clamp(1.7rem, 2.8vw, 2.4rem) con interlineado 1.
- **Body** (400, 1.04rem, 1.7, máximo 58–60ch): párrafos en niebla de lectura. Las introducciones de sección van en niebla a 1.02rem, con un máximo de 52ch.
- **Label** (600–800, 0.72–0.78rem, espaciado 0.08–0.14em, mayúsculas): vuelta al Hall, ruta de secciones, conmutador de modo, etiquetas de los puntos, rótulos de la tira de datos.
- **Data** (Overpass Mono 600, cifras tabulares): cifras del panel de distancias a clamp(1.2rem, 2.6vw, 2.1rem); cifras de la tira bajo la portada a clamp(1.05rem, 1.6vw, 1.35rem) con un halo cian suave; valores de tabla en línea (dd, códigos, números de pieza) a 0.82–0.88rem.
- **Kana** (Zen Kaku Gothic New 700, espaciado 0.06em; 0.3em en la スカイライン del H1): siempre acompañando a un texto latino dentro de una señal, nunca solo.

### Named Rules
**The One Mono Rule.** Toda cifra con unidad (PS, N·m, cc, kg, mm, años, códigos de chasis) va en Overpass Mono con `tabular-nums`. La sans nunca compone cifras de datos.

**The Bilingual Sign Rule.** Cada señal lleva su línea en kana con `lang="ja"`. El kana es parte de la señal, no un adorno suelto sobre la página.

## Layout

Columna centrada de 1320px como máximo con márgenes laterales de `gutter`. El panel de cifras y las salidas se estrechan a 960px. Las secciones arrancan con mucho aire superior (`section-top`). La cabecera de sección pone la señal a la izquierda y la introducción a la derecha, alineadas por abajo, y pasa a una columna si no caben.

**Primera pantalla (adaptación aceptada en la revisión).** La portada es un render fijo aportado por el usuario. El coche queda **centrado**, con su reflejo en el tercio inferior; no "el coche en el tercio inferior" como pedía el brief. El escenario mide `min(100%, (100svh - topbar) × 1.7769)` para que la foto entera quepa bajo la barra, y los bordes se funden con el negro (7 % a cada lado y el 22 % inferior). La señal H1 se sitúa arriba a la izquierda sobre la foto (izquierda 8,5 %, arriba 3 %). La tira de datos se monta sobre el borde inferior de la foto en cuatro columnas separadas por filetes.

**Historia.** Dos columnas (1fr / 1.15fr): a la izquierda, la carretera con su marca de carril y los postes kilométricos; a la derecha, la foto fija con `position: sticky`.

**Despieces.** El pórtico tiene cinco carriles en rejilla con 10px de separación. Debajo, un escenario fijo donde todos los paneles ocupan la misma celda (`grid-area: 1 / 1`) y solo cambia cuál se ve. Cada panel reparte despiece y ficha en 1.55fr / minmax(300px, 1fr).

**Responsive.** 1080px: se oculta la ruta de secciones, los carriles pasan a un carrusel horizontal con scroll-snap (cada uno de clamp(170px, 30vw, 220px)) y el panel pasa a una columna. 860px: la historia pasa a una columna con la foto delante y la tira de datos a 2×2. 760px: la barra baja a 58px, la señal H1 sale de la foto y se coloca encima, las vistas de detalle van bajo la foto a lo ancho, las salidas se apilan y la vuelta muestra solo la flecha. 420px: las filas del panel de cifras se apilan.

## Elevation & Depth

Fondo plano y absoluto. La profundidad llega de dos sitios: la luz (barridos en `screen`, halos cian en lo que está encendido) y las sombras de las señales, que son placas físicas colgadas en la noche. No hay capas grises. La barra superior es negra opaca y se funde 28px hacia abajo con un degradado a transparente.

### Shadow Vocabulary
- **Placa de señal** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 4px rgba(0,0,0,0.6), 0 18px 40px -12px rgba(0,0,0,0.85)`): todas las señales. Canto superior iluminado y caída suave y difusa.
- **Vista de detalle** (`box-shadow: 0 2px 6px rgba(0,0,0,0.7), 0 18px 36px -12px rgba(0,0,0,0.95), 0 22px 40px -26px rgba(40,92,255,0.55)`): la vista inset con un reflejo azul Bayside debajo.
- **Halo encendido** (`0 0 12–24px rgba(64,224,255,0.45–0.95)`, más un anillo negro de 3–4px de separación): puntos de detalle, marcadores numerados y tramo de carril recorrido. Con `text-shadow: 0 0 14–18px rgba(64,224,255,0.35–0.45)` en las cifras de la tira y el código del sistema.

### Named Rules
**The Lit Not Lifted Rule.** Un elemento activo se enciende (cian, halo), no se eleva. Las únicas sombras de caída son las de las placas de señal y las vistas de detalle.

## Shapes

Esquinas suaves de chapa esmaltada: señal a 8px con el filete blanco interior (2px, 92 % de opacidad) a 5px de inset y radio de 5px. El conmutador de modo es una señal más pequeña (7px, filete de 1.5px a 2px de inset). Etiquetas, postes kilométricos y placas EXIT a 4px. Fotos y despieces a 6px. El escudo de ruta es un cuadrado blanco con radio de 0.38em y la letra de la ruta en azul. Los puntos interactivos sobre la foto son círculos. La flecha de carril, la flecha de salida y la marca de visitado son SVG de trazo blanco (2.4px, extremos redondeados), nunca glifos tipográficos.

## Components

### Señal (componente base)
Panel azul de señal con filete blanco interior, sombra de placa y una lámina retrorreflectante (`::after`): un brillo blanco al 16 % que la cruza en diagonal. Lo usan el H1, las cabeceras de sección, los carriles, el conmutador de modo, el panel de cifras y las salidas.
- **Señal H1:** escudo B + 首都高速湾岸線 + "Sala 02" en mono; nombre en display; pie con filete blanco superior, スカイライン, "R34 · BNR34 · 1999–2002" en mono y flecha diagonal. El brillo cruza cada 6.4s, sincronizado con el barrido de la foto. Al enfocar un detalle baja al 12 % y se desenfoca 2px.
- **Señal de sección:** escudo + kana + título, con un padding de 14px 22px 14px 16px.

### Buttons
- **Conmutador Historia/Técnico:** una señal con dos carriles de 30px de alto. El activo se invierte (fondo blanco, texto azul de señal); el inactivo va en blanco al 78 %. Se comprime a 0.96 al pulsar. La preferencia se guarda por sala en `localStorage`.
- **Vuelta al Hall:** etiqueta en niebla con flecha SVG. Con hover pasa a blanco frío y la flecha se desplaza 3px a la izquierda.
- **Placas de salida:** señal con etiqueta blanca EXIT / 出口, destino en 800 y flecha. Con hover sube el brillo a 1.18 y la flecha avanza 4px (retrocede en la vuelta al Hall). Se comprime a 0.98 al pulsar.

### Navigation
- **Barra superior:** 64px, negra opaca, fija. Vuelta a la izquierda, ruta de secciones en el centro y conmutador a la derecha. La sección actual pasa a blanco frío y se subraya con una barra cian de 2px que crece desde la izquierda.
- **Barra de progreso:** 3px fijos arriba, en trazos discontinuos de lámpara LED (26px de trazo, 18px de hueco), que se descubren con el scroll.
- **Pórtico de carriles (tablist):** viga de pórtico gris acero de 6px sobre cinco señales-carril (kana, nombre, código en mono, flecha hacia abajo). En reposo van en azul profundo con el filete al 50 %; el carril seleccionado pasa a azul de señal con el filete al 92 %, la flecha baja 3px y el brillo cruza una vez (0.9s). Los carriles visitados muestran una marca blanca que se guarda. Se maneja con las flechas izquierda/derecha y con Inicio y Fin.

### Enfoque óptico (componente firma)
Dos capas de la misma foto. La base se oscurece, desatura y desenfoca (`brightness(0.5) saturate(0.7) blur(3px)`, escala 1.012); la nítida solo se ve dentro de un círculo con máscara radial (núcleo del 11 %, borde suave hasta el 24 %) centrado en `--fx`/`--fy`. Esas variables están registradas con `@property` para que el foco se desplace con suavidad entre piezas (0.5s, inout). Funciona en la portada (puntos de detalle) y en cada despiece (marcadores numerados).

### Puntos de detalle y vista inset
- **Punto:** zona táctil de 44px; aro cian de 22px sobre negro con núcleo de lámpara LED y halo cian. Al abrirse se rellena de cian y crece a 1.15. Su etiqueta es una placa azul de señal que aparece al pasar el ratón o al recibir el foco.
- **Vista inset:** figura negra de clamp(240px, 23vw, 340px), radio de 8px y filete marcado, con la foto en 3:2 y un pie con título en 800 y texto en niebla. Nace del punto que la abre (`transform-origin` según el cuadrante), pasando de escala 0.94 y blur de 4px a nítida. Se cierra con Escape. En móvil se coloca a lo ancho bajo la foto.

### Marcadores numerados y lista de piezas
Círculos negros de 26px con borde de lámpara LED y el número en mono. Al activarse se rellenan de cian, el texto pasa a negro y crecen a 1.18 con halo. Cada marcador está enlazado a su fila de la lista de piezas: la fila activa recibe un degradado cian del 10 % a transparente, y su número y nombre pasan a cian.

### Cards / Containers
- **Tabla de datos:** filas `dt`/`dd` entre filetes azulados; el término va en niebla y en mayúsculas, el valor en mono 600 alineado a la derecha y la aclaración en tenue bajo el valor.
- **Panel de distancias (cifras):** una señal ancha (960px como máximo). La cabecera lleva escudo, título y 大黒 · 諸元 separados por un filete blanco de 2px. Debajo, filas de destino–distancia: concepto a la izquierda, cifra en mono grande a la derecha y la unidad a la mitad de tamaño.
- **Marca de carril:** línea discontinua vertical de lámpara LED (30px de trazo, 22px de hueco) con postes kilométricos blancos (KP 1–3, mono). Según se avanza, el tramo recorrido se repinta en cian con halo.

### Motion
Dos curvas: `--out` (cubic-bezier(0.23, 1, 0.32, 1)) para entradas y respuestas, y `--inout` (cubic-bezier(0.77, 0, 0.175, 1)) para lo que se desplaza en pantalla. El barrido de farola de la portada va en bucle cada 6.4s; en el resto de fotos (`.lit`) avanza según el scroll. Las apariciones combinan opacidad, 18px de subida y blur de 6px, con 70ms de escalonado. Con `prefers-reduced-motion` se apagan barridos, brillos y desplazamientos, y queda solo un fundido de 0.3s.

## Do's and Don'ts

### Do:
- **Do** mantener #000 como fondo de toda página del museo y la vuelta al Hall arriba a la izquierda en cada sala.
- **Do** adaptar el módulo común de consentimiento solo con `--mc-accent`, `--mc-primary` y `--mc-primary-ink` (en la R34: cian 64, 224, 255; azul de señal; tinta blanca).
- **Do** construir todo título y navegación de la R34 como señal: azul de señal, filete blanco interior a 5px, radio de 8px, escudo de ruta y línea de kana.
- **Do** componer toda cifra en Overpass Mono con `tabular-nums` y etiquetar como estimación cualquier dato no oficial (p. ej. "≈ 330 PS · estimación habitual, no oficial").
- **Do** reservar el cian para lo encendido o activo y el blanco frío de lámpara para la luz que pasa.
- **Do** usar el enfoque óptico para señalar una pieza en una foto, en vez de flechas o recuadros superpuestos.
- **Do** cambiar solo el contenido dentro de un escenario fijo cuando haya varias vistas de un mismo marco.
- **Do** dar una alternativa estática a cada barrido o brillo con `prefers-reduced-motion`.

### Don't:
- **Don't** aplicar a la R34 la tipografía, el rojo ni la luz de galería del F40 y el Hall, ni llevar el sistema de señales de la R34 a otra sala.
- **Don't** usar el verde de las señales de autopista; la sala usa el azul de las señales de carretera general.
- **Don't** volver al decorado synthwave (sol magenta, rejilla Tron) ni al patrón de página de producto (titular + foto + fila de tarjetas iguales).
- **Don't** poner etiquetas sueltas o antetítulos en mayúsculas sobre los títulos de sección; el título ya es una señal con su escudo y su kana.
- **Don't** usar superficies grises o tarjetas elevadas sobre el negro; los contenedores son negros con un filete azulado.
- **Don't** usar glifos tipográficos como iconos; las flechas y marcas son SVG de trazo blanco.
