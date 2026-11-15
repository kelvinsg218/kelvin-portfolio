/**
 * Projetos exibidos no portfólio.
 *
 * Para adicionar um projeto, acrescente um objeto a este array (veja o README,
 * seção "Adicionar um projeto"). Os campos marcados como opcionais podem ser omitidos.
 *
 * - id          identificador curto e único (usado em âncoras e nomes de imagem)
 * - name        nome exibido
 * - repo        "usuario/repositorio" no GitHub — usado para links e dados ao vivo
 * - category    rótulo curto acima do título
 * - summary     uma frase que resume o projeto
 * - problem     o problema real que motivou o projeto
 * - highlights  lista curta do que o projeto faz (3 a 4 itens)
 * - stack       tecnologias principais
 * - image       (opcional) nome-base em public/img/projects/ — gera <id>-640.webp e <id>-1200.webp
 * - imageAlt    (opcional) texto alternativo da imagem
 * - release     (opcional) versão publicada, usada se a API do GitHub estiver indisponível
 * - download    (opcional) URL direta de download
 */
export const projects = [
  {
    id: 'windows-maintenance-agent',
    name: 'Windows Maintenance Agent',
    repo: 'kelvinsg218/Windows-Maintenance-Agent',
    category: 'Automação · Manutenção preventiva',
    summary:
      'Agente de manutenção preventiva para Windows 10 e 11, disponível como aplicativo desktop e linha de comando.',
    problem:
      'No suporte, a manutenção de estações é repetitiva e fácil de esquecer: atualizações pendentes, temporários acumulados e reinicializações adiadas.',
    highlights: [
      'Verifica e instala atualizações pela API oficial do Windows Update',
      'Atualiza o Google Chrome via winget e limpa temporários com segurança',
      'Detecta reinicialização pendente — sem nunca reiniciar o computador',
      'Gera logs, relatórios e histórico; funciona com o Agendador de Tarefas',
    ],
    stack: ['Python', 'Tkinter', 'pywin32', 'SQLite', 'pytest', 'PyInstaller'],
    image: 'wma',
    imageAlt: 'Painel do aplicativo desktop Windows Maintenance Agent',
    release: 'v1.0.0',
  },
  {
    id: 'pc-health-monitor',
    name: 'PC Health Monitor',
    repo: 'kelvinsg218/pc-health-monitor',
    category: 'Diagnóstico · Monitoramento',
    summary:
      'Aplicativo de diagnóstico somente leitura que mostra a saúde do computador em uma janela simples.',
    problem:
      'Antes de abrir um chamado ou trocar uma peça, é preciso entender rapidamente se o problema é CPU, memória, disco ou temperatura.',
    highlights: [
      'CPU, RAM, discos e temperatura com atualização ao vivo',
      'Classificação geral HEALTHY / ATTENTION / CRITICAL com alertas',
      'Processos que mais consomem recursos e histórico de verificações',
      'Executável único, sem instalação e sem privilégios de administrador',
    ],
    stack: ['C#', '.NET 8', 'WPF', 'EF Core', 'SQLite', 'xUnit'],
    image: 'phm',
    imageAlt: 'Dashboard do PC Health Monitor com métricas de CPU, memória e discos',
    release: 'v1.1.0',
  },
  {
    id: 'peripheral-asset-tracker',
    name: 'Peripheral Asset Tracker',
    repo: 'kelvinsg218/peripheral-asset-tracker',
    category: 'Inventário · Ativos de TI',
    summary:
      'Inventário local de periféricos Windows com responsável, computador esperado e histórico de movimentações.',
    problem:
      'Mouses, teclados e outros periféricos mudam de mesa sem registro — e o inventário deixa de refletir a realidade.',
    highlights: [
      'Identificação de dispositivos HID por fingerprint SHA-256',
      'Atribuição a usuários e computadores, com transferências registradas',
      'Alerta de dispositivo fora da máquina esperada',
      'Exportação de relatório CSV; não captura teclas nem atividade pessoal',
    ],
    stack: ['C#', '.NET 9', 'WPF', 'EF Core', 'SQLite', 'xUnit'],
    image: 'pat',
    imageAlt: 'Painel do Peripheral Asset Tracker com totais e alertas de dispositivos',
    release: 'v1.0.0',
  },
];
