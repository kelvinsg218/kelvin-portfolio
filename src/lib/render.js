// Renderização pura (sem DOM): usada no build para gerar o HTML estático dos projetos.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export const repoUrl = (repo) => `https://github.com/${repo}`;

export function validateProject(p) {
  const errors = [];
  for (const key of ['id', 'name', 'repo', 'summary']) {
    if (!p?.[key] || typeof p[key] !== 'string') errors.push(`campo obrigatório ausente: ${key}`);
  }
  if (p?.repo && !/^[\w.-]+\/[\w.-]+$/.test(p.repo)) errors.push(`repo inválido: ${p.repo}`);
  if (p?.id && !/^[a-z0-9-]+$/.test(p.id)) errors.push(`id deve usar a-z, 0-9 e hífen: ${p.id}`);
  for (const key of ['highlights', 'stack']) {
    if (p?.[key] !== undefined && !Array.isArray(p[key])) errors.push(`${key} deve ser uma lista`);
  }
  return errors;
}

const icon = {
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 3v12m0 0-5-5m5 5 5-5M4 19h16"/></svg>',
};

export function renderProjectCard(p, index = 0) {
  const url = repoUrl(p.repo);
  const releaseUrl = p.download || `${url}/releases/latest`;
  const num = String(index + 1).padStart(2, '0');
  const img = p.image
    ? `<figure class="project__media">
        <img src="/img/projects/${esc(p.image)}-640.webp"
             srcset="/img/projects/${esc(p.image)}-640.webp 640w, /img/projects/${esc(p.image)}-1200.webp 1200w"
             sizes="(min-width: 960px) 560px, 92vw"
             alt="${esc(p.imageAlt || `Captura de tela do ${p.name}`)}"
             loading="lazy" decoding="async" width="1200" height="750" />
      </figure>`
    : '';
  const highlights = (p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join('');
  const stack = (p.stack || []).map((s) => `<li>${esc(s)}</li>`).join('');
  return `<article class="project reveal" id="projeto-${esc(p.id)}" data-repo="${esc(p.repo)}">
    <div class="project__body">
      <p class="project__meta"><span class="project__num">${num}</span>${esc(p.category || '')}</p>
      <h3 class="project__title">${esc(p.name)}</h3>
      <p class="project__summary">${esc(p.summary)}</p>
      ${p.problem ? `<p class="project__problem"><strong>Problema real:</strong> ${esc(p.problem)}</p>` : ''}
      ${highlights ? `<ul class="project__highlights">${highlights}</ul>` : ''}
      ${stack ? `<ul class="project__stack" aria-label="Tecnologias">${stack}</ul>` : ''}
      <p class="project__live" data-live aria-live="polite">${p.release ? `Release ${esc(p.release)}` : ''}</p>
      <div class="project__actions">
        <a class="btn btn--primary" href="${esc(url)}" target="_blank" rel="noopener">${icon.github}Ver código</a>
        ${p.release || p.download ? `<a class="btn btn--ghost" href="${esc(releaseUrl)}" target="_blank" rel="noopener">${icon.download}Baixar release</a>` : ''}
      </div>
    </div>
    ${img}
  </article>`;
}

export function renderProjects(list) {
  return list.map((p, i) => renderProjectCard(p, i)).join('\n');
}
