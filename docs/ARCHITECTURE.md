# Architecture — Raiz

## 1. Objetivo

Definir a arquitetura técnica do Raiz.

O projeto deverá possuir uma estrutura modular, eficiente, testável e preparada para atualizações.

## 2. Stack oficial

| Tecnologia | Utilização |
|---|---|
| TypeScript | Linguagem principal |
| Phaser 3 | Engine 2D |
| Vite | Build e servidor de desenvolvimento |
| HTML5 | Estrutura da aplicação |
| CSS | Interface complementar |
| WebGL | Renderização principal |
| Canvas | Alternativa de renderização |
| IndexedDB | Persistência |
| Vitest | Testes unitários |
| Playwright | Testes de navegador |

As versões das dependências deverão ser controladas e atualizadas com testes de compatibilidade.

## 3. Princípios arquiteturais

- Separação de responsabilidades.
- Baixo acoplamento.
- Alta coesão.
- Modularidade.
- Reutilização.
- Testabilidade.
- Previsibilidade.
- Manutenção simples.

Não criar abstrações desnecessárias.

A arquitetura deverá resolver problemas reais do projeto.

## 4. Camadas principais

### Core

Responsável pela inicialização e gerenciamento geral.

Inclui:

- Inicialização.
- Configurações.
- Gerenciamento de estados.
- Eventos internos.
- Ciclo de vida.
- Tratamento global de erros.

### Engine

Responsável pela integração com Phaser.

Inclui:

- Inicialização da engine.
- Configuração de renderização.
- Cenas.
- Câmera.
- Física.
- Carregamento de recursos.

### World

Responsável pelo mundo do jogo.

Inclui:

- Chunks.
- Tiles.
- Biomas.
- Terrenos.
- Modificações.
- Entidades do mundo.

### Generation

Responsável pela geração procedural.

Inclui:

- Seeds.
- Ruído procedural.
- Geração de terreno.
- Biomas.
- Cavernas.
- Recursos naturais.

### Entities

Responsável pelas entidades.

Inclui:

- Animais.
- Criaturas.
- Objetos.
- Elementos interativos.

### Player

Responsável pelo jogador.

Inclui:

- Movimentação.
- Estados.
- Colisões.
- Interações.
- Animações.

### Systems

Responsável pelas mecânicas independentes.

Inclui:

- Inventário.
- Crafting.
- Construção.
- Sobrevivência.
- Interação.
- Progressão.

### Rendering

Responsável pela apresentação visual.

Inclui:

- Tiles.
- Sprites.
- Animações.
- Iluminação.
- Câmera.
- Efeitos.

### UI

Responsável pela interface.

Inclui:

- Menus.
- Inventário.
- Crafting.
- Configurações.
- HUD.
- Diálogos.

### Controls

Responsável pelas entradas.

Inclui:

- Teclado.
- Mouse.
- Touchscreen.
- Mapeamento de ações.
- Configurações de controles.

### Audio

Responsável pela reprodução sonora.

Inclui:

- Música.
- Efeitos.
- Ambiente.
- Volume.
- Gerenciamento de áudio.

### Persistence

Responsável pelo armazenamento.

Inclui:

- IndexedDB.
- Salvamento.
- Carregamento.
- Exportação.
- Importação.
- Migrações.

## 5. Estrutura de diretórios

```text
src/
├── core/
│   ├── Game.ts
│   ├── GameConfig.ts
│   └── EventBus.ts
├── engine/
│   ├── scenes/
│   ├── physics/
│   └── camera/
├── world/
│   ├── chunks/
│   ├── tiles/
│   └── biomes/
├── generation/
│   ├── noise/
│   ├── terrain/
│   └── structures/
├── entities/
│   ├── animals/
│   ├── creatures/
│   └── objects/
├── player/
├── systems/
│   ├── inventory/
│   ├── crafting/
│   ├── building/
│   ├── survival/
│   └── interaction/
├── rendering/
├── ui/
├── controls/
├── audio/
├── persistence/
├── config/
└── main.ts
```

Os módulos podem possuir subdiretórios conforme crescerem.

## 6. Gerenciamento do mundo

O mundo deverá utilizar uma estrutura baseada em chunks.

Cada chunk deverá possuir:

- Coordenadas.
- Dimensões.
- Tiles.
- Entidades relevantes.
- Estado de modificação.
- Informações necessárias para persistência.

O tamanho do chunk deverá ser configurável e definido após testes de desempenho.

### Ciclo de vida

1. Identificar regiões próximas do jogador.
2. Solicitar geração ou carregamento.
3. Preparar os dados.
4. Atualizar a renderização.
5. Manter o estado necessário.
6. Descarregar regiões distantes.
7. Persistir modificações relevantes.

## 7. Geração procedural

A geração deverá ser independente da renderização.

O gerador recebe:

- Seed.
- Configurações.
- Versão do gerador.
- Coordenadas.

E produz dados determinísticos do mundo.

Não depender de valores aleatórios globais sem controle.

A geração deverá permitir testes independentes da engine gráfica.

## 8. Sistemas orientados a dados

Itens, blocos, receitas e criaturas deverão utilizar definições centralizadas.

Cada definição deverá possuir identificadores estáveis.

Evitar espalhar nomes e propriedades de itens pelo código.

As definições deverão ser validadas antes de serem utilizadas.

## 9. Sistema de eventos

Utilizar eventos internos para comunicação entre módulos quando houver benefício.

Exemplos:

- Item coletado.
- Bloco removido.
- Mundo carregado.
- Jogador movimentado.
- Inventário atualizado.
- Construção realizada.

Regras:

- Tipagem dos eventos.
- Nomes consistentes.
- Evitar eventos duplicados.
- Remover assinaturas quando não forem mais necessárias.
- Não utilizar eventos para substituir chamadas diretas simples.

## 10. Física e colisões

Utilizar Phaser Arcade Physics como solução inicial.

A física deverá controlar:

- Movimento.
- Gravidade.
- Colisões.
- Pulos.
- Interações físicas necessárias.

Evitar utilizar corpos físicos individuais para todos os tiles quando uma abordagem otimizada por região for suficiente.

## 11. Interface

A interface deverá permanecer separada da lógica central do jogo.

O sistema de UI poderá utilizar HTML/CSS para menus e interfaces complementares, mantendo a renderização do mundo dentro do Phaser.

A comunicação deverá ocorrer por interfaces tipadas e eventos bem definidos.

## 12. Persistência

Utilizar IndexedDB para salvar dados estruturados.

Separar:

- Metadados dos mundos.
- Dados dos chunks.
- Estado do jogador.
- Inventário.
- Configurações.

### Versionamento

Cada salvamento deverá possuir:

- Versão do formato.
- Identificador do mundo.
- Seed.
- Data de atualização.
- Dados necessários para recuperação.

Implementar migrações para formatos antigos.

Não presumir que os dados salvos sempre estarão íntegros.

## 13. Compatibilidade

A arquitetura deverá considerar:

- Navegadores desktop.
- Navegadores Android.
- Diferentes proporções de tela.
- Diferentes capacidades de GPU.
- Variações de memória disponível.

A execução básica não deverá depender de serviços externos.

## 14. Testabilidade

Cada sistema deverá possuir limites claros para permitir testes isolados.

Utilizar:

- Vitest para testes unitários.
- Testes de integração para sistemas conectados.
- Playwright para fluxos no navegador.

Priorizar testes de geração, inventário, construção e persistência.

## 15. Dependências

Toda dependência deverá possuir justificativa.

Antes de adicionar uma biblioteca:

1. Verificar sua finalidade.
2. Avaliar manutenção.
3. Avaliar tamanho.
4. Verificar licença.
5. Avaliar impacto de desempenho.
6. Verificar alternativas já disponíveis.

## 16. Evolução arquitetural

A arquitetura deverá permitir futuras expansões sem exigir reescrita completa.

Suporte a mods, multiplayer e outras funcionalidades avançadas não deverá ser implementado antes de existir uma necessidade definida.

## 17. Regra final

A arquitetura deve facilitar a evolução do Raiz.

Não adicionar complexidade sem necessidade e não concentrar sistemas independentes em um único módulo.
