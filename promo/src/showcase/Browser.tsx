import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";

/* =========================================================
   Navegador dentro de la pantalla del portátil
   ---------------------------------------------------------
   Barra de Safari (semáforo, URL) y la página: capturas reales
   del museo (promo/scripts/capturas.mjs) encadenadas en el tiempo.
     · "nav":    cambio de página (fundido breve con barra de carga)
     · "scroll": la página anterior sube y la nueva entra por abajo
   La URL puede teclearse (`typing`) antes de cargar una página.
   ========================================================= */
export type Page = { at: number; src: string; url: string; via?: "nav" | "scroll" };

const T = 12;                       // duración de la transición (fotogramas)

export const BAR_RATIO = 0.052;     // alto de la barra respecto al ancho de la pantalla

export const Browser: React.FC<{
  width: number; height: number; pages: Page[];
  typing?: { from: number; to: number; text: string };
  children?: React.ReactNode;       // capas sobre la página (cursor), en coordenadas de la página
}> = ({ width, height, pages, typing, children }) => {
  const f = useCurrentFrame();
  const bar = Math.round(width * BAR_RATIO);
  const pageH = height - bar;
  let i = 0;
  pages.forEach((p, k) => { if (f >= p.at) i = k; });
  const cur = pages[i], prev = pages[i - 1];
  const p = interpolate(f - cur.at, [0, T], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const moving = prev && p < 1;
  const scroll = cur.via === "scroll";

  // URL: mientras se teclea (hasta que carga la página siguiente), el texto a medio escribir
  const loadsAt = typing ? pages.find((x) => x.at > typing.from)?.at ?? Infinity : Infinity;
  const isTyping = !!typing && f >= typing.from && f < loadsAt;
  const url = isTyping
    ? typing!.text.slice(0, Math.floor(interpolate(f, [typing!.from, typing!.to], [0, typing!.text.length], { extrapolateRight: "clamp" })))
    : `motorlabmuseum.com${cur.url === "/" ? "" : cur.url}`;
  const loading = !scroll && moving ? p : 0;

  // Captura anclada arriba: así las coordenadas de clic de tomas.json caen en su sitio
  const img = (src: string, style: React.CSSProperties) => (
    <Img src={staticFile(src)} style={{ position: "absolute", left: 0, width, height: pageH, objectFit: "cover", objectPosition: "top", ...style }} />
  );

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", fontFamily: "-apple-system, 'SF Pro Text', Inter, sans-serif" }}>
      {/* Barra del navegador */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: "linear-gradient(180deg, #2a2b2e, #222326)", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: bar * 0.28, padding: `0 ${bar * 0.4}px` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: bar * 0.26, height: bar * 0.26, borderRadius: "50%", background: c }} />)}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "52%", height: bar * 0.6, borderRadius: bar * 0.16, background: isTyping ? "#3a3c40" : "#333438", boxShadow: isTyping ? "0 0 0 2px rgba(10,132,255,0.8)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#e8e8ea", fontSize: bar * 0.3, overflow: "hidden" }}>
            <svg width={bar * 0.24} height={bar * 0.28} viewBox="0 0 10 12" fill="none" stroke="#9a9ca1" strokeWidth="1.3"><rect x="1.5" y="5" width="7" height="6" rx="1" /><path d="M3 5V3.5a2 2 0 0 1 4 0V5" /></svg>
            <span>{url}{isTyping ? <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0 }}>|</span> : null}</span>
            {/* Barra de carga */}
            {loading > 0 ? <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${loading * 100}%`, background: "#0a84ff" }} /> : null}
          </div>
        </div>
        <span style={{ width: bar * 1.1 }} />
      </div>

      {/* Página */}
      <div style={{ position: "absolute", left: 0, top: bar, width, height: pageH, overflow: "hidden" }}>
        {moving && scroll ? (
          <>
            {img(prev.src, { top: -p * pageH })}
            {img(cur.src, { top: (1 - p) * pageH })}
          </>
        ) : moving ? (
          <>
            {img(prev.src, { top: 0, opacity: 1 - p })}
            {img(cur.src, { top: 0, opacity: p, transform: `scale(${1.02 - 0.02 * p})` })}
          </>
        ) : (
          img(cur.src, { top: 0 })
        )}
        {children}
      </div>
    </div>
  );
};
