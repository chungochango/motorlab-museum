import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/* =========================================================
   Cursor de macOS con recorrido y clics
   ---------------------------------------------------------
   `path`: paradas { at, x, y, click? } en píxeles de la página
   (1440 × 900). Entre paradas el cursor viaja con un muelle,
   como una mano real (arranca rápido y frena suave); en cada
   clic se hunde un instante y suelta una onda.
   `scale` convierte píxeles de página a píxeles de pantalla.
   ========================================================= */
export type CursorStop = { at: number; x: number; y: number; click?: boolean };

export const Cursor: React.FC<{ path: CursorStop[]; scale: number; visibleFrom?: number; visibleTo?: number }> = ({ path, scale, visibleFrom = 0, visibleTo = Infinity }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < visibleFrom || f > visibleTo || !path.length) return null;

  // Tramo actual: de la parada anterior a la siguiente
  let x = path[0].x, y = path[0].y;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    if (f < a.at) break;
    const k = spring({ frame: f - a.at, fps, config: { damping: 26, stiffness: 90, mass: 0.9 }, durationInFrames: Math.max(8, b.at - a.at) });
    x = a.x + (b.x - a.x) * k;
    y = a.y + (b.y - a.y) * k;
  }
  // Clic: hundimiento breve + onda
  const click = [...path].reverse().find((p) => p.click && f >= p.at && f < p.at + 18);
  const press = click ? interpolate(f - click.at, [0, 3, 8], [1, 0.82, 1], { extrapolateRight: "clamp" }) : 1;
  const ring = click ? interpolate(f - click.at, [0, 16], [0, 1], { extrapolateRight: "clamp" }) : 0;
  const fade = interpolate(f, [visibleFrom, visibleFrom + 6], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: x * scale, top: y * scale, pointerEvents: "none", opacity: fade, zIndex: 10 }}>
      {click ? (
        <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.9)", transform: `scale(${0.4 + ring * 1.4})`, opacity: 1 - ring }} />
      ) : null}
      <svg width="26" height="34" viewBox="0 0 26 34" style={{ position: "absolute", left: -3, top: -2, transform: `scale(${press})`, transformOrigin: "3px 2px", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" }}>
        <path d="M3 2 L3 26 L9.2 20.4 L13.2 30 L17.4 28.2 L13.4 18.8 L21.6 18.8 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
