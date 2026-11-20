// Terminal interativo: lógica de comandos separada do DOM para ser testável.

export function createCommands({ site, projects }) {
  const list = projects.map((p, i) => `  ${i + 1}. ${p.name} — ${p.category || ''}`).join('\n');
  const cmds = {
    help: () =>
      [
        'Comandos disponíveis:',
        '  sobre      perfil profissional',
        '  projetos   lista os projetos',
        '  abrir <n>  abre o projeto n (GitHub ou sistema publicado)',
        '  stack      tecnologias que uso',
        '  contato    como falar comigo',
        '  github     abre meu perfil no GitHub',
        '  clear      limpa o terminal',
      ].join('\n'),
    sobre: () =>
      'Kelvin Garcia — graduando em Sistemas de Informação, com experiência em suporte técnico N1/N2,\ninfraestrutura de TI e implantação de sistemas. Desenvolvimento de aplicações web e desktop:\nautomação de processos, integração de sistemas, gestão empresarial e monitoramento de ativos.',
    whoami: () => 'kelvin — tecnologia, criatividade e desenvolvimento.',
    projetos: () => `${list}\n\nDigite "abrir 1" para abrir o primeiro projeto.`,
    stack: () =>
      'Suporte: Windows · Redes/DHCP · Acesso remoto · Hardware e periféricos\nCódigo:  Python · C#/.NET · WPF · SQLite · JavaScript/Node.js · Git\nEstudando: Go · AWS · Azure',
    contato: () =>
      [`E-mail:   ${site.email}`, `GitHub:   ${site.github}`, site.linkedin ? `LinkedIn: ${decodeURIComponent(site.linkedin)}` : null]
        .filter(Boolean)
        .join('\n'),
    github: () => ({ text: `Abrindo ${site.github} ...`, open: site.github }),
    abrir: (arg) => {
      const n = Number.parseInt(arg, 10);
      const p = projects[n - 1];
      if (!p) return `Uso: abrir <1-${projects.length}>`;
      if (p.private) {
        if (!p.demo) return `${p.name}: código privado.`;
        return { text: `${p.name}: código privado — abrindo o sistema publicado ...`, open: p.demo };
      }
      return { text: `Abrindo ${p.name} ...`, open: `https://github.com/${p.repo}` };
    },
    sudo: () => 'Permissão negada. Mas boa tentativa. 😄',
    clear: () => ({ clear: true }),
  };
  cmds.ajuda = cmds.help;
  cmds.projects = cmds.projetos;
  cmds.about = cmds.sobre;
  cmds.contact = cmds.contato;
  cmds.ls = cmds.projetos;
  cmds.cls = cmds.clear;
  return cmds;
}

export function runCommand(cmds, input) {
  const trimmed = String(input || '').trim();
  if (!trimmed) return { text: '' };
  const [name, ...args] = trimmed.split(/\s+/);
  const fn = cmds[name.toLowerCase()];
  if (!fn) return { text: `Comando não encontrado: ${name}. Digite "help".`, error: true };
  const out = fn(args.join(' '));
  return typeof out === 'string' ? { text: out } : out;
}
