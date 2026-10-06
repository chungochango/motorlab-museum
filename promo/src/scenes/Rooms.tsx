import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, EASE, EASE_IN, label } from "../theme";

/* Escena 2 (3–7 s) · Tres salas
   Cada coche entra con un barrido lateral (desenfoque de movimiento según su
   velocidad), enciende el suelo con el color de su sala y sus tres cifras cuentan
   hasta el valor oficial. Datos de data/cars.json. */
type Spec = { value: number; unit: string; label: string };
type Room = { room: string; name: string; badge?: string; years: string; img: string; ar: number; accent: string; specs: Spec[] };

const ROOMS: Room[] = [
  {
    room: "Sala 01", name: "Ferrari F40", years: "1987 — 1992", img: "img/f40-perfil.webp", ar: 1536 / 1024, accent: C.f40,
    specs: [
      { value: 478, unit: "CV", label: "V8 biturbo" },
      { value: 324, unit: "km/h", label: "Vel. máxima" },
      { value: 1100, unit: "kg", label: "En seco" },
    ],
  },
  {
    room: "Sala 06", name: "Lamborghini Temerario", years: "2025", img: "img/temerario-perfil.jpg", ar: 1774 / 887, accent: C.temerario,
    specs: [
      { value: 920, unit: "CV", label: "Híbrido combinado" },
      { value: 10000, unit: "rpm", label: "V8 biturbo" },
      { value: 343, unit: "km/h", label: "Vel. máxima" },
    ],
  },
  {
    room: "Sala 04", name: "BMW M3 E30", badge: "Sport Evolution", years: "1986 — 1991", img: "img/m3-perfil.jpg", ar: 1536 / 1024, accent: C.m3,
    specs: [
      { value: 238, unit: "CV", label: "S14 atmosférico" },
      { value: 248, unit: "km/h", label: "Vel. máxima" },
      { value: 1200, unit: "kg", label: "Calle" },
    ],
  },
];

const SLOT = 40;          // fotogramas por coche
// Punto de millar también en cifras de 4 dígitos (es-ES no agrupa 1100): "1.100 kg", "10.000 rpm"
const num = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const Car: React.FC<{ r: Room; f: number; last: boolean }> = ({ r, f, last }) => {
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // Entrada con muelle desde la derecha; salida acelerando hacia la izquierda
  const enter = spring({ frame: f, fps, config: { damping: 22, stiffness: 140, mass: 0.8 } });
  const leave = last ? 0 : interpolate(f, [SLOT - 8, SLOT + 4], [0, 1], { ...clamp, easing: EASE_IN });
  const x = (1 - enter) * 1150 - leave * 1300;
  const speed = Math.abs((1 - enter) * 1150 - (1 - spring({ frame: f - 1, fps, config: { damping: 22, stiffness: 140, mass: 0.8 } })) * 1150) + leave * 80;
  const blur = Math.min(18, speed * 0.35);

  const floor = interpolate(f, [6, 20], [0, 1], { ...clamp, easing: EASE }) * (1 - leave);
  const text = (d: number) => interpolate(f, [d, d + 12], [0, 1], { ...clamp, easing: EASE });
  const textOut = 1 - interpolate(f, [SLOT - 6, SLOT], [0, 1], clamp) * (last ? 0 : 1);
  const count = interpolate(f, [8, 30], [0, 1], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill>
      {/* Coche con su suelo encendido */}
      <div style={{ position: "absolute", left: "50%", top: 500, width: 1040, marginLeft: -520, transform: `translateX(${x}px)`, filter: `blur(${blur}px)` }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: `${r.ar}` }}>
          <div
            style={{
              position: "absolute", left: "5%", right: "5%", bottom: "-4%", height: "40%", opacity: floor, mixBlendMode: "screen",
              background: `radial-gradient(ellipse 50% 55% at 50% 50%, rgba(${r.accent},0.32), rgba(${r.accent},0) 72%)`,
            }}
          />
          <Img src={staticFile(r.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 92%, #000 100%), linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 78%, #000 100%)" }} />
        </div>
      </div>

      {/* Ficha */}
      <div style={{ position: "absolute", left: 96, right: 96, top: 1180, opacity: textOut }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, ...label(24), color: C.platinum, opacity: text(4), transform: `translateY(${(1 - text(4)) * 16}px)` }}>
          <span style={{ width: 54, height: 2, background: `rgb(${r.accent})` }} />
          {r.room} · {r.years}
        </div>
        <div style={{ marginTop: 26, fontSize: 104, fontWeight: 200, lineHeight: 1.02, letterSpacing: "-0.02em", opacity: text(6), transform: `translateY(${(1 - text(6)) * 24}px)` }}>
          {r.name}
          {r.badge ? <span style={{ display: "block", fontSize: 44, fontWeight: 300, color: C.grey, letterSpacing: 0, marginTop: 6 }}>{r.badge}</span> : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", marginTop: 54, borderTop: `1px solid ${C.hairline}` }}>
          {r.specs.map((s, i) => (
            <div key={s.label} style={{ padding: "26px 0 0 0", paddingLeft: i ? 24 : 0, borderLeft: i ? `1px solid ${C.hairline}` : "none", opacity: text(10 + i * 3) }}>
              <div style={{ fontSize: 50, fontWeight: 300, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {num(s.value * count)}
                <span style={{ fontSize: 24, color: C.grey, marginLeft: 6 }}>{s.unit}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 26, color: C.greyDim }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Rooms: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <div style={{ position: "absolute", top: 150, left: 96, ...label(24), color: C.grey }}>
        Las salas
      </div>
      {ROOMS.map((r, i) => {
        const f = frame - i * SLOT;
        if (f < -2 || f > SLOT + 6 + (i === ROOMS.length - 1 ? 60 : 0)) return null;
        return <Car key={r.name} r={r} f={f} last={i === ROOMS.length - 1} />;
      })}
    </AbsoluteFill>
  );
};
