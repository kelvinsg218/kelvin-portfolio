# KELVIN.DEV — Kelvin Garcia · Creative Developer Portfolio

> Da resolução de problemas à criação de soluções.

Portfólio pessoal interativo que apresenta minha trajetória em suporte de TI, implantação de sistemas e desenvolvimento de software: ferramentas para Windows que nasceram de problemas reais do dia a dia do suporte.

**🌐 Site publicado:** https://kelvin-garcia.netlify.app

![Página inicial do portfólio](publicacao/imagens/captura-inicial.png)

## Funcionalidades

- **Hero ilustrado** com a arte personalizada, adaptada para desktop, tablet e celular sem distorção e com o rosto sempre enquadrado.
- **Animações de entrada** e elementos SVG complementares (faíscas, circuitos, código) com parallax sutil — respeitando `prefers-reduced-motion`.
- **Trajetória** profissional e acadêmica em linha do tempo.
- **Projetos** gerados a partir de um único arquivo de configuração, com capturas de tela, tecnologias e links de código e release.
- **Dados ao vivo do GitHub** (última release, data de atualização, estrelas) via API pública, sem token, com cache de 6 h. Se a API estiver indisponível ou limitada, o site continua mostrando as informações da configuração.
- **Terminal interativo** (`help`, `sobre`, `projetos`, `abrir 1`, `stack`, `contato`…).
- **Contato** por e-mail (com botão de copiar) e GitHub.
- **SEO e compartilhamento:** metadados, Open Graph/Twitter Card, JSON-LD, sitemap, favicon personalizado e imagem de prévia para o LinkedIn.
- **Desempenho:** HTML estático gerado no build (funciona sem JavaScript), imagens AVIF/WebP responsivas (a ilustração caiu de 2,2 MB para ~20–70 KB), placeholder borrado e JS de ~4,5 KB gzip.

## Tecnologias

- HTML, CSS e JavaScript (sem framework)
- [Vite](https://vitejs.dev/) — build de produção e plugin que injeta os projetos no HTML
- [sharp](https://sharp.pixelplumbing.com/) — geração das imagens otimizadas, favicon e imagens de compartilhamento
- [Vitest](https://vitest.dev/) — testes unitários
- [Playwright](https://playwright.dev/) (playwright-core) — verificação de ponta a ponta e capturas de tela
- [Netlify](https://www.netlify.com/) — hospedagem com HTTPS e deploy contínuo a partir do GitHub

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
git clone https://github.com/kelvinsg218/kelvin-portfolio.git
cd kelvin-portfolio
npm install
npm run dev        # servidor de desenvolvimento em http://localhost:5173
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm test` | roda os testes unitários |
| `npm run build` | gera o build de produção em `dist/` |
| `npm run preview` | serve o build em http://localhost:4173 |
| `npm run assets` | regenera imagens otimizadas a partir de `assets-src/` |
| `npm run verify -- <url>` | verificação de ponta a ponta (imagens, links, console, responsividade) |

Para o `verify`, instale uma vez o navegador headless: `npx playwright-core install chromium-headless-shell`.

## Adicionar um projeto

1. Abra [`src/data/projects.js`](src/data/projects.js) e acrescente um objeto ao array:

   ```js
   {
     id: 'meu-projeto',                       // a-z, 0-9 e hífen
     name: 'Meu Projeto',
     repo: 'kelvinsg218/meu-projeto',         // usuário/repositório no GitHub
     category: 'Web · API',
     summary: 'Uma frase sobre o projeto.',
     problem: 'O problema real que ele resolve.',
     highlights: ['O que ele faz 1', 'O que ele faz 2', 'O que ele faz 3'],
     stack: ['Node.js', 'Express'],
     image: 'meu-projeto',                    // opcional
     release: 'v1.0.0',                       // opcional
   },
   ```

2. (Opcional) Coloque a captura de tela em `assets-src/shot-meu-projeto.png`, adicione `'meu-projeto'` à lista de capturas em [`scripts/build-assets.mjs`](scripts/build-assets.mjs) e rode `npm run assets`.
3. Rode `npm test && npm run build`. O build falha com uma mensagem clara se algum campo obrigatório estiver faltando.
4. Faça commit e push — o Netlify publica automaticamente.

> O teste `contém exatamente os três projetos autorizados` existe para evitar inclusões acidentais; atualize-o junto ao adicionar um projeto.

Contatos e links ficam em [`src/data/site.js`](src/data/site.js).

## Estrutura

```
index.html              página (com marcadores preenchidos no build)
src/data/projects.js    projetos exibidos
src/data/site.js        nome, frases, contatos e URL
src/lib/                renderização, integração GitHub e terminal
src/styles/main.css     estilos
scripts/                geração de imagens e verificação de ponta a ponta
public/                 imagens otimizadas, favicon, robots, sitemap
publicacao/             textos e imagens de divulgação
netlify.toml            build, cabeçalhos de segurança e cache
```

## Contato

- E-mail: [garciakelvin604@gmail.com](mailto:garciakelvin604@gmail.com)
- GitHub: [github.com/kelvinsg218](https://github.com/kelvinsg218)
- LinkedIn: [linkedin.com/in/kelvin-simões-4890432b7](https://www.linkedin.com/in/kelvin-sim%C3%B5es-4890432b7/)
- Serra – ES, Brasil
