/**
 * Projetos exibidos no portfólio.
 *
 * Para adicionar um projeto, acrescente um objeto a este array (veja o README,
 * seção "Adicionar um projeto"). Os campos marcados como opcionais podem ser omitidos.
 *
 * - id          identificador curto e único (usado em âncoras e nomes de imagem)
 * - name        nome exibido
 * - repo        "usuario/repositorio" no GitHub — usado para links e dados ao vivo
 * - private     (opcional) true = código privado: sem links para o repositório/documentação,
 *               sem consulta à API do GitHub; mostra "Código privado" e o terminal abre a demo
 * - category    rótulo curto acima do título
 * - summary     uma frase que resume o projeto
 * - problem     o problema real que motivou o projeto
 * - highlights  lista curta do que o projeto faz (3 a 4 itens)
 * - stack       tecnologias principais
 * - image       (opcional) nome-base em public/img/projects/ — gera <id>-640.webp e <id>-1200.webp
 * - imageAlt    (opcional) texto alternativo da imagem
 * - release     (opcional) versão publicada, usada se a API do GitHub estiver indisponível
 * - download    (opcional) URL direta de download
 * - featured    (opcional) true = card em destaque, largura total
 * - solution    (opcional) como o projeto resolve o problema
 * - docs        (opcional) URL da documentação
 * - demo        (opcional) URL de uma demonstração pública funcional
 * - demoLabel   (opcional) texto do botão da demonstração (padrão: "Ver demonstração")
 * - brand       (opcional) { color: '#hex', logo: 'arquivo.svg' em public/img/projects/ }
 * - gallery     (opcional) [{ file: 'nome', alt: '...' }] — gera public/img/projects/<nome>-480.webp e -1440.webp
 */
export const projects = [
  {
    id: 'flowrix',
    name: 'FLOWRIX',
    repo: 'kelvinsg218/flowdesk-automation',
    private: true,
    category: 'Automação de processos · Integração de sistemas',
    featured: true,
    summary:
      'Plataforma de automação visual desenvolvida para simplificar processos, conectar sistemas e automatizar tarefas repetitivas. Permite construir fluxos de trabalho por meio de uma interface intuitiva, utilizando componentes configuráveis e conexões visuais.',
    problem:
      'Tarefas repetitivas feitas à mão, sistemas que não conversam entre si, regras de negócio que ficam só na cabeça das pessoas e nenhuma visibilidade sobre o que foi executado — ou onde deu erro.',
    solution:
      'O processo é desenhado como um fluxograma num editor visual e executado no servidor por um motor próprio em Python, que valida o fluxo, registra cada etapa com entrada, saída, duração e erros, e mascara senhas e tokens antes de gravar.',
    highlights: [
      'Editor visual: arrastar e soltar, conectar, configurar no inspetor e testar com progresso nó a nó',
      'Componentes: Gatilho manual, Webhook, Definir dados, SE / SENÃO (14 operadores), Requisição HTTP e Fim',
      'Versionamento imutável: webhooks executam sempre a versão publicada',
      'Histórico com detalhe por etapa e dashboard com taxa de sucesso e gráfico de 14 dias',
    ],
    stack: ['React', 'TypeScript', 'React Flow', 'Tailwind CSS', 'Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL'],
    image: 'flowrix',
    imageAlt: 'Editor do FLOWRIX com o fluxo "Qualificação de leads" executado com sucesso, etapa por etapa',
    demo: 'https://flowdesk-automation.netlify.app',
    brand: { color: '#E52435', logo: 'flowrix-symbol.svg' },
    gallery: [
      { file: 'flowrix-landing', alt: 'Página inicial do FLOWRIX: “Fluxos complexos. Elegantemente simples.”' },
      { file: 'flowrix-dashboard', alt: 'Dashboard do FLOWRIX com workflows, execuções, taxa de sucesso e gráfico de 14 dias' },
      { file: 'flowrix-execucao', alt: 'Detalhe de uma execução com entrada, saída e duração de cada etapa' },
      { file: 'flowrix-falha', alt: 'Execução com falha registrada: requisição a endereço interno bloqueada (proteção contra SSRF)' },
    ],
  },
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
  {
    id: 'zentra',
    name: 'ZENTRA',
    repo: 'kelvinsg218/Solucao_Total',
    private: true,
    category: 'Gestão de equipes e pessoas',
    summary:
      'Sistema web multiempresa para centralizar a gestão de equipes e pessoas: colaboradores, diaristas, escalas, presenças, pagamentos e processos administrativos em uma única plataforma.',
    problem:
      'Empresas que trabalham com diaristas e equipes temporárias controlavam escalas, presenças e pagamentos em planilhas, mensagens e anotações soltas — o que gerava erros de pagamento e retrabalho.',
    highlights: [
      'Gestão de equipes, colaboradores e diaristas, com importação por planilha CSV ou Excel',
      'Escalas por dia, semana e mês e registro de presença pelo supervisor no celular',
      'Aprovação de diárias, fechamentos e pagamentos, inclusive parciais, com comprovantes',
      'Relatórios operacionais e financeiros em PDF, Excel e CSV',
      'Controle de acesso por perfil e várias empresas com dados isolados',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Netlify', 'Render'],
    image: 'zentra',
    imageAlt: 'Dashboard do ZENTRA com a empresa de demonstração (dados fictícios): escalados, presenças, saldo a pagar e gráficos',
    demo: 'https://solucao-total.netlify.app',
    demoLabel: 'Acessar sistema',
    brand: { color: '#8A5CF6', logo: 'zentra-simbolo.svg' },
  },
];
