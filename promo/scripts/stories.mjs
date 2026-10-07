// Renderiza las Stories de todas las salas (src/StoryRoom.tsx) a 4K en out/story-<slug>.png.
// Uso: npm run stories            (todas)
//      npm run stories -- f40 m3  (sólo esas)
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const all = [...readFileSync("src/StoryRoom.tsx", "utf8").matchAll(/^  "?([\w-]+)"?: \{\n    room:/gm)].map((m) => m[1]);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : all;
for (const slug of slugs) {
  execSync(`npx remotion still src/index.ts Story-${slug} out/story-${slug}.png --scale=2`, { stdio: "inherit" });
}
