// Verificação de ponta a ponta com Chromium (playwright-core; instale com: npx playwright-core install chromium-headless-shell).
// Uso: node scripts/verify.mjs [url] [pasta-de-capturas]
// Checa: erros de console, imagens quebradas, links internos, metadados, rolagem
// horizontal em mobile, terminal e capturas de tela em desktop e mobile.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] || 'http://localhost:4173/';
const outDir = process.argv[3] || 'verify-shots';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const viewports = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'tablet', width: 820, height: 1180, isMobile: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.isMobile ? 2 : 1,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  const ignored = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const src = m.location()?.url || '';
    // Conhecidos e esperados: limite da API pública do GitHub (o site usa o fallback)
    // e o HUD que o Netlify injeta, bloqueado pela CSP do site.
    if (src.includes('api.github.com')) return ignored.push('GitHub API indisponível/limitada (fallback ativo)');
    if (src.includes('/.netlify/scripts/hud') || (src === 'about:srcdoc' && m.text().includes('Content Security Policy')))
      return ignored.push('Netlify HUD bloqueado pela CSP');
    errors.push(`${m.text()} @ ${src}`);
  });
  page.on('pageerror', (e) => errors.push(e.message));
  const failed = [];
  page.on('response', (r) => r.status() >= 400 && !r.url().includes('api.github.com') && failed.push(`${r.status()} ${r.url()}`));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${outDir}/${vp.name}-hero.png` });

  // rola até o fim para disparar as revelações e o lazy-loading
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1200);

  const broken = await page.$$eval('img', (imgs) =>
    imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  check(`[${vp.name}] imagens carregadas`, broken.length === 0, broken.join(', '));
  check(`[${vp.name}] sem respostas 4xx/5xx`, failed.length === 0, failed.join(', '));
  check(`[${vp.name}] sem erros de console`, errors.length === 0, errors.join(' | ') || [...new Set(ignored)].map((i) => `ignorado: ${i}`).join('; '));

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`[${vp.name}] sem rolagem horizontal`, overflow <= 0, `excesso ${overflow}px`);

  const heroImg = await page.$eval('.hero__art img', (i) => ({ w: i.naturalWidth, h: i.naturalHeight, fit: getComputedStyle(i).objectFit }));
  check(`[${vp.name}] ilustração sem distorção (object-fit: cover)`, heroImg.fit === 'cover' && heroImg.w > 0, JSON.stringify(heroImg));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/${vp.name}-full.png`, fullPage: true });

  if (vp.name === 'desktop') {
    const anchors = await page.$$eval('a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => h.length > 1));
    const missing = [];
    for (const h of new Set(anchors)) if (!(await page.$(h))) missing.push(h);
    check('links internos apontam para seções existentes', missing.length === 0, missing.join(', '));

    const meta = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name=description]')?.content,
      og: document.querySelector('meta[property="og:image"]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      icon: document.querySelector('link[rel=icon]')?.href,
    }));
    check('metadados SEO/Open Graph presentes', Object.values(meta).every(Boolean), JSON.stringify(meta));

    const ogRes = await page.request.get(new URL('/og-image.jpg', url).href);
    check('og-image.jpg acessível', ogRes.ok(), String(ogRes.status()));

    const external = await page.$$eval('a[href^="http"], a[href^="mailto:"]', (as) => [...new Set(as.map((a) => a.href))]);
    for (const href of external) {
      if (href.startsWith('mailto:')) {
        check(`mailto válido: ${href}`, /^mailto:[^@\s]+@[^@\s]+\.\w+$/.test(href));
        continue;
      }
      if (href.includes('/kelvin-portfolio')) continue; // o próprio repositório pode ainda não existir
      let status = 0;
      try {
        status = (await page.request.get(href, { maxRedirects: 5, timeout: 20000 })).status();
      } catch (e) {
        status = String(e.message).slice(0, 60);
      }
      check(`link externo ${href}`, status === 200, String(status));
    }

    await page.fill('[data-term-input]', 'projetos');
    await page.press('[data-term-input]', 'Enter');
    const termText = await page.textContent('[data-term-out]');
    check('terminal responde ao comando "projetos"', termText.includes('Peripheral Asset Tracker'));
  }

  if (vp.name === 'mobile') {
    await page.click('[data-menu-toggle]');
    await page.waitForTimeout(300);
    const visible = await page.isVisible('#menu a[href="#projetos"]');
    check('[mobile] menu abre e mostra links', visible);
  }
  await ctx.close();
}

await browser.close();
const failedCount = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failedCount}/${results.length} verificações passaram.`);
process.exit(failedCount ? 1 : 0);
