// Imagens de divulgação em publicacao/imagens/ (rode depois de `npm run verify -- <url> publicacao/.capturas`).
import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
import { projects } from '../src/data/projects.js';

const OUT = 'publicacao/imagens';
await copyFile('publicacao/.capturas/desktop-hero.png', `${OUT}/captura-inicial.png`);
await sharp('publicacao/.capturas/mobile-hero.png').toFile(`${OUT}/captura-mobile.png`);

// Destaque dos projetos — 1200x1500 (formato retrato, bom para o feed do LinkedIn)
const W = 1200, H = 1500, PAD = 72, SHOT_W = 540, SHOT_H = 338;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = projects.slice(0, 3);
const rowTop = (i) => 330 + i * 380;

const text = rows
  .map((p, i) => {
    const y = rowTop(i);
    const stack = p.stack.slice(0, 3).join(' · ');
    const words = p.summary.split(' ');
    const lines = [''];
    for (const w of words) ((lines.at(-1) + ' ' + w).length > 32 ? lines.push(w) : (lines[lines.length - 1] = (lines.at(-1) + ' ' + w).trim()));
    return `
    <text x="${PAD}" y="${y + 28}" font-family="Consolas, monospace" font-size="22" fill="#ff6a13">0${i + 1}</text>
    <text x="${PAD}" y="${y + 74}" font-family="Segoe UI, Arial" font-weight="700" font-size="30" fill="#f4ede4">${esc(p.name)}</text>
    ${lines.slice(0, 4).map((l, j) => `<text x="${PAD}" y="${y + 120 + j * 32}" font-family="Segoe UI, Arial" font-size="22" fill="#b9ab9c">${esc(l)}</text>`).join('')}
    <text x="${PAD}" y="${y + 270}" font-family="Consolas, monospace" font-size="20" fill="#ff8a3d">${esc(stack)}</text>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0d0b0a"/>
  <circle cx="${W}" cy="${H}" r="620" fill="#ff6a13" opacity="0.08"/>
  <rect x="${PAD}" y="96" width="44" height="6" fill="#ff6a13"/>
  <text x="${PAD}" y="170" font-family="Segoe UI, Arial" font-weight="800" font-size="56" fill="#f4ede4">Ferramentas que nasceram</text>
  <text x="${PAD}" y="236" font-family="Segoe UI, Arial" font-weight="800" font-size="56" fill="#ff6a13">do suporte.</text>
  ${text}
  <text x="${PAD}" y="${H - 56}" font-family="Segoe UI, Arial" font-weight="800" font-size="28" fill="#f4ede4">KELVIN<tspan fill="#ff6a13">.DEV</tspan></text>
  <text x="${W - PAD}" y="${H - 56}" text-anchor="end" font-family="Consolas, monospace" font-size="22" fill="#b9ab9c">kelvin-garcia.netlify.app</text>
</svg>`;

const shots = await Promise.all(
  rows.map(async (p, i) => {
    const img = await sharp(`assets-src/shot-${p.image}.png`).resize(SHOT_W, SHOT_H, { fit: 'cover', position: 'left top' }).toBuffer();
    const frame = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SHOT_W}" height="${SHOT_H}"><rect x="1" y="1" width="${SHOT_W - 2}" height="${SHOT_H - 2}" rx="12" fill="none" stroke="#3a2f28" stroke-width="2"/></svg>`);
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SHOT_W}" height="${SHOT_H}"><rect width="${SHOT_W}" height="${SHOT_H}" rx="12"/></svg>`);
    const rounded = await sharp(img).composite([{ input: mask, blend: 'dest-in' }, { input: frame }]).png().toBuffer();
    return { input: rounded, left: W - PAD - SHOT_W, top: rowTop(i) - 10 };
  }),
);
const accents = rows.map((_, i) => ({
  input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SHOT_W}" height="${SHOT_H}"><rect width="${SHOT_W}" height="${SHOT_H}" rx="12" fill="#ff6a13" opacity="0.28"/></svg>`),
  left: W - PAD - SHOT_W + 10,
  top: rowTop(i),
}));

await sharp(Buffer.from(svg)).composite([...accents, ...shots]).png().toFile(`${OUT}/projetos-destaque.png`);
console.log('Imagens de divulgação geradas.');
