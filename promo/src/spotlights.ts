import type { CarSpotlightProps } from "./CarSpotlight";

/* Serie "Car Spotlight": un vídeo por sala. Cada entrada se registra en Root.tsx como
   la composición `Spotlight-<slug>` y se renderiza con:
     npx remotion render src/index.ts Spotlight-<slug> out/spotlight-<slug>.mp4
   Las cifras son las oficiales de data/cars.json; la imagen se copia a promo/public/img.
   camera: foco (x, y en % de la foto) y acercamiento de la apertura y de cada métrica. */
export const SPOTLIGHTS: Record<string, CarSpotlightProps> = {
  f40: {
    name: "Ferrari F40",
    room: "Sala 01",
    years: "1987 — 1992",
    metrics: [
      { value: 478, unit: "CV", label: "V8 biturbo de 2.936 cc" },
      { value: 324, unit: "km/h", label: "Velocidad máxima" },
      { value: 1100, unit: "kg", label: "En seco: chasis tubular, kevlar y carbono" },
    ],
    accent: "#D40000",
    image: "img/f40-perfil.webp",
    imageAspect: 1536 / 1024,
    camera: {
      open: { x: 50, y: 46, zoom: 1.06 },   // de perfil el F40 es muy largo: entero en el encuadre vertical
      metrics: [
        { x: 84, y: 44, zoom: 2.6 },      // rejillas del capó trasero: debajo, el V8 biturbo
        { x: 14, y: 52, zoom: 2.5 },      // morro afilado: la cifra de la velocidad punta
        { x: 50, y: 48, zoom: 1.9 },      // costado entero: la carrocería ligera
      ],
    },
    url: "motorlabmuseum.com/f40",
    durationInSeconds: 12,
  },
  temerario: {
    name: "Lamborghini Temerario",
    room: "Sala 06",
    years: "2025",
    metrics: [
      { value: "V8 4.0", label: "Biturbo, en posición central trasera" },
      { value: 10000, unit: "rpm", label: "Régimen máximo del V8" },
      { value: 920, unit: "CV", label: "Combinados: V8 y tres motores eléctricos" },
    ],
    accent: "#39FF14",
    image: "img/temerario-hero.jpg",
    imageAspect: 1536 / 1024,
    camera: {
      open: { x: 50, y: 50, zoom: 1.32 },
      metrics: [
        { x: 15, y: 44, zoom: 2.9 },      // toma de aire lateral: por ahí respira el V8
        { x: 28, y: 58, zoom: 2.7 },      // rueda y pinza: las vueltas del motor llegan al suelo
        { x: 60, y: 56, zoom: 2.1 },      // frontal con los hexágonos de luz
      ],
    },
    url: "motorlabmuseum.com/temerario",
    durationInSeconds: 12,
  },
};
