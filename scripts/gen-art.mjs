// Génère des œuvres SVG abstraites pour les données de démonstration.
// Usage : node scripts/gen-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "art");
mkdirSync(join(OUT, "avatars"), { recursive: true });

// Palette Zit'art : terre, encre, touches de rouge/orange
const PALETTES = [
  ["#1c1714", "#b5654a", "#e8dfd2", "#c75b2a", "#8e3b2f"],
  ["#2a211c", "#d9a05b", "#f4efe8", "#a0522d", "#5c4033"],
  ["#171310", "#c75b2a", "#e8dfd2", "#7a4a2b", "#3d2b1f"],
  ["#201a16", "#8e3b2f", "#d9a05b", "#e8dfd2", "#4a2c22"],
];

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gradientDefs(id, colors, rand) {
  const angle = Math.floor(rand() * 360);
  const stops = colors
    .map((c, i) => {
      const off = Math.floor((i / (colors.length - 1)) * 100);
      return `<stop offset="${off}%" stop-color="${c}"/>`;
    })
    .join("");
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${angle})">${stops}</linearGradient>`;
}

function circle(cx, cy, r, fill, opacity = 1, extra = "") {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" ${extra}/>`;
}

function rect(x, y, w, h, fill, opacity = 1, extra = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}" ${extra}/>`;
}

function poly(points, fill, opacity = 1, extra = "") {
  return `<polygon points="${points}" fill="${fill}" opacity="${opacity}" ${extra}/>`;
}

function line(x1, y1, x2, y2, stroke, sw, opacity = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}"/>`;
}

const STYLES = ["totem", "orbites", "trames", "dunes", "constellation", "calligraphie"];

function artworkSVG(seed, style) {
  const rand = mulberry32(seed);
  const pal = PALETTES[Math.floor(rand() * PALETTES.length)];
  const [bg, a, b, c, d] = pal;
  const W = 1200, H = 1500;
  let shapes = "";

  shapes += rect(0, 0, W, H, bg);
  // texture grain subtile
  for (let i = 0; i < 40; i++) {
    shapes += circle(rand() * W, rand() * H, 1 + rand() * 2.5, b, 0.05 + rand() * 0.08);
  }

  switch (style) {
    case "totem": {
      const cols = 3 + Math.floor(rand() * 2);
      for (let i = 0; i < cols; i++) {
        const x = 140 + i * ((W - 280) / (cols - 1)) + (rand() - 0.5) * 60;
        const w = 90 + rand() * 120;
        const h = 500 + rand() * 500;
        const y = H - 160 - h;
        shapes += rect(x - w / 2, y, w, h, i % 2 ? a : d, 0.92, `rx="${w * 0.18}"`);
        shapes += circle(x, y + 90, w * 0.28, b, 0.9);
        shapes += rect(x - w * 0.32, y + h * 0.35, w * 0.64, h * 0.1, c, 0.85);
        shapes += rect(x - w * 0.32, y + h * 0.62, w * 0.64, h * 0.1, c, 0.85);
        if (rand() > 0.5) shapes += circle(x, y + h * 0.8, w * 0.2, b, 0.8);
      }
      break;
    }
    case "orbites": {
      const cx = W / 2 + (rand() - 0.5) * 300;
      const cy = H / 2 + (rand() - 0.5) * 300;
      for (let i = 0; i < 9; i++) {
        const r = 60 + i * (55 + rand() * 40);
        shapes += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * (0.4 + rand() * 0.5)}" fill="none" stroke="${[a, b, c, d][i % 4]}" stroke-width="${4 + rand() * 14}" opacity="${0.25 + rand() * 0.6}" transform="rotate(${rand() * 180} ${cx} ${cy})"/>`;
      }
      shapes += circle(cx, cy, 40 + rand() * 60, d);
      shapes += circle(cx + 200, cy - 250, 26 + rand() * 30, a, 0.9);
      shapes += circle(cx - 260, cy + 200, 18 + rand() * 24, b, 0.9);
      break;
    }
    case "trames": {
      const n = 4 + Math.floor(rand() * 4);
      for (let i = 0; i < n; i++) {
        const x = rand() * W;
        const y = rand() * H;
        const w = 200 + rand() * 500;
        const h = 150 + rand() * 400;
        const fill = [a, b, c, d][Math.floor(rand() * 4)];
        const opacity = 0.35 + rand() * 0.55;
        const shape = rand();
        if (shape < 0.4) shapes += rect(x, y, w, h, fill, opacity, `rx="${rand() * 40}"`);
        else if (shape < 0.7) shapes += circle(x + w / 2, y + h / 2, Math.min(w, h) / 2, fill, opacity);
        else shapes += poly(`${x},${y} ${x + w},${y + rand() * h} ${x + rand() * w},${y + h}`, fill, opacity);
      }
      // filet éditorial
      shapes += line(120, H - 120, W - 120, H - 120, b, 3, 0.6);
      shapes += line(120, H - 100, 120 + 160, H - 100, d, 6, 0.9);
      break;
    }
    case "dunes": {
      for (let i = 0; i < 7; i++) {
        const yBase = H * 0.25 + i * (H * 0.11);
        const amp = 60 + rand() * 140;
        const freq = 0.004 + rand() * 0.004;
        const phase = rand() * 1000;
        let pts = `0,${H} 0,${yBase}`;
        for (let x = 0; x <= W; x += 40) {
          pts += ` ${x},${yBase + Math.sin(x * freq + phase) * amp}`;
        }
        pts += ` ${W},${H}`;
        shapes += poly(pts, [a, b, c, d, bg][i % 5], 0.55 + rand() * 0.4);
      }
      shapes += circle(W * 0.7, H * 0.22, 90 + rand() * 60, d, 0.95);
      break;
    }
    case "constellation": {
      const pts = [];
      for (let i = 0; i < 26; i++) pts.push([80 + rand() * (W - 160), 100 + rand() * (H - 200)]);
      for (let i = 0; i < pts.length - 1; i++) {
        if (rand() > 0.55) {
          const [x1, y1] = pts[i];
          const [x2, y2] = pts[i + 1];
          shapes += line(x1, y1, x2, y2, [a, b][i % 2], 1.5, 0.35);
        }
      }
      pts.forEach(([x, y], i) => {
        const col = [a, b, c, d][i % 4];
        shapes += circle(x, y, 4 + rand() * 16, col, 0.85);
        if (i % 5 === 0) shapes += `<circle cx="${x}" cy="${y}" r="${30 + rand() * 40}" fill="none" stroke="${col}" stroke-width="2" opacity="0.4"/>`;
      });
      shapes += circle(W / 2, H * 0.75, 180, a, 0.85);
      shapes += circle(W / 2 - 60, H * 0.75 - 60, 60, d, 0.9);
      break;
    }
    default: {
      // calligraphie : coupures horizontales inspirées des tissages
      const rows = 8 + Math.floor(rand() * 8);
      for (let i = 0; i < rows; i++) {
        const y = (i / rows) * H + (rand() - 0.5) * 30;
        const h = 14 + rand() * 60;
        const x0 = rand() * W * 0.4;
        const x1 = W * 0.4 + rand() * W * 0.6;
        shapes += rect(x0, y, x1 - x0, h, [a, b, c, d, bg][Math.floor(rand() * 5)], 0.3 + rand() * 0.6, `rx="${h / 2}"`);
      }
      shapes += circle(W * 0.5, H * 0.4, 140 + rand() * 120, d, 0.9);
      shapes += circle(W * 0.5, H * 0.4, 200 + rand() * 100, "none", 1, `stroke="${a}" stroke-width="3" opacity="0.7"`);
    }
  }

  // signature abstraite en bas à droite
  shapes += `<text x="${W - 90}" y="${H - 70}" font-family="Georgia, serif" font-size="34" fill="${b}" opacity="0.8" font-style="italic">zit'art</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${shapes}</svg>`;
}

function avatarSVG(seed) {
  const rand = mulberry32(seed);
  const pal = PALETTES[Math.floor(rand() * PALETTES.length)];
  const [bg, a, b, c, d] = pal;
  const S = 600;
  const shapes = [];
  shapes.push(rect(0, 0, S, S, bg));
  shapes.push(circle(S / 2, S / 2, S * 0.34, a, 0.95));
  shapes.push(circle(S / 2, S / 2 - S * 0.05, S * 0.16, b, 0.95));
  shapes.push(circle(S / 2, S * 0.78, S * 0.4, c, 0.8));
  shapes.push(`<path d="M ${S * 0.1} ${S * 0.9} Q ${S * 0.5} ${S * (0.55 + rand() * 0.2)} ${S * 0.9} ${S * 0.85}" stroke="${b}" stroke-width="18" fill="none" opacity="0.7"/>`);
  shapes.push(circle(S * 0.78, S * 0.24, 26, d, 0.9));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${shapes.join("")}</svg>`;
}

// --- Génération des œuvres ---
const artworkFiles = [];
const count = 36;
for (let i = 0; i < count; i++) {
  const name = `oeuvre-${String(i + 1).padStart(2, "0")}.svg`;
  writeFileSync(join(OUT, name), artworkSVG(1000 + i * 77, STYLES[i % STYLES.length]));
  artworkFiles.push(`/art/${name}`);
}

// --- Avatars ---
for (let i = 0; i < 8; i++) {
  writeFileSync(join(OUT, "avatars", `avatar-${i + 1}.svg`), avatarSVG(5000 + i * 131));
}

// --- Images d'événements ---
for (let i = 0; i < 6; i++) {
  const name = `evenement-${i + 1}.svg`;
  writeFileSync(join(OUT, name), artworkSVG(9000 + i * 211, STYLES[(i + 2) % STYLES.length]));
}

console.log(`Généré : ${artworkFiles.length} œuvres, 8 avatars, 6 événements dans public/art/`);
