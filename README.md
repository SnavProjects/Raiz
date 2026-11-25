# Raiz

**Explore. Construa. Sobreviva.**

Sandbox de sobrevivência 2D para navegador, desenvolvido com TypeScript, Phaser 3 e Vite, seguindo o design e a arquitetura documentados neste repositório. Idioma padrão: português brasileiro.

> **Estado: versão inicial jogável (0.1.0), em desenvolvimento.** Não é um lançamento completo. O roadmap continua sendo a referência para recursos e validações pendentes.

## Jogar no navegador

**https://snavprojects.github.io/Raiz/**

O GitHub Pages serve o conteúdo compilado de `dist/` pelo workflow `.github/workflows/pages.yml`, sem servidor de backend. Nesta fase, pushes em `arena/ed95fb2a-raiz` e `main` publicam o jogo; após integrar a implementação, remova a branch de desenvolvimento da lista para publicar apenas a versão de `main`.

No celular, use a orientação horizontal. Os saves ficam no navegador e não são transferidos automaticamente entre a prévia temporária e o GitHub Pages; use exportação/importação para transferi-los.

## Executar localmente

Requisitos: Node.js 22 e npm. Não é necessário backend, conta ou serviço externo para jogar.

```sh
npm ci
npm run dev
```

Abra o endereço indicado pelo Vite (porta padrão `5173`).

```sh
npm run build       # verificação TypeScript + build em dist/
npm run preview     # serve o build na porta 4173
```

`dist/` pode ser publicado em uma hospedagem estática na raiz do domínio. Os mundos são locais ao navegador e à origem utilizada: trocar de domínio, perfil ou porta não transfere os saves. Exporte um backup antes de limpar os dados do navegador.

## Como jogar

1. Clique em **Novo Mundo**, escolha um nome e uma seed e crie o mundo.
2. Explore, colete madeira segurando o botão esquerdo sobre os troncos próximos e abra **Criar** para produzir tábuas, gravetos e ferramentas.
3. Selecione um material na barra rápida e segure o botão direito para construir. Não é permitido colocar blocos dentro do jogador.
4. Use **Salvar** ou aguarde o salvamento automático a cada 30 segundos de partida ativa. Em **Continuar**, os mundos podem ser carregados, renomeados, exportados, importados ou excluídos.

| Ação | Controle padrão |
|---|---|
| Andar | Setas esquerda/direita |
| Pular | Espaço |
| Minerar / atacar criatura próxima ao alvo | Segurar botão esquerdo do mouse |
| Construir | Botão direito do mouse |
| Selecionar slot rápido | 1–9 ou clique na barra |
| Inventário | I |
| Crafting | C |
| Pausa / fechar janela | Esc |
| Comer | Clique em um alimento no inventário |
| Mover itens | Arrastar entre slots ou clicar no slot de origem e depois no destino |
| Dividir pilha | Shift + clique no inventário |
| Descartar | Botão direito no slot do inventário |

Em telas touch há botões de movimento, pulo, mineração e construção; as ações usam um alvo próximo na direção do personagem. Inventário, crafting, pausa e salvamento permanecem disponíveis no HUD. O teste móvel é emulado; dispositivos Android reais ainda precisam de validação.

## Implementação atual

- Geração determinística por seed, terreno, biomas, cavernas, minérios e vegetação.
- Mundo horizontal gerado sob demanda em chunks, com altura de 200 tiles e camadas de frente/fundo. Edições são preservadas mesmo ao descarregar terreno distante.
- Física do jogador com colisões, pulo, câmera e controles reconfiguráveis.
- Mineração por tempo e tier de ferramenta, inventário de 36 slots, crafting com validação de espaço e ingredientes e construção persistente. Receitas de fundição exigem uma fornalha próxima.
- Saúde, fome, alimentação, morte, respawn, criaturas com comportamento básico e combate inicial.
- Ciclo de dia/noite, escurecimento global e áudio sintetizado com Web Audio.
- IndexedDB, exportação/importação JSON validada e migração de formato v0 para v1.
- Menus, HUD, configurações de áudio, contraste, escala e controles; tradução parcial para inglês.

## Testes

```sh
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

A suíte possui **76 testes unitários/de integração** e **6 testes de navegador**, cobrindo geração, inventário, crafting, construção, física, persistência, menu, início da cena, pausa, carregamento, configurações, mineração e movimento touch emulado. A CI executa as verificações e os testes E2E no build de produção.

Para usar um Chromium já instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Os testes não substituem avaliação manual de compatibilidade, acessibilidade e desempenho em dispositivos reais.

## Limitações conhecidas / próximos passos

- Arte procedural inicial: faltam revisão artística, animações completas e ícones próprios na interface (parte deles ainda usa Unicode/emoji).
- Iluminação é global; tochas ainda não emitem luz local. Não há clima ou rios dedicados.
- Portas, camas e baús podem ser criados/colocados, mas abrir portas, dormir e armazenar itens em baús ainda não estão implementados. O botão de interação apenas identifica estações próximas.
- IA e combate são básicos; balanceamento, progressão e sessões prolongadas ainda precisam de validação.
- A geração de chunks é síncrona, e o arquivo JavaScript principal inclui Phaser (~1,54 MB minificado, ~360 kB gzip). Há trabalho pendente de geração assíncrona, otimização e medições em celulares.
- Edições descarregadas ficam em memória até o encerramento do mundo; ainda não há paginação incremental dessas edições no IndexedDB.
- Inglês e acessibilidade são parciais; ajuste de posição dos controles touch não foi implementado.
- Não há multiplayer, sincronização em nuvem ou recuperação automática de backups.

## Estrutura e contribuição

- `src/`: engine, mundo, geração, jogador, sistemas, renderização, controles, áudio, UI e persistência.
- `tests/`: testes Vitest e Playwright.
- `public/assets/`: recursos originais; `npm run assets:generate` regenera os PNGs. As texturas usadas na partida também são criadas em `src/rendering/Renderer.ts`.
- `docs/`: arquitetura, design, diretrizes artísticas, metas de desempenho e roadmap.

Leia [AGENTS.md](AGENTS.md) e [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) antes de contribuir. Mantenha alterações modulares, adicione testes e execute as verificações acima. Nenhuma fase deve ser considerada concluída apenas pela presença de código ou interface.

## Licenças

Código original: [MIT](LICENSE). Recursos originais: [CC BY 4.0](public/assets/LICENSE_ASSETS.md), atribuição a **SnavProjects/Raiz**. Dependências mantêm suas próprias licenças; veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Veja também [AI_DISCLOSURE.md](AI_DISCLOSURE.md).
