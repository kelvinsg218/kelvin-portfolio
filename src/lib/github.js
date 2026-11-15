// Dados públicos e opcionais do GitHub (sem token). Qualquer falha retorna null
// e o site continua mostrando as informações do arquivo de configuração.

const API = 'https://api.github.com';
const TTL_MS = 6 * 60 * 60 * 1000; // 6 h — poupa o limite de 60 requisições/hora sem token

function readCache(storage, key, now) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return now - at < TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(storage, key, data, now) {
  try {
    storage?.setItem(key, JSON.stringify({ at: now, data }));
  } catch {
    /* armazenamento indisponível: ignora */
  }
}

async function getJson(fetchImpl, url, timeoutMs) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetchImpl(url, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: ctrl?.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function fetchRepoInfo(repo, opts = {}) {
  const {
    fetchImpl = globalThis.fetch,
    storage = globalThis.localStorage,
    now = Date.now(),
    timeoutMs = 5000,
  } = opts;
  if (!fetchImpl) return null;
  const key = `gh:${repo}`;
  const cached = readCache(storage, key, now);
  if (cached) return cached;

  const [info, release] = await Promise.all([
    getJson(fetchImpl, `${API}/repos/${repo}`, timeoutMs),
    getJson(fetchImpl, `${API}/repos/${repo}/releases/latest`, timeoutMs),
  ]);
  if (!info) return null;

  const data = {
    stars: Number(info.stargazers_count) || 0,
    pushedAt: info.pushed_at || info.updated_at || null,
    language: info.language || null,
    release: release?.tag_name || null,
    releaseUrl: release?.html_url || null,
  };
  writeCache(storage, key, data, now);
  return data;
}

export function formatLive(data, fallbackRelease, now = Date.now()) {
  const parts = [];
  const release = data?.release || fallbackRelease;
  if (release) parts.push(`Release ${release}`);
  if (data?.pushedAt) parts.push(`atualizado ${timeAgo(data.pushedAt, now)}`);
  if (data && data.stars > 0) parts.push(`★ ${data.stars}`);
  return parts.join(' · ');
}

export function timeAgo(iso, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const day = 86400000;
  const days = Math.floor(diff / day);
  if (days < 1) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? 'há 1 mês' : `há ${months} meses`;
  const years = Math.floor(days / 365);
  return years === 1 ? 'há 1 ano' : `há ${years} anos`;
}
