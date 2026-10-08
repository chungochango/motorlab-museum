# Datos del museo · `data/cars.json`

`cars.json` es la **fuente única** del museo: el Hall y todas las salas se generan a partir de él con el motor de `engine/`. No se escribe HTML de contenido en ningún otro sitio.

| Archivo | Quién lo edita | Para qué |
|---|---|---|
| `data/cars.json` | Tú | Contenido de todas las salas |
| `data/cars.js` | **Nadie** (generado) | Copia para abrir el museo con doble clic (`file://`) |
| `tools/build-data.mjs` | — | Valida el JSON y regenera `cars.js` |
| `tools/images.mjs` | — | Genera `.avif`/`.webp` y anota sus `formats` |
| `tools/sync-roadmap.mjs` | — | Pone el `[ESTADO: …]` de cada sala en `HOJA DE RUTA MOTORLABMUSEUM.txt` (lo ejecuta `build-data.mjs`) |

Con servidor (`http://`), el motor lee `cars.json` directamente. Sin servidor, usa `cars.js`. **Después de cualquier cambio en `cars.json`, ejecuta `node tools/build-data.mjs`** para que la versión de doble clic no se quede desfasada.

## Datos del museo

`museum.tracks` guarda los circuitos que comparten las salas: `{ name, lengthKm, viewBox, d, source }`, con el trazado real a escala (de OpenStreetMap; `source` es su atribución, que se muestra bajo el plano). El módulo `track-telemetry` los cita por su clave (`"track": "nordschleife"`).

`museum.legal` es el aviso legal y `museum.privacy` la lista de puntos de privacidad técnica: los dos se muestran en la ventana «Info legal» del pie de todas las páginas (`Museo.footer` en `engine/core.js`). La política completa y el consentimiento siguen en `assets/museo-consent.js`.

## Añadir un coche

1. Crea la carpeta `rooms/cars/<slug>/` (o `rooms/bikes/<slug>/` para una moto) y copia `rooms/cars/f40/index.html` cambiando sólo `data-car="<id>"` y el `canonical`. Sus imágenes van en `rooms/cars/<slug>/img/` con nombres limpios (`<slug>-perfil.jpg`, `despiece-motor.jpg`…); conserva allí los originales `.png` (no se publican: ver `.vercelignore`). En el catálogo, `dir` apunta a esa carpeta; la URL pública sigue siendo `/<slug>/` gracias a las reescrituras que genera `tools/build-headers.mjs` (`vercel.json` y `_redirects`).
2. Añade un objeto a `cars` (el orden decide el número de sala y la "siguiente sala").
   Si la sala se publica antes que sus fotos, añade `"pendingImages": true`: `build-data.mjs` avisa de las que faltan en vez de fallar, y la web oculta los huecos sin iconos de imagen rota. Quítalo cuando estén todas.
3. Ejecuta `SHARP_DIR=<carpeta con sharp> node tools/images.mjs` (formatos modernos + `cars.js`) o, si no conviertes imágenes, `node tools/build-data.mjs`.

## Esquema de un coche

```jsonc
{
  "id": "ferrari-f40",            // identificador único; clave de memoria museo.<id>
  "slug": "f40",                  // URL pública de la sala: /f40/ (se reescribe a su carpeta)
  "dir": "rooms/cars/f40",        // carpeta de la sala: rooms/cars/<slug> o rooms/bikes/<slug> (motos)
  "wing": "dos-ruedas",           // opcional: ala temática (museum.wings). Sus salas van tras un separador en los indicadores del Hall
  "room": "M-01",                 // opcional: número propio de sala; sin él, el orden en cars (01, 02…). Úsalo con "wing"
  "name": "Ferrari F40",
  "brand": "Ferrari",
  "make": "Ferrari", "model": "F40", "badge": "R34",   // cabecera y Hall (badge opcional)
  "year": 1987,                   // año de presentación
  "years": "1987 — 1992",         // periodo de producción, como se muestra
  "theme": "maranello",           // themes/<tema>.css: maranello (F40) · wangan (R34) · woking (P1) · motorsport (M3) · weissach (GT3 RS) · santagata (Temerario) · stuttgart (190E) · midnight (Supra) · pikes (Sport quattro S1) · motolab (salas de motos)
  "country": "Alemania", "category": "Turismo de Homologación Grupo A / DTM",   // opcionales, informativos
  "tags": ["supercar", "turbo"],   // filtros del índice del Hall: supercar · competicion · moto · turbo · atmosferico (otras, como rally o rotativo, sólo cuentan para el buscador)
  "pendingImages": true,          // opcional: fotos aún no subidas (aviso en vez de error)
  "status": "coming_soon",       // opcional: sala en desarrollo. Sale en el Hall apagada, con la insignia «Sala en desarrollo // Próximamente»
                                  // y un avance (hall.teaser + specsPreview) en vez de enlace; no necesita specs, sections ni carpeta index.html
                                  // hall.teaser: { badge: "En modelado", lines: ["Sala 08 · En modelado", "…"] }; badge sustituye a «Próximamente»
  "releaseDate": "2026-10-10T18:00:00+02:00",   // opcional: apertura programada (ISO 8601 con zona). Antes de esa hora la sala sale cerrada en el Hall
                                  // con fecha y cuenta atrás, no entra en el recorrido y su URL muestra «Acceso restringido»; al llegar la hora
                                  // se abre sola, sin volver a publicar. Si sigue "coming_soon" (sin página), al vencer vuelve a «Próximamente».
                                  // Es un cierre de presentación: los datos y la página ya son públicos.
  "palette": {
    "accent": "#d40000",          // color de la sala
    "body": "#d40000",            // color de carrocería de referencia
    "hallAccent": "212, 0, 0"     // R, G, B con que se enciende su tarjeta del Hall
  },
  "marks": ["Ferrari", "F40"],    // marcas citadas en el aviso legal del pie
  "exitLine": "…",                // subtítulo en la salida "siguiente sala"
  "meta": { "title": "…", "description": "…" },

  "specs": {                      // FICHA TÉCNICA: única fuente de las cifras
    "power":      { "label": "Potencia", "value": 478, "unit": "CV", "note": "a 7.000 rpm" },
    "torque":     { … }, "topSpeed": { … }, "weight": { … },
    "drivetrain": { "label": "Tracción", "value": "Trasera" },
    "engine":     { "label": "Motor", "value": "V8 biturbo F120A", "note": "2.936 cc" }
    // claves libres: acceleration, displacement, production… ("decimals" para 4,1 s)
  },

  "images": {                     // CATÁLOGO: rutas, tamaño y texto alternativo
    "f40-perfil": {
      "role": "hero",             // hero | detail | exploded
      "src": "f40/img/f40-perfil.webp", "w": 1536, "h": 1024,
      "alt": "…",
      "formats": ["avif", "webp"] // lo escribe tools/images.mjs; no lo pongas a mano
    }
  },

  "hall": { "text": "…", "specs": [["478 CV", "V8 biturbo"], …], "image": { "ref": "f40-perfil", "fit": "contain" } },
  "colors": { … },                // opcional: selector de color de carrocería
  "audio": { … },                 // opcional: sonido del motor
  "sections": [ … ]               // módulos que componen la sala, en orden
}
```

### Referencias a imágenes

Cualquier campo `"image"` de `sections` o `hall` apunta al catálogo:

- `"image": "pieza-motor"`: usa la imagen tal cual.
- `"image": { "ref": "f40-perfil", "alt": "…", "fit": "contain" }`: la misma imagen con otro texto alternativo o encaje.

### Puntos interactivos (hotspots)

Coordenadas `x`, `y` en **% de su imagen** (0–100, desde la esquina superior izquierda), con su texto explicativo:

- `anatomy-tabs › points`: `{ x, y, side, label, title, historia, tecnico, audio }`
- `parts-gallery › items › views › points`: `{ x, y, side, label, title, desc }`
- `hero-plate › spots`: `{ key, label, x, y, pop: { opens, at, image, title, text } }`
- `systems-lanes › lanes › parts`: `{ x, y, name, short, desc, value }`


En `anatomy-tabs`, cada punto admite además `"image": "despiece-motor"`: el despiece de esa pieza aparece dentro de su tarjeta (ampliable a pantalla completa). Lo usa la Sala 03 (P1).

### Cifras en las secciones

`facts-counters` y `specs-board` no repiten cifras: reciben `"specs": ["power", "torque", …]` y las leen de la ficha técnica.

### Texto por modo de lectura

Un texto que cambia con el modo se escribe `{ "historia": "…", "tecnico": "…" }`; si no cambia, basta un valor. Se admite HTML sencillo (`<em>`, `<b>`): es contenido propio y de confianza.

## Módulos disponibles

`hero-cinematic` · `hero-plate` · `anatomy-tabs` · `parts-gallery` · `story-road` · `systems-lanes` · `facts-counters` · `specs-board` · `homologation-bay` (box de homologación con cámara, panel de detalle y reglaje calle/competición; formato en la cabecera de `engine/modules/homologation-bay.js`) · `boost-stage` (simulador de turbos secuenciales: deslizador de régimen y etapas `{ key, from, title, text, readouts }`) · `tolerance-stages` (etapas de preparación con el estado de cada pieza y la marca de dato oficial o no) · `duel-board` (duelo de fichas contra otra sala del catálogo: `rival` es su id y cada fila `{ spec, better: "high"|"low", verdict }` compara la misma clave de `specs`; formato en la cabecera de `engine/modules/duel-board.js`) · `track-telemetry` (Track Blueprint: plano del circuito con cursor, deslizador de vuelta, salpicadero de velocidad, marcha, régimen, fuerzas G y pedales, y ficha de cada curva crítica; formato en la cabecera de `engine/modules/track-telemetry.js`; trae su propia hoja `track-telemetry.css`) · `telemetry-lab` (laboratorio de túnel de viento: su formato está documentado en la cabecera de `engine/modules/telemetry-lab.js`; la geometría `rig` se mide en % sobre la foto de perfil). Cualquier sala puede usar cualquier módulo con cualquier tema. Un módulo con estilos propios se registra con `{ css: true }` y `engine/sala.js` carga `engine/modules/<tipo>.css`.

## Despliegue

Las cabeceras de seguridad y caché se generan desde `tools/build-headers.mjs` (lo ejecuta `build-data.mjs`):

Se publica sólo la carpeta `dist/`, que genera `tools/build-dist.mjs` (páginas, motor, temas, datos y cada imagen del catálogo con sus formatos; nada de originales `.png`, notas, herramientas ni `.md`). El mismo script comprueba que no falte ninguna ruta.

| Plataforma | Configuración | Comando de build | Publicar |
|---|---|---|---|
| Vercel | `vercel.json` (cabeceras + build) y `.vercelignore` | `node tools/build-dist.mjs` | `dist` |
| Netlify | `netlify.toml` (build) y `dist/_headers` (cabeceras) | `node tools/build-dist.mjs` | `dist` |
| Cloudflare Pages | `dist/_headers` | `node tools/build-dist.mjs` | `dist` |

- Antes de subir cambios, ejecuta en local `node tools/build-data.mjs` (datos, precarga del Hall y cabeceras). La plataforma sólo ejecuta `build-dist.mjs`, que no modifica el código fuente.
- Las cabeceras de Netlify van sólo en `_headers`: si se repitieran en `netlify.toml`, Netlify las uniría con comas y la CSP dejaría de ser válida.
- **No edites `vercel.json` ni `_headers` a mano**: cambia la política en `tools/build-headers.mjs` y ejecuta `node tools/build-data.mjs`.
- **CSP**: sólo scripts propios (más el hash del `<script>` en línea que marca `html.js`), estilos propios + Google Fonts, imágenes/audio/datos del mismo origen y ninguna inserción en marcos. Si añades un `<script>` en línea o cambias el existente, vuelve a generar las cabeceras o el navegador lo bloqueará.
- **Caché**: imágenes, audio y fuentes, 1 año e inmutables. Si cambias el contenido de una imagen, **cambia su nombre**; con el mismo nombre los visitantes verían la versión antigua durante un año. HTML, JS, CSS y JSON se revalidan en cada visita (valor por defecto de las tres plataformas).
- **Probar `dist/` en local**: `node .claude/serve.mjs dist 5174` sirve la carpeta de publicación con las mismas cabeceras.
- **Servidor local** (`.claude/serve.mjs`): aplica las mismas cabeceras de `_headers`, así una infracción de la CSP aparece ya en desarrollo.
