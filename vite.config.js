import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { projects } from './src/data/projects.js';
import { site } from './src/data/site.js';
import { renderProjects, validateProject, esc } from './src/lib/render.js';

// Injeta projetos e dados do site no HTML durante o build (HTML estático: bom para SEO
// e funciona sem JavaScript). Falha o build se src/data/projects.js estiver inválido.
function portfolioHtml() {
  return {
    name: 'portfolio-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const problems = projects.flatMap((p, i) => validateProject(p).map((e) => `projeto ${i + 1}: ${e}`));
        const ids = projects.map((p) => p.id);
        if (new Set(ids).size !== ids.length) problems.push('ids de projeto duplicados');
        if (problems.length) throw new Error(`src/data/projects.js inválido:\n${problems.join('\n')}`);

        const linkedin = site.linkedin
          ? `<a class="contact__link" href="${esc(site.linkedin)}" target="_blank" rel="noopener"><span>LinkedIn</span><small>${esc(site.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</small></a>`
          : '';

        const jsonLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: site.name,
          url: site.url,
          image: `${site.url}/og-image.jpg`,
          jobTitle: 'Suporte de TI e Desenvolvedor',
          address: { '@type': 'PostalAddress', addressLocality: 'Serra', addressRegion: 'ES', addressCountry: 'BR' },
          sameAs: [site.github, site.linkedin].filter(Boolean),
        });

        const tokens = {
          TITLE: esc(site.title),
          DESCRIPTION: esc(site.description),
          URL: esc(site.url),
          HEADLINE: esc(site.headline),
          SUBHEADLINE: esc(site.subheadline),
          EMAIL: esc(site.email),
          GITHUB: esc(site.github),
          GITHUB_USER: esc(site.githubUser),
          REPO: esc(site.repo),
          LOCATION: esc(site.location),
          PROJECT_COUNT: String(projects.length),
          YEAR: String(new Date().getFullYear()),
        };

        return html
          .replace('<!--@projects-->', renderProjects(projects))
          .replace('<!--@linkedin-->', linkedin)
          .replace('<!--@jsonld-->', `<script type="application/ld+json">${jsonLd}</script>`)
          .replace(/%(\w+)%/g, (m, k) => (k in tokens ? tokens[k] : m));
      },
    },
  };
}

// Placeholder borrado da ilustração, injetado depois do processamento do Vite.
function heroLqip() {
  return {
    name: 'hero-lqip',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        let lqip;
        try {
          lqip = readFileSync('public/img/hero-lqip.txt', 'utf8').trim();
        } catch {
          return html.replace(' data-lqip', '');
        }
        return html.replace(' data-lqip', ` style="background-image:url('${lqip}')"`);
      },
    },
  };
}

export default defineConfig({
  plugins: [portfolioHtml(), heroLqip()],
  build: { target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 0 },
  test: { environment: 'node' },
});
