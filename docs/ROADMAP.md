# Roadmap — Raiz

## 1. Objetivo

Este documento organiza as etapas de desenvolvimento do Raiz.

O roadmap estabelece prioridades, dependências e critérios de conclusão.

Não representa uma promessa de datas de lançamento.

## 2. Estratégia

O desenvolvimento será dividido em fases.

Cada fase deverá produzir sistemas funcionais, integrados e testados.

Não avançar apenas porque uma tela ou implementação visual está pronta.

## 3. Fase 0 — Planejamento e estrutura

### Objetivo

Preparar a base técnica e documental.

### Tarefas

- [ ] Criar estrutura do repositório.
- [ ] Configurar TypeScript.
- [ ] Configurar Phaser 3.
- [ ] Configurar Vite.
- [ ] Configurar Vitest.
- [ ] Configurar Playwright.
- [ ] Criar AGENTS.md.
- [ ] Criar documentação técnica.
- [ ] Configurar licença MIT.
- [ ] Definir política de licenciamento dos recursos.
- [ ] Criar sistema de organização de assets.
- [ ] Configurar CI.

### Critérios de conclusão

O projeto deve compilar, executar e possuir estrutura organizada.

## 4. Fase 1 — Base da engine

### Objetivo

Construir a base executável do jogo.

### Tarefas

- [ ] Inicialização da engine.
- [ ] Gerenciamento de cenas.
- [ ] Sistema de câmera.
- [ ] Configuração de renderização.
- [ ] Sistema de carregamento de recursos.
- [ ] Gerenciamento de estados.
- [ ] Sistema de eventos.
- [ ] Configuração de resolução.
- [ ] Suporte inicial a dispositivos móveis.
- [ ] Tratamento de erros.

### Critérios de conclusão

A engine deve iniciar corretamente em navegadores desktop e Android compatíveis.

## 5. Fase 2 — Mundo procedural

### Objetivo

Implementar o mundo e sua geração.

### Tarefas

- [ ] Sistema de tiles.
- [ ] Sistema de chunks.
- [ ] Geração por seed.
- [ ] Geração de terrenos.
- [ ] Sistema de biomas.
- [ ] Geração de cavernas.
- [ ] Distribuição de recursos.
- [ ] Lagos e rios.
- [ ] Carregamento progressivo.
- [ ] Descarregamento de chunks.
- [ ] Persistência de modificações.

### Critérios de conclusão

Mundos deverão ser gerados de forma reproduzível, exploráveis e sem bloqueios prolongados da interface.

## 6. Fase 3 — Jogador e controles

### Objetivo

Implementar a experiência de movimentação.

### Tarefas

- [ ] Jogador.
- [ ] Movimentação horizontal.
- [ ] Pulo.
- [ ] Gravidade.
- [ ] Colisões.
- [ ] Câmera acompanhando o jogador.
- [ ] Interações.
- [ ] Animações.
- [ ] Controles de teclado.
- [ ] Controles de mouse.
- [ ] Controles touchscreen.
- [ ] Configuração dos controles.

### Critérios de conclusão

O jogador deverá conseguir explorar o mundo utilizando teclado e touchscreen.

## 7. Fase 4 — Recursos e mineração

### Objetivo

Implementar coleta e interação com o ambiente.

### Tarefas

- [ ] Sistema de blocos.
- [ ] Identificação de materiais.
- [ ] Mineração.
- [ ] Coleta.
- [ ] Drops.
- [ ] Ferramentas.
- [ ] Resistência de materiais.
- [ ] Feedback visual.
- [ ] Feedback sonoro.

### Critérios de conclusão

A mineração deverá alterar o mundo e produzir recursos persistentes.

## 8. Fase 5 — Inventário e crafting

### Objetivo

Implementar gerenciamento de itens.

### Tarefas

- [ ] Sistema de itens.
- [ ] Slots.
- [ ] Empilhamento.
- [ ] Transferência.
- [ ] Barra de acesso rápido.
- [ ] Receitas.
- [ ] Sistema de crafting.
- [ ] Validação de ingredientes.
- [ ] Interface de inventário.
- [ ] Interface de crafting.

### Critérios de conclusão

Os itens deverão ser coletados, armazenados, transferidos e utilizados na criação de outros itens.

## 9. Fase 6 — Construção

### Objetivo

Implementar liberdade de construção.

### Tarefas

- [ ] Colocação de blocos.
- [ ] Remoção de blocos.
- [ ] Validação de posicionamento.
- [ ] Construção de estruturas.
- [ ] Materiais diferentes.
- [ ] Portas.
- [ ] Iluminação.
- [ ] Objetos decorativos.
- [ ] Persistência das construções.

### Critérios de conclusão

O jogador deverá construir estruturas e encontrá-las preservadas após sair e carregar o mundo novamente.

## 10. Fase 7 — Criaturas e sobrevivência

### Objetivo

Adicionar vida e desafios ao mundo.

### Tarefas

- [ ] Sistema de entidades.
- [ ] Animais passivos.
- [ ] Criaturas hostis fictícias.
- [ ] Comportamentos.
- [ ] Movimentação.
- [ ] Interações.
- [ ] Saúde.
- [ ] Fome.
- [ ] Alimentação.
- [ ] Recuperação.
- [ ] Configurações de dificuldade.

### Critérios de conclusão

As criaturas deverão possuir comportamentos funcionais e o sistema de sobrevivência deverá influenciar a experiência.

## 11. Fase 8 — Ambiente e áudio

### Objetivo

Completar a ambientação.

### Tarefas

- [ ] Ciclo de dia e noite.
- [ ] Amanhecer.
- [ ] Entardecer.
- [ ] Iluminação dinâmica.
- [ ] Efeitos ambientais.
- [ ] Música.
- [ ] Sons de ambiente.
- [ ] Sons de interação.
- [ ] Sons de criaturas.
- [ ] Configurações de áudio.

### Critérios de conclusão

O ambiente deverá reagir ao tempo e possuir identidade sonora própria.

## 12. Fase 9 — Salvamento completo

### Objetivo

Garantir a preservação dos mundos.

### Tarefas

- [ ] IndexedDB.
- [ ] Criação de mundos.
- [ ] Listagem de mundos.
- [ ] Salvamento automático.
- [ ] Salvamento manual.
- [ ] Carregamento.
- [ ] Exclusão.
- [ ] Exportação.
- [ ] Importação.
- [ ] Versionamento.
- [ ] Migrações.
- [ ] Recuperação de dados.
- [ ] Testes de integridade.

### Critérios de conclusão

O jogador deverá conseguir sair do jogo e retornar posteriormente sem perder o progresso salvo.

## 13. Fase 10 — Interface e experiência completa

### Objetivo

Concluir os fluxos de utilização.

### Tarefas

- [ ] Menu principal.
- [ ] Seleção de mundos.
- [ ] Criação de mundos.
- [ ] Configurações.
- [ ] HUD.
- [ ] Inventário.
- [ ] Crafting.
- [ ] Construção.
- [ ] Pausa.
- [ ] Confirmações.
- [ ] Feedback de interação.
- [ ] Acessibilidade.
- [ ] Adaptação para diferentes telas.

### Critérios de conclusão

Todas as telas e controles deverão funcionar e estar integrados às mecânicas reais.

## 14. Fase 11 — Testes e otimização

### Objetivo

Preparar o jogo para distribuição.

### Tarefas

- [ ] Testes unitários.
- [ ] Testes de integração.
- [ ] Testes de navegador.
- [ ] Testes de salvamento.
- [ ] Testes de geração.
- [ ] Testes de controles móveis.
- [ ] Testes de desempenho.
- [ ] Testes de sessões prolongadas.
- [ ] Correção de bugs.
- [ ] Verificação de licenças.
- [ ] Verificação de acessibilidade.
- [ ] Revisão de segurança.
- [ ] Otimização de assets.
- [ ] Revisão de documentação.

### Critérios de conclusão

Não deverão existir falhas críticas conhecidas que impeçam a experiência principal.

## 15. Fase 12 — Lançamento

### Objetivo

Disponibilizar uma versão estável e documentada.

### Tarefas

- [ ] Preparar build de produção.
- [ ] Configurar hospedagem.
- [ ] Preparar página oficial.
- [ ] Atualizar README.
- [ ] Publicar changelog.
- [ ] Publicar créditos.
- [ ] Revisar licenças.
- [ ] Documentar requisitos.
- [ ] Preparar instruções de contribuição.
- [ ] Publicar versão inicial.

### Critérios de conclusão

A versão deverá ser instalável ou acessível conforme a distribuição escolhida, possuir documentação e oferecer uma experiência funcional completa.

## 16. Futuras expansões

Estas funcionalidades não fazem parte dos requisitos obrigatórios do primeiro lançamento.

### Conteúdo

- [ ] Novos biomas.
- [ ] Novos animais.
- [ ] Novos materiais.
- [ ] Novas receitas.
- [ ] Novas estruturas.
- [ ] Novos elementos ambientais.
- [ ] Mais opções de personalização.

### Sistemas

- [ ] Suporte a mods.
- [ ] Ferramentas para criação de conteúdo.
- [ ] Compartilhamento de mundos.
- [ ] Sistemas comunitários.
- [ ] Expansões de progressão.

### Multiplayer

O multiplayer deverá ser avaliado separadamente, incluindo arquitetura de rede, sincronização, segurança e infraestrutura.

Não comprometer a arquitetura inicial com uma implementação prematura.

## 17. Critérios gerais de conclusão

Uma fase somente poderá ser marcada como concluída quando:

- Todas as funcionalidades previstas estiverem implementadas.
- Os sistemas estiverem integrados.
- Os testes relevantes estiverem passando.
- Não existirem erros críticos conhecidos.
- A documentação estiver atualizada.
- O desempenho estiver dentro das metas estabelecidas.
- A compatibilidade estiver verificada.

## 18. Controle de progresso

Utilizar os checkboxes deste documento para acompanhar o desenvolvimento.

Atualizar o roadmap conforme decisões técnicas e resultados reais.

Não marcar tarefas como concluídas apenas porque foram iniciadas ou porque existe uma interface visual.

## 19. Regra final

O Raiz será desenvolvido de forma progressiva, mas cada entrega deverá representar trabalho real e verificável.

A prioridade é construir um jogo completo, estável, original e sustentável, sem sacrificar sua identidade ou qualidade para cumprir prazos artificiais.
