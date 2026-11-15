# Material de divulgação — KELVIN.DEV

- **Site:** https://kelvin-garcia.netlify.app
- **Repositório:** https://github.com/kelvinsg218/kelvin-portfolio

| Arquivo | Uso |
|---|---|
| `linkedin-post.md` | Texto da publicação no LinkedIn |
| `github.md` | Descrição do repositório e como destacá-lo no perfil |
| `imagens/linkedin-capa.png` | Capa do perfil do LinkedIn (1584×396) |
| `imagens/projetos-destaque.png` | Imagem dos três projetos para anexar ao post (1200×1500) |
| `imagens/captura-inicial.png` | Captura da página inicial (desktop) |
| `imagens/captura-mobile.png` | Captura da página inicial (celular) |
| `imagens/og-preview.png` | Prévia que aparece quando o link é compartilhado (Open Graph) |

**Dica:** ao publicar no LinkedIn, cole o link do site **por último**, espere a prévia aparecer e anexe `projetos-destaque.png`. Se a prévia não carregar a imagem, use o [Post Inspector](https://www.linkedin.com/post-inspector/) com a URL do site.

Para regenerar as imagens: `npm run assets` (capa, OG, favicon) e `npm run verify -- https://kelvin-garcia.netlify.app/ publicacao/.capturas && npm run promo` (capturas e destaque).
