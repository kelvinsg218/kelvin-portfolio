import './styles/main.css';
import { projects } from './data/projects.js';
import { site } from './data/site.js';
import { fetchRepoInfo, formatLive } from './lib/github.js';
import { createCommands, runCommand } from './lib/terminal.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');

// Hero: marca quando a ilustração carregou para disparar a entrada.
const heroImg = $('.hero__art img');
const markLoaded = () => document.documentElement.classList.add('hero-ready');
if (heroImg?.complete) markLoaded();
else heroImg?.addEventListener('load', markLoaded, { once: true });
setTimeout(markLoaded, 1800); // garante a entrada mesmo em conexão lenta

// Menu mobile
const toggle = $('[data-menu-toggle]');
const nav = $('[data-nav]');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
$$('#menu a').forEach((a) =>
  a.addEventListener('click', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  }),
);

// Cabeçalho sólido após rolar
const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Revelação ao rolar
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  $$('.reveal').forEach((el) => io.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('is-visible'));
}

// Parallax sutil dos elementos ao redor da ilustração (apenas ponteiro fino)
const art = $('.hero__art');
if (art && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  let raf = 0;
  window.addEventListener('pointermove', (ev) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = ev.clientX / window.innerWidth - 0.5;
      const y = ev.clientY / window.innerHeight - 0.5;
      art.style.setProperty('--px', x.toFixed(3));
      art.style.setProperty('--py', y.toFixed(3));
    });
  });
}

// Dados ao vivo do GitHub (opcional — o HTML já traz as informações da configuração)
const enhanceProjects = async () => {
  for (const card of $$('.project[data-repo]')) {
    const repo = card.dataset.repo;
    const cfg = projects.find((p) => p.repo === repo);
    const data = await fetchRepoInfo(repo);
    const text = formatLive(data, cfg?.release);
    const el = $('[data-live]', card);
    if (el && text) el.textContent = text;
  }
};
if ('requestIdleCallback' in window) requestIdleCallback(enhanceProjects, { timeout: 3000 });
else setTimeout(enhanceProjects, 1200);

// Copiar e-mail
$$('[data-copy]').forEach((btn) =>
  btn.addEventListener('click', async () => {
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'E-mail copiado ✓';
    } catch {
      btn.textContent = btn.dataset.copy;
    }
    setTimeout(() => (btn.textContent = original), 2200);
  }),
);

// Terminal interativo
const term = $('[data-terminal]');
if (term) {
  const out = $('[data-term-out]', term);
  const form = $('[data-term-form]', term);
  const input = $('[data-term-input]', term);
  const cmds = createCommands({ site, projects });
  const history = [];
  let hIndex = 0;

  const print = (text, cls = '') => {
    const p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
  };

  const exec = (value) => {
    print(`$ ${value}`, 'term-cmd');
    const res = runCommand(cmds, value);
    if (res.clear) {
      out.replaceChildren();
      return;
    }
    if (res.text) print(res.text, res.error ? 'term-err' : '');
    if (res.open) window.open(res.open, '_blank', 'noopener');
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    history.push(value);
    hIndex = history.length;
    input.value = '';
    exec(value);
  });
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp' && hIndex > 0) input.value = history[--hIndex];
    else if (ev.key === 'ArrowDown') input.value = hIndex < history.length - 1 ? history[++hIndex] : ((hIndex = history.length), '');
    else return;
    ev.preventDefault();
  });
  $$('[data-cmd]', term).forEach((b) => b.addEventListener('click', () => exec(b.dataset.cmd)));
  $('.terminal__out', term).addEventListener('click', () => input.focus({ preventScroll: true }));
}
