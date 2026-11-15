import { describe, it, expect, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { projects } from '../src/data/projects.js';
import { site } from '../src/data/site.js';
import { validateProject, renderProjectCard, renderProjects, esc } from '../src/lib/render.js';
import { fetchRepoInfo, formatLive, timeAgo } from '../src/lib/github.js';
import { createCommands, runCommand } from '../src/lib/terminal.js';

const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
};

describe('configuração de projetos', () => {
  it('contém exatamente os três projetos autorizados', () => {
    expect(projects.map((p) => p.repo)).toEqual([
      'kelvinsg218/Windows-Maintenance-Agent',
      'kelvinsg218/pc-health-monitor',
      'kelvinsg218/peripheral-asset-tracker',
    ]);
  });

  it('todos os projetos são válidos e têm ids únicos', () => {
    for (const p of projects) expect(validateProject(p)).toEqual([]);
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
  });

  it('as imagens referenciadas existem em public/', () => {
    for (const p of projects.filter((x) => x.image)) {
      expect(existsSync(`public/img/projects/${p.image}-640.webp`)).toBe(true);
      expect(existsSync(`public/img/projects/${p.image}-1200.webp`)).toBe(true);
    }
  });

  it('validateProject aponta campos ausentes e formatos inválidos', () => {
    expect(validateProject({ id: 'X Y', name: 'a', repo: 'semBarra', summary: 's' })).toHaveLength(2);
    expect(validateProject({})).toHaveLength(4);
  });
});

describe('renderização', () => {
  it('escapa HTML', () => {
    expect(esc('<a href="x">&\'')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
  });

  it('gera card com links do repositório e da release', () => {
    const html = renderProjectCard(projects[0], 0);
    expect(html).toContain('href="https://github.com/kelvinsg218/Windows-Maintenance-Agent"');
    expect(html).toContain('/releases/latest');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('>01<');
  });

  it('funciona com um projeto mínimo (sem imagem, release ou listas)', () => {
    const html = renderProjectCard({ id: 'novo', name: 'Novo', repo: 'u/novo', summary: 'Resumo' });
    expect(html).toContain('Novo');
    expect(html).not.toContain('<figure');
    expect(html).not.toContain('Baixar release');
  });

  it('renderiza todos os projetos', () => {
    expect(renderProjects(projects).match(/<article/g)).toHaveLength(projects.length);
  });
});

describe('integração GitHub (sem token, com fallback)', () => {
  const ok = (body) => Promise.resolve({ ok: true, json: () => Promise.resolve(body) });

  it('combina dados do repositório e da última release', async () => {
    const fetchImpl = vi.fn((url) =>
      url.endsWith('/releases/latest')
        ? ok({ tag_name: 'v2.0.0', html_url: 'r' })
        : ok({ stargazers_count: 3, pushed_at: '2026-11-01T00:00:00Z', language: 'C#' }),
    );
    const data = await fetchRepoInfo('u/r', { fetchImpl, storage: memoryStorage() });
    expect(data).toMatchObject({ stars: 3, release: 'v2.0.0', language: 'C#' });
    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('retorna null quando a API falha ou está limitada', async () => {
    const limited = vi.fn(() => Promise.resolve({ ok: false, status: 403 }));
    expect(await fetchRepoInfo('u/r', { fetchImpl: limited, storage: memoryStorage() })).toBeNull();
    const offline = vi.fn(() => Promise.reject(new Error('offline')));
    expect(await fetchRepoInfo('u/r', { fetchImpl: offline, storage: memoryStorage() })).toBeNull();
  });

  it('usa o cache e não chama a API de novo dentro do TTL', async () => {
    const storage = memoryStorage();
    const fetchImpl = vi.fn(() => ok({ stargazers_count: 1, pushed_at: '2026-11-01T00:00:00Z' }));
    await fetchRepoInfo('u/r', { fetchImpl, storage, now: 1000 });
    await fetchRepoInfo('u/r', { fetchImpl, storage, now: 2000 });
    expect(fetchImpl).toHaveBeenCalledTimes(2); // repo + release da primeira chamada apenas
  });

  it('continua funcionando se o armazenamento lançar erro', async () => {
    const storage = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); } };
    const fetchImpl = () => ok({ stargazers_count: 0 });
    expect(await fetchRepoInfo('u/r', { fetchImpl, storage })).toMatchObject({ stars: 0 });
  });

  it('formata a linha ao vivo e usa a release da configuração como fallback', () => {
    const now = Date.parse('2026-11-15T00:00:00Z');
    expect(formatLive(null, 'v1.0.0', now)).toBe('Release v1.0.0');
    expect(formatLive({ release: 'v1.1.0', pushedAt: '2026-11-10T00:00:00Z', stars: 2 }, 'v1.0.0', now)).toBe(
      'Release v1.1.0 · atualizado há 5 dias · ★ 2',
    );
    expect(timeAgo('2026-09-10T00:00:00Z', now)).toBe('há 2 meses');
  });
});

describe('terminal', () => {
  const cmds = createCommands({ site, projects });

  it('lista projetos e contato', () => {
    expect(runCommand(cmds, 'projetos').text).toContain('PC Health Monitor');
    expect(runCommand(cmds, 'contato').text).toContain(site.email);
  });

  it('abre o repositório do projeto pelo número', () => {
    expect(runCommand(cmds, 'abrir 3').open).toBe('https://github.com/kelvinsg218/peripheral-asset-tracker');
    expect(runCommand(cmds, 'abrir 9').text).toMatch(/Uso/);
  });

  it('trata comandos desconhecidos, vazios e maiúsculas', () => {
    expect(runCommand(cmds, 'rm -rf /').error).toBe(true);
    expect(runCommand(cmds, '   ').text).toBe('');
    expect(runCommand(cmds, 'HELP').text).toContain('Comandos');
    expect(runCommand(cmds, 'clear').clear).toBe(true);
  });
});
