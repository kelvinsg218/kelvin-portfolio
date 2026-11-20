// Gera as imagens otimizadas do site a partir de assets-src/.
// Uso: npm run assets  (só precisa rodar quando uma imagem de origem mudar)
import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => path.join(root, 'assets-src', f);
const out = (f) => path.join(root, 'public', f);

await mkdir(out('img/projects'), { recursive: true });

// 1. Ilustração principal (1672x941) em larguras responsivas, sem distorção.
const HERO_WIDTHS = [640, 960, 1280, 1672];
for (const w of HERO_WIDTHS) {
  const base = sharp(src('hero-ilustracao.png')).resize({ width: w });
  await base.clone().avif({ quality: 52, effort: 6 }).toFile(out(`img/hero-${w}.avif`));
  await base.clone().webp({ quality: 78 }).toFile(out(`img/hero-${w}.webp`));
}
await sharp(src('hero-ilustracao.png')).resize({ width: 1280 }).jpeg({ quality: 80, mozjpeg: true }).toFile(out('img/hero-1280.jpg'));
// Placeholder minúsculo para o blur-up enquanto a imagem carrega.
const lqip = await sharp(src('hero-ilustracao.png')).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();
await writeFile(out('img/hero-lqip.txt'), `data:image/webp;base64,${lqip.toString('base64')}`);

// 2. Capturas dos projetos (vindas dos READMEs dos próprios repositórios).
for (const id of ['flowrix', 'wma', 'phm', 'pat', 'zentra']) {
  for (const w of [640, 1200]) {
    await sharp(src(`shot-${id}.png`))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out(`img/projects/${id}-${w}.webp`));
  }
}

// 2b. FLOWRIX: galeria (miniatura + ampliada) e símbolo da marca, a partir das capturas reais do repositório.
const FLOWRIX_GALLERY = {
  'flowrix-landing': 'landing-desktop.png',
  'flowrix-dashboard': 'dashboard-desktop.png',
  'flowrix-execucao': 'execution-detail-desktop.png',
  'flowrix-falha': 'editor-failed-desktop.png',
};
for (const [name, file] of Object.entries(FLOWRIX_GALLERY)) {
  const input = src(`flowrix/${file}`);
  await sharp(input).resize({ width: 480 }).webp({ quality: 74 }).toFile(out(`img/projects/${name}-480.webp`));
  await sharp(input).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82 }).toFile(out(`img/projects/${name}-1440.webp`));
}
await copyFile(src('flowrix/flowrix-symbol.svg'), out('img/projects/flowrix-symbol.svg'));
// 2c. ZENTRA: símbolo da marca (a estrela), do repositório do próprio projeto.
await copyFile(src('zentra/zentra-simbolo.svg'), out('img/projects/zentra-simbolo.svg'));

// 3. Favicon: monograma "K" com cursor laranja.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0d0b0a"/>
  <path d="M18 14v36M18 33l17-19M24 27l13 23" stroke="#f4ede4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="42" y="44" width="11" height="6" rx="1.5" fill="#ff6a13"/>
</svg>`;
await writeFile(out('favicon.svg'), faviconSvg);
await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(out('favicon-32.png'));
await sharp(Buffer.from(faviconSvg)).resize(180, 180).flatten({ background: '#0d0b0a' }).png().toFile(out('apple-touch-icon.png'));
await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(out('icon-512.png'));

// 4. Imagem Open Graph (1200x630) para LinkedIn e outras redes.
await mkdir(path.join(root, 'publicacao', 'imagens'), { recursive: true });
const og = await composeBanner(1200, 630, {
  title: 'KELVIN.DEV',
  line1: 'Da resolução de problemas',
  line2: 'à criação de soluções.',
  footer: 'Kelvin Garcia — Creative Developer Portfolio',
});
await sharp(og).jpeg({ quality: 86, mozjpeg: true }).toFile(out('og-image.jpg'));
await sharp(og).png().toFile(path.join(root, 'publicacao', 'imagens', 'og-preview.png'));

// 5. Capa do LinkedIn (1584x396).
const cover = await composeBanner(1584, 396, {
  title: 'KELVIN.DEV',
  line1: 'Suporte de TI · Implantação · Desenvolvimento',
  line2: '',
  footer: 'kelvin-garcia.netlify.app  ·  github.com/kelvinsg218',
  compact: true,
});
await sharp(cover).png().toFile(path.join(root, 'publicacao', 'imagens', 'linkedin-capa.png'));

console.log('Assets gerados.');

// Ilustração ancorada à direita + texto em SVG sobre a área escura à esquerda.
async function composeBanner(W, H, { title, line1, line2, footer, compact = false }) {
  const meta = await sharp(src('hero-ilustracao.png')).metadata();
  const scale = H / meta.height;
  const imgW = Math.round(meta.width * scale);
  const art = await sharp(src('hero-ilustracao.png')).resize({ height: H }).toBuffer();
  const left = W - imgW;
  const pad = compact ? 400 : 72; // capa: livra a área da foto de perfil do LinkedIn
  const t = compact ? 64 : 92;
  const l = compact ? 26 : 44;
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0" stop-color="#0d0b0a" stop-opacity="1"/>
        <stop offset="${compact ? 0.42 : 0.38}" stop-color="#0d0b0a" stop-opacity="0.92"/>
        <stop offset="${compact ? 0.62 : 0.6}" stop-color="#0d0b0a" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="${pad}" y="${compact ? 70 : 96}" width="44" height="6" fill="#ff6a13"/>
    <text x="${pad}" y="${compact ? 150 : 200}" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="${t}" fill="#f4ede4" letter-spacing="2">${title.replace('.DEV', '')}<tspan fill="#ff6a13">.DEV</tspan></text>
    <text x="${pad}" y="${compact ? 205 : 290}" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="${l}" fill="#f4ede4">${line1}</text>
    ${line2 ? `<text x="${pad}" y="${compact ? 245 : 345}" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="${l}" fill="#ff8a3d">${line2}</text>` : ''}
    <text x="${pad}" y="${H - (compact ? 60 : 72)}" font-family="Consolas, monospace" font-size="${compact ? 20 : 24}" fill="#b9ab9c">${footer}</text>
  </svg>`;
  return sharp({ create: { width: W, height: H, channels: 3, background: '#0d0b0a' } })
    .composite([
      { input: art, left: Math.max(left, 0), top: 0 },
      { input: Buffer.from(overlay), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}
