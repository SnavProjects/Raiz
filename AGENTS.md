# AGENTS.md — Raiz

> Documento principal de regras, arquitetura, desenvolvimento e qualidade do projeto Raiz.
>
> Todas as pessoas, agentes de IA e ferramentas automatizadas que contribuírem para o projeto devem seguir estas diretrizes.

## 1. Identidade do projeto

**Nome:** Raiz  
**Categoria:** 2D Sandbox Survival  
**Estilo artístico:** Pixel Art original  
**Plataforma inicial:** Web (desktop e dispositivos móveis)  
**Idioma padrão:** Português brasileiro  
**Licença do código:** MIT

Raiz é um jogo sandbox de sobrevivência em 2D, com exploração, construção, coleta de recursos, criação de itens e liberdade para o jogador desenvolver seu próprio mundo.

O jogo deve possuir personalidade própria.

### Princípios fundamentais

- Liberdade e criatividade.
- Exploração e descoberta.
- Sobrevivência e progressão.
- Mundos com variedade e personalidade.
- Identidade visual original.
- Código eficiente e sustentável.
- Experiência consistente em computadores e celulares.
- Comunidade e desenvolvimento aberto.

Raiz pode ter referências ao gênero sandbox survival, mas não deve copiar identidade, personagens, mapas, sprites, interfaces, músicas ou outros elementos de jogos existentes.

## 2. Regras obrigatórias para agentes de IA

Todo agente que trabalhar no projeto deve:

1. Ler este documento antes de modificar qualquer código.
2. Analisar a arquitetura existente antes de implementar funcionalidades.
3. Respeitar as decisões técnicas e visuais estabelecidas.
4. Não duplicar funcionalidades existentes.
5. Não substituir sistemas completos sem justificativa técnica.
6. Não remover funcionalidades para facilitar uma implementação.
7. Não utilizar implementações falsas, simulações ou dados estáticos como substitutos de funcionalidades reais.
8. Não deixar botões sem funcionamento.
9. Não criar telas sem implementar suas respectivas funcionalidades.
10. Não introduzir dependências desnecessárias.
11. Não modificar a licença sem autorização.
12. Não introduzir recursos de terceiros sem verificar suas licenças.
13. Não declarar uma funcionalidade concluída sem testes.
14. Documentar alterações importantes.
15. Preservar a compatibilidade entre sistemas existentes.

### Regra de autorização

Quando uma alteração puder modificar substancialmente a arquitetura, a identidade visual, a experiência de jogo ou remover funcionalidades, deve ser apresentada para aprovação antes de ser executada.

Correções pequenas e necessárias podem ser realizadas diretamente, desde que respeitem estas regras.

## 3. Tecnologias oficiais

A implementação deve utilizar:

| Tecnologia | Responsabilidade |
|---|---|
| TypeScript | Linguagem principal |
| Phaser 3 | Engine 2D |
| Vite | Desenvolvimento e build |
| HTML5 | Estrutura da aplicação |
| CSS | Interface complementar |
| WebGL | Renderização principal |
| Canvas | Alternativa de renderização |
| IndexedDB | Salvamento local |
| Vitest | Testes unitários |
| Playwright | Testes de integração e navegador |

### Regras técnicas

- Utilizar TypeScript com verificações rigorosas.
- Evitar `any`.
- Utilizar módulos e responsabilidades bem definidas.
- Não misturar lógica de interface com lógica de mundo.
- Evitar dependências circulares.
- Centralizar configurações.
- Não implementar sistemas complexos em arquivos gigantes.
- Manter compatibilidade com navegadores modernos.
- Não depender de serviços externos para executar o jogo básico.

## 4. Arquitetura do projeto

A arquitetura deve ser modular, organizada e preparada para expansão.

Separar claramente:

- Engine e inicialização.
- Sistema de mundo.
- Geração procedural.
- Renderização.
- Jogador.
- Entidades e criaturas.
- Inventário.
- Crafting.
- Construção.
- Sobrevivência.
- Interface.
- Áudio.
- Salvamento.
- Controles.
- Configurações.

### Organização sugerida

```text
raiz/
├── public/
│   ├── assets/
│   │   ├── sprites/
│   │   ├── tilesets/
│   │   ├── audio/
│   │   ├── fonts/
│   │   └── ui/
│   └── favicon.ico
├── src/
│   ├── core/
│   ├── engine/
│   ├── world/
│   ├── generation/
│   ├── entities/
│   ├── player/
│   ├── systems/
│   │   ├── inventory/
│   │   ├── crafting/
│   │   ├── building/
│   │   ├── survival/
│   │   ├── combat/
│   │   └── interaction/
│   ├── rendering/
│   ├── ui/
│   ├── controls/
│   ├── audio/
│   ├── persistence/
│   ├── config/
│   └── main.ts
├── tests/
├── docs/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE
├── THIRD_PARTY_NOTICES.md
└── AGENTS.md
```

A estrutura pode evoluir conforme a necessidade, mas a separação de responsabilidades deve ser preservada.

## 5. Identidade visual e Pixel Art

A identidade visual do Raiz deve ser original, reconhecível e consistente.

### Diretrizes artísticas

- Pixel Art desenhada especificamente para o Raiz.
- Estilo próprio de personagens, criaturas e ambientes.
- Proporções consistentes entre sprites.
- Animações construídas com cuidado.
- Texturas e materiais visualmente distinguíveis.
- Cenários com profundidade e personalidade.
- Uso intencional de luz, sombra e contraste.
- Evitar aparência genérica de imagens geradas automaticamente.
- Não utilizar sprites extraídos de outros jogos.

### Paleta de cores

Criar uma paleta oficial com cores semânticas para:

- Vegetação.
- Solo e terrenos.
- Água.
- Madeira.
- Pedras e minerais.
- Céu.
- Iluminação.
- Sombras.
- Interface.
- Estados de interação.

A paleta deve possuir variantes para diferentes biomas, sem perder a identidade geral do jogo.

As cores devem ser documentadas em arquivos centralizados.

Não utilizar cores aleatórias em cada implementação.

### Consistência dos sprites

Definir e documentar:

- Tamanho-base dos tiles.
- Resolução dos sprites.
- Escala de renderização.
- Regras de alinhamento.
- Margens e áreas transparentes.
- Animações.
- Convenções de nomenclatura.

Utilizar renderização pixel-perfect, evitando filtros que deixem os pixels borrados.

## 6. Interface e experiência do jogador

A interface deve fazer parte da identidade do Raiz.

### Elementos necessários

- Menu principal.
- Novo mundo.
- Seleção de mundos.
- Carregamento de mundos.
- Configurações.
- Inventário.
- Barra de acesso rápido.
- Crafting.
- Construção.
- Indicadores de sobrevivência.
- Pausa.
- Confirmações.
- Alertas.
- Tela de morte ou encerramento da partida.
- Créditos.

### Regras de UI

- Interface legível e intuitiva.
- Elementos visuais consistentes.
- Tipografia apropriada para Pixel Art.
- Ícones originais.
- Animações discretas.
- Feedback visual para interações.
- Menus adaptáveis a diferentes resoluções.
- Não ocupar desnecessariamente a área de jogo.
- Evitar excesso de informações na tela.

A interface deve ser construída como um sistema reutilizável, não como elementos isolados.

## 7. Mundo e geração procedural

O mundo deve ser gerado proceduralmente.

### Requisitos

- Geração baseada em sementes (seeds).
- Mundos reproduzíveis usando a mesma seed e versão do gerador.
- Diferentes biomas.
- Terrenos variados.
- Cavernas.
- Recursos naturais.
- Vegetação.
- Lagos e rios.
- Estruturas naturais.
- Distribuição coerente de recursos.
- Transições naturais entre biomas.

### Gerenciamento do mundo

Implementar:

- Sistema de chunks.
- Carregamento de regiões próximas.
- Descarregamento de regiões distantes.
- Geração sob demanda.
- Persistência das modificações realizadas pelo jogador.
- Limites configuráveis de memória.

A geração não deve bloquear a interface ou provocar congelamentos durante a exploração.

## 8. Mecânicas principais

As funcionalidades abaixo representam os requisitos do jogo. Nenhuma deve ser considerada concluída apenas por possuir uma interface visual.

### 8.1 Jogador

- Movimentação.
- Pulo.
- Colisões.
- Interação com objetos.
- Animações.
- Estados do personagem.
- Controles configuráveis.

### 8.2 Mineração e coleta

- Diferentes tipos de blocos.
- Recursos naturais.
- Ferramentas.
- Tempo de coleta.
- Drops de recursos.
- Regras de resistência dos materiais.

### 8.3 Construção

- Colocação de blocos.
- Remoção de estruturas.
- Construção de casas.
- Diferentes materiais.
- Validação de posicionamento.
- Preservação das construções no salvamento.

### 8.4 Crafting

- Receitas.
- Materiais necessários.
- Validação de recursos.
- Criação de itens.
- Interface de receitas.
- Possibilidade de expansão das receitas.

### 8.5 Inventário

- Slots.
- Pilhas de itens.
- Limites de quantidade.
- Transferência entre slots.
- Seleção de itens.
- Barra de acesso rápido.
- Organização de recursos.

### 8.6 Criaturas e animais

- Animais passivos.
- Criaturas hostis fictícias.
- Comportamentos independentes.
- Movimentação.
- Animações.
- Reprodução e crescimento quando apropriado.
- Interações com o ambiente.

### 8.7 Ciclo de dia e noite

- Passagem do tempo.
- Mudança de iluminação.
- Céu dinâmico.
- Variação ambiental.
- Eventos relacionados aos períodos do dia.

### 8.8 Sobrevivência

- Fome.
- Saúde.
- Recuperação.
- Alimentação.
- Recursos de sobrevivência.
- Condições ambientais.

Os sistemas devem possuir regras claras e equilibradas.

## 9. Controles para computadores e celulares

O Raiz deve ser jogável tanto com teclado quanto com touchscreen.

### Computador

- Teclado.
- Mouse.
- Atalhos configuráveis.
- Interações com menus.
- Feedback de entrada.

### Celulares

Criar controles touchscreen próprios.

Requisitos:

- Direcional virtual.
- Botão de pulo.
- Botão de interação.
- Ações contextuais.
- Acesso rápido ao inventário.
- Controles para construção e coleta.
- Ajuste de posição e tamanho dos controles.
- Suporte a diferentes proporções de tela.
- Compatibilidade com orientação horizontal.
- Prevenção de gestos acidentais do navegador durante a partida.

### Qualidade dos controles

Os controles móveis devem ser projetados especificamente para telas sensíveis ao toque.

Não basta simplesmente reproduzir os botões do teclado na tela.

Evitar controles que escondam partes importantes do jogo.

## 10. Áudio e música

O áudio deve contribuir para a identidade do Raiz.

### Requisitos

- Música original.
- Sons ambientes.
- Sons de movimentação.
- Sons de interação.
- Sons de coleta.
- Sons de construção.
- Sons de interface.
- Sons de criaturas.
- Variações sonoras por ambiente.

### Licenciamento

Todo recurso de áudio deve possuir origem e licença documentadas.

São permitidos:

- Áudios produzidos originalmente para o projeto.
- Áudios com licença CC0.
- Áudios com licença CC BY 4.0, respeitando a atribuição.

Não utilizar músicas comerciais, gravações extraídas de jogos ou materiais sem autorização.

Criar um registro em `THIRD_PARTY_NOTICES.md` para recursos externos.

## 11. Salvamento e gerenciamento de mundos

O salvamento é um sistema fundamental.

### Requisitos

- Criar mundos.
- Excluir mundos com confirmação.
- Carregar mundos.
- Salvar alterações.
- Preservar inventário.
- Preservar construções.
- Preservar recursos coletados.
- Preservar a posição do jogador.
- Preservar a seed.
- Registrar versão do formato de salvamento.

### Confiabilidade

- Salvamento automático.
- Salvamento em momentos importantes.
- Tratamento de falhas.
- Migração de formatos antigos.
- Prevenção de corrupção.
- Exportação e importação de mundos.
- Recuperação de dados quando possível.

Utilizar IndexedDB para persistência local.

Não depender exclusivamente de `localStorage` para salvar mundos completos.

## 12. Desempenho e otimização

O código deve ser otimizado desde o início.

### Regras obrigatórias

- Evitar operações desnecessárias por frame.
- Evitar alocações excessivas de memória.
- Utilizar pooling quando houver benefício comprovado.
- Otimizar renderização de tiles.
- Utilizar carregamento sob demanda.
- Evitar processamento redundante de chunks.
- Controlar a quantidade de entidades ativas.
- Gerenciar corretamente eventos e recursos.
- Evitar vazamentos de memória.
- Utilizar estruturas de dados apropriadas.
- Medir o desempenho antes e depois de otimizações.

Não otimizar sacrificando a legibilidade sem justificativa técnica.

### Dispositivos móveis

Priorizar:

- Baixo consumo de memória.
- Carregamento rápido.
- Uso eficiente de CPU e GPU.
- Redução de travamentos.
- Controle de resolução.
- Gerenciamento de recursos gráficos.

O desempenho deve ser medido em dispositivos reais, não apenas em computadores de desenvolvimento.

## 13. Segurança e confiabilidade

- Validar dados carregados.
- Validar arquivos importados.
- Tratar erros de armazenamento.
- Evitar execução de conteúdo externo não confiável.
- Não armazenar informações pessoais desnecessárias.
- Não utilizar dependências desconhecidas sem avaliação.
- Não incluir segredos ou credenciais no repositório.

## 14. Acessibilidade

Implementar:

- Controles configuráveis.
- Ajustes de volume.
- Opções de contraste quando necessárias.
- Textos legíveis.
- Feedback visual além do áudio.
- Opções para reduzir animações.
- Interface adaptável.
- Alternativas para ações que dependam exclusivamente de gestos.

## 15. Testes e qualidade

Toda funcionalidade precisa ser testada.

### Testes necessários

- Testes unitários.
- Testes de integração.
- Testes de geração procedural.
- Testes de inventário.
- Testes de crafting.
- Testes de construção.
- Testes de salvamento.
- Testes de carregamento.
- Testes de controles.
- Testes de compatibilidade.
- Testes de desempenho.

### Regras

- Corrigir erros antes de considerar uma entrega concluída.
- Não ignorar erros de TypeScript.
- Não ignorar falhas de build.
- Não desativar testes para fazer o CI passar.
- Não utilizar mocks como substitutos dos testes reais de integração.
- Verificar regressões após alterações importantes.

## 16. Manutenção e atualizações

O projeto deve ser fácil de manter e expandir.

### Requisitos

- Código modular.
- Documentação atualizada.
- Convenções de nomenclatura.
- Dependências controladas.
- Configurações centralizadas.
- Sistemas independentes.
- Migrações documentadas.
- Histórico de alterações.
- Versionamento semântico quando aplicável.

Novas funcionalidades devem ser integradas sem comprometer sistemas existentes.

## 17. Licenciamento e propriedade intelectual

O código-fonte original do Raiz será distribuído sob MIT.

Os recursos artísticos, sonoros e documentais originais serão distribuídos sob CC BY 4.0, conforme seus respectivos arquivos de licença.

Materiais de terceiros devem respeitar suas próprias licenças.

Não presumir que uma licença de código autoriza automaticamente a reutilização de marcas, personagens ou recursos de terceiros.

## 18. Processo obrigatório de desenvolvimento

Antes de implementar qualquer funcionalidade:

1. Analisar o código existente.
2. Identificar dependências.
3. Verificar a arquitetura relacionada.
4. Planejar a implementação.
5. Identificar possíveis impactos.
6. Implementar de maneira modular.
7. Criar ou atualizar testes.
8. Executar verificações.
9. Corrigir problemas encontrados.
10. Atualizar a documentação.

Ao concluir:

- Informar arquivos modificados.
- Explicar o que foi implementado.
- Informar os testes realizados.
- Identificar limitações conhecidas.
- Diferenciar o que está concluído do que permanece pendente.

## 19. Critérios de conclusão

Uma funcionalidade somente pode ser considerada concluída quando:

- Está realmente implementada.
- Funciona na experiência de jogo.
- Está integrada aos sistemas necessários.
- Possui tratamento de erros.
- Foi testada.
- Não apresenta regressões conhecidas.
- Respeita a identidade visual.
- Funciona nos dispositivos suportados.
- Está documentada quando necessário.

Não aceitar funcionalidades falsas, botões decorativos ou telas sem comportamento real.

## 20. Visão de longo prazo

Raiz deve crescer como um jogo independente, aberto e sustentável.

A arquitetura deve permitir futuras expansões, como:

- Novos biomas.
- Novos materiais.
- Novos animais.
- Novas estruturas.
- Novos sistemas de crafting.
- Novas mecânicas de sobrevivência.
- Mais opções de personalização.
- Suporte a mods.
- Melhorias na geração procedural.
- Novos conteúdos criados pela comunidade.

Essas possibilidades não devem ser implementadas prematuramente. A prioridade é construir uma base sólida.

---

## Regra final

**Raiz não deve ser desenvolvido como um protótipo descartável.**

Cada sistema implementado deve ser funcional, integrado, testado e preparado para manutenção.

Priorize qualidade, originalidade, desempenho, estabilidade e liberdade criativa.

Não sacrifique a identidade do jogo para acelerar o desenvolvimento.

O objetivo é construir um jogo completo, com personalidade própria e uma base técnica que permita sua evolução por muitos anos.
