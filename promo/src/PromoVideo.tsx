import { AbsoluteFill, Sequence } from "remotion";
import { C, FONT } from "./theme";
import { Grain } from "./scenes/Grain";
import { Hook } from "./scenes/Hook";
import { Rooms } from "./scenes/Rooms";
import { Telemetry } from "./scenes/Telemetry";
import { CallToAction } from "./scenes/CallToAction";

export const PROMO = { fps: 30, width: 1080, height: 1920, durationInFrames: 450 };

/* Guion (30 fps, 15 s). Cada escena se solapa 8 fotogramas con la siguiente para
   fundirse sin cortes en negro:
     0–3 s    gancho: "El museo interactivo de ingeniería del motor"
     3–7 s    tres salas: F40, Temerario, M3 E30 con sus cifras
     7–11 s   zoom al despiece con telemetría: "MotorLab // Análisis puro"
     11–15 s  llamada a la acción: logotipo y URL */
const OVERLAP = 8;

export const PromoVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT, color: C.white }}>
    <Sequence from={0} durationInFrames={90 + OVERLAP} name="1 · Gancho">
      <Hook />
    </Sequence>
    <Sequence from={90} durationInFrames={120 + OVERLAP} name="2 · Salas">
      <Rooms />
    </Sequence>
    <Sequence from={210} durationInFrames={120 + OVERLAP} name="3 · Telemetría">
      <Telemetry />
    </Sequence>
    <Sequence from={330} durationInFrames={120} name="4 · Llamada a la acción">
      <CallToAction />
    </Sequence>
    <Grain />
  </AbsoluteFill>
);
