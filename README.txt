===============================================================================
 VILAR TECNOLOGIA - SITE INSTITUCIONAL
 Domínio: https://www.vilartecnologia.com.br
 Versão: 1.0.0  |  Última atualização: 05/10/2026
===============================================================================

1. SOBRE O PROJETO
-------------------------------------------------------------------------------
Site institucional one-page (página única com seções) + páginas legais,
feito com HTML5 semântico, CSS3 e JavaScript puro (sem frameworks e sem
dependências). Funciona em QUALQUER hospedagem: basta enviar a pasta /public.

Objetivos: apresentar a empresa, transmitir confiança (referências: PwC e
Deloitte), captar contatos para orçamentos e dúvidas, com acessibilidade,
SEO e conformidade com a LGPD.


2. ESTRUTURA DE PASTAS
-------------------------------------------------------------------------------
v0-project/
|-- README.txt                      <- este documento
|-- package.json                    <- apenas scripts para rodar localmente
|-- vercel.json                     <- configuração caso hospede na Vercel
|-- docs/
|   `-- identidade-visual.txt       <- paleta, tipografia e 3 propostas visuais
|-- backend/
|   `-- contato.php                 <- recebe o formulário (hospedagem com PHP)
|-- scripts/
|   `-- dev-server.mjs              <- servidor local de desenvolvimento
`-- public/                         <- TUDO QUE VAI PARA A HOSPEDAGEM
    |-- index.html                  <- página principal
    |-- politica-de-privacidade.html
    |-- politica-de-conteudo.html
    |-- 404.html                    <- página de erro
    |-- robots.txt  sitemap.xml     <- SEO
    |-- site.webmanifest            <- ícone/instalação em celulares
    |-- .htaccess                   <- HTTPS, URLs amigáveis, cache (Apache)
    `-- assets/
        |-- css/style.css           <- ÚNICO arquivo de estilos
        |-- img/                    <- logo, favicon e fotos
        `-- js/
            |-- main.js             <- ponto de entrada
            |-- config.js           <- configurações (endpoint do formulário)
            `-- modules/
                |-- accessibility.js   <- fonte A-/A/A+, contraste, VLibras
                |-- navigation.js      <- menu mobile, item ativo
                |-- contact-form.js    <- validação e envio do formulário
                |-- cookie-consent.js  <- banner de cookies LGPD
                `-- reveal.js          <- animação suave ao rolar


3. PADRÕES DE NOMENCLATURA
-------------------------------------------------------------------------------
- Arquivos e pastas: minúsculas, sem acentos, palavras separadas por hífen
  (kebab-case). Ex.: politica-de-privacidade.html, hero-equipe-consultoria.png
- Imagens: [secao]-[descricao].ext  Ex.: sobre-reuniao-estrategica.png
- Classes CSS: padrão BEM -> bloco__elemento--modificador
  Ex.: .site-header__logo, .btn--primary, .form__field--checkbox
- Ganchos de JavaScript: atributos data-* (data-nav-toggle, data-contact-form).
  Assim é possível mudar classes visuais sem quebrar o comportamento.
- IDs de seção em português (#servicos, #sobre, #contato): viram URLs
  amigáveis e legíveis.


4. ORGANIZAÇÃO DO CSS (mesma ordem do HTML)
-------------------------------------------------------------------------------
O arquivo style.css segue a sequência do conteúdo. Cada seção do HTML tem um
comentário numerado ( <!-- ============ 5. SERVIÇOS ============ --> ) e o
bloco correspondente no CSS tem o mesmo número:

   0. Tokens (cores, fontes, espaços)  -> MUDE A IDENTIDADE VISUAL AQUI
   1. Barra de acessibilidade   2. Cabeçalho    3. Hero      4. Números
   5. Serviços    6. Sobre      7. Metodologia  8. Depoimentos
   9. Insights   10. FAQ       11. Contato     12. Rodapé
  13. Cookies    14. Páginas legais  15. Alto contraste  16. Impressão

Abordagem mobile-first: estilos base para celular e @media (min-width) para
telas maiores. Pontos de quebra: 640px, 768px e 1024px.


5. COMO RODAR LOCALMENTE
-------------------------------------------------------------------------------
Opção A (Node.js 18+):   pnpm dev   ou   npm run dev
                         Acesse http://localhost:3000
Opção B (sem Node):      abra a pasta /public com a extensão "Live Server"
                         do VS Code. (Abrir o index.html com duplo clique não
                         funciona, porque os módulos JS exigem um servidor.)


6. PUBLICAÇÃO (DEPLOY)
-------------------------------------------------------------------------------
Hospedagem tradicional (cPanel, Hostinger, Locaweb, HostGator...):
  1. Envie o CONTEÚDO da pasta /public para public_html (ou www).
  2. Para o formulário: copie backend/contato.php para public_html e, em
     assets/js/config.js, defina  formEndpoint: "/contato.php".
  3. Crie as caixas de e-mail contato@ e privacidade@ no painel da hospedagem.
  4. Ative o SSL gratuito (Let's Encrypt). O .htaccess já força HTTPS e www.
Vercel: importe o repositório; o vercel.json já publica a pasta /public.
  Como a Vercel não executa PHP, use um serviço como Formspree e cole a URL
  em formEndpoint.
Depois do deploy: cadastre o site no Google Search Console e envie
  https://www.vilartecnologia.com.br/sitemap.xml


7. FORMULÁRIO DE CONTATO
-------------------------------------------------------------------------------
- Campos: nome*, e-mail*, telefone, empresa, assunto*, mensagem*, aceite LGPD*.
- Validação no navegador (mensagens claras e associadas ao campo para leitores
  de tela) E no servidor (contato.php) - nunca confie só no navegador.
- Anti-spam: campo-armadilha invisível (honeypot) + intervalo mínimo entre envios.
- Sem endpoint configurado, o formulário roda em MODO DEMONSTRAÇÃO (simula envio).


8. ACESSIBILIDADE (WCAG 2.1 AA / eMAG / Lei 13.146-2015)
-------------------------------------------------------------------------------
- HTML semântico: header, nav, main, section, article, footer, address, dl.
- Atalhos de teclado (padrão gov.br): Alt+1 conteúdo, Alt+2 menu, Alt+3 rodapé.
- Ajuste de fonte (A- / A / A+), alto contraste e VLibras (tradução em Libras).
- Todas as imagens com texto alternativo (alt); ícones decorativos ocultos
  com aria-hidden="true".
- Foco visível em todos os elementos interativos; área de toque mínima de 44px.
- Contraste de cores mínimo 4.5:1; respeita "reduzir movimento" do sistema.
- Formulário com label, aria-invalid, aria-describedby e região aria-live.
Ferramentas de teste: WAVE, axe DevTools, Lighthouse e leitor de tela NVDA.


9. SEO
-------------------------------------------------------------------------------
- title e meta description únicos por página; URL canônica.
- Open Graph (prévia ao compartilhar no WhatsApp/LinkedIn).
- Dados estruturados Schema.org (JSON-LD) no index.html.
- Hierarquia correta de títulos (um h1 por página), robots.txt e sitemap.xml.
- Imagens com width/height (evita saltos de layout) e loading="lazy".


10. LGPD (Lei 13.709/2018)
-------------------------------------------------------------------------------
- Política de Privacidade com controlador, finalidades, bases legais,
  retenção, direitos do titular (art. 18) e contato do Encarregado (DPO).
- Banner de cookies com opção de aceitar, rejeitar ou personalizar; a escolha
  pode ser alterada pelo rodapé ("Preferências de cookies").
- Scripts de análise/marketing só devem ser carregados após o consentimento:
  use a função applyConsent() em assets/js/modules/cookie-consent.js.
- Aceite explícito (checkbox não marcado por padrão) no formulário.
- Ao mudar a política, incremente consentVersion em config.js.
IMPORTANTE: os textos legais são MODELOS. Valide com um advogado.


11. PENDÊNCIAS ANTES DE PUBLICAR
-------------------------------------------------------------------------------
[ ] Substituir assets/img/logo-vilar.svg e favicon.svg pelo logo oficial
[ ] Aplicar a paleta oficial nos tokens (seção 0 do style.css)
[ ] Trocar CNPJ, telefone, endereço e redes sociais (busque por "0000")
[ ] Substituir números, depoimentos e artigos genéricos por conteúdo real
[ ] Configurar o endpoint do formulário e testar o recebimento de e-mails
[ ] Revisão jurídica das políticas  |  [ ] Atualizar <lastmod> do sitemap.xml


12. HISTÓRICO DE VERSÕES
-------------------------------------------------------------------------------
1.0.0 (05/10/2026) - Estrutura inicial com conteúdo genérico, acessibilidade,
                     SEO, LGPD, formulário de contato e páginas legais.
===============================================================================
