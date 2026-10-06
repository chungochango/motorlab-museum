import { loadFont } from "@remotion/google-fonts/Inter";
import { Easing } from "remotion";

// Misma voz que el Hall del museo: Inter ligera sobre negro OLED, platino y un acento por coche
const { fontFamily } = loadFont("normal", { weights: ["200", "300", "400", "500"], subsets: ["latin", "latin-ext"] });

export const FONT = fontFamily;

export const C = {
  black: "#000000",
  white: "#f5f5f4",
  platinum: "#c9ccd1",
  grey: "#8b9097",
  greyDim: "#777c83",
  hairline: "rgba(255, 255, 255, 0.12)",
  neutral: "226, 228, 232",
  // hallAccent de cada sala en data/cars.json (R, G, B)
  f40: "212, 0, 0",
  temerario: "57, 255, 20",
  m3: "0, 102, 177",
  amber: "255, 176, 32",
};

// La curva del museo (--ease en engine/hall.css): salida exponencial suave
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.78, 0.2);

// Rótulo en mayúsculas espaciadas, como .topbar__meta y .hall__years
export const label = (size = 26): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: 500,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
});
