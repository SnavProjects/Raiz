# Performance Guidelines — Raiz

## 1. Objetivo

Definir os requisitos de desempenho e otimização do Raiz.

O jogo deverá funcionar de maneira estável em computadores e dispositivos móveis, incluindo aparelhos com recursos limitados.

Otimização deve fazer parte do desenvolvimento desde o início.

## 2. Princípios

- Eficiência.
- Baixo consumo de memória.
- Renderização previsível.
- Carregamento eficiente.
- Processamento controlado.
- Ausência de operações redundantes.
- Estabilidade durante sessões prolongadas.

Não sacrificar legibilidade e manutenção sem justificativa técnica.

## 3. Metas de desempenho

As metas iniciais são objetivos de engenharia, não resultados já comprovados.

| Indicador | Meta inicial |
|---|---|
| FPS em dispositivos adequados | 60 FPS |
| FPS em dispositivos limitados | 30 FPS estáveis |
| Tempo de frame a 60 FPS | Aproximadamente 16,67 ms |
| Travamentos prolongados | Evitar |
| Vazamentos de memória | Nenhum conhecido |
| Carregamento | Progressivo e sem bloquear a interface |

Os resultados deverão ser medidos em dispositivos reais.

## 4. Renderização

### Regras

- Utilizar WebGL quando disponível.
- Manter Canvas como alternativa.
- Evitar chamadas de renderização desnecessárias.
- Evitar criação excessiva de objetos gráficos.
- Utilizar atlas de texturas quando apropriado.
- Reutilizar recursos gráficos.
- Evitar filtros pesados.
- Preservar pixel-perfect rendering.

### Tiles

Não renderizar o mundo inteiro continuamente sem necessidade.

Priorizar:

- Chunks visíveis.
- Atualizações localizadas.
- Reutilização de recursos.
- Culling de elementos fora da câmera.

## 5. Gerenciamento de chunks

O gerenciamento de chunks deverá controlar memória e processamento.

### Requisitos

- Carregar regiões próximas.
- Descarregar regiões distantes.
- Evitar gerar o mesmo chunk repetidamente.
- Manter cache limitado.
- Persistir modificações.
- Priorizar regiões relevantes para o jogador.

O tamanho e a distância de carregamento deverão ser ajustáveis.

## 6. Geração procedural

A geração deverá evitar bloquear o jogo.

Regras:

- Separar cálculo e renderização.
- Evitar recalcular dados existentes.
- Utilizar resultados em cache quando apropriado.
- Controlar o trabalho por etapas.
- Priorizar regiões próximas.
- Evitar geração desnecessária de regiões distantes.

Web Workers poderão ser utilizados quando a separação de dados e o custo de comunicação justificarem sua adoção.

## 7. Memória

Controlar o consumo de:

- Texturas.
- Áudio.
- Entidades.
- Chunks.
- Objetos temporários.
- Dados de geração.
- Estruturas de interface.

### Regras

- Liberar recursos não utilizados.
- Evitar referências desnecessárias.
- Evitar duplicação de assets.
- Utilizar carregamento sob demanda.
- Controlar caches.
- Evitar grandes estruturas temporárias.
- Monitorar crescimento de memória durante sessões prolongadas.

## 8. Entidades

Não manter todas as entidades ativas permanentemente.

Utilizar gerenciamento por proximidade.

Considerar:

- Distância do jogador.
- Estado da entidade.
- Necessidade de atualização.
- Relevância para o mundo.
- Necessidade de persistência.

Entidades distantes poderão utilizar simulação simplificada quando isso preservar a coerência do mundo.

## 9. Física

A física deverá ser executada apenas para os elementos necessários.

Evitar:

- Corpos físicos desnecessários.
- Colisões redundantes.
- Verificações repetidas.
- Simulação de entidades irrelevantes.

Utilizar estruturas de colisão apropriadas para o mundo baseado em tiles.

## 10. Código TypeScript

### Regras

- Evitar loops desnecessários.
- Evitar processamento repetido.
- Evitar conversões excessivas.
- Evitar alocações por frame.
- Utilizar tipos precisos.
- Evitar abstrações com custo desnecessário.
- Controlar listeners e callbacks.
- Evitar operações síncronas pesadas.

Não utilizar micro-otimizações sem evidências de benefício.

## 11. Interface

A interface não deverá prejudicar a performance do jogo.

- Evitar atualizações completas desnecessárias.
- Atualizar somente elementos alterados.
- Evitar animações contínuas sem necessidade.
- Reduzir efeitos em dispositivos limitados.
- Controlar o número de elementos visíveis.

## 12. Áudio

- Carregar recursos conforme necessidade.
- Evitar múltiplas reproduções acidentais.
- Controlar sons simultâneos.
- Liberar recursos quando apropriado.
- Utilizar formatos adequados.
- Evitar arquivos excessivamente grandes.

## 13. Dispositivos móveis

O jogo deverá considerar limitações de:

- CPU.
- GPU.
- Memória.
- Temperatura.
- Bateria.
- Resolução.
- Entrada touchscreen.

Disponibilizar configurações gráficas adequadas.

Evitar exigir desempenho máximo de todos os dispositivos.

## 14. Rede e dependências externas

A experiência principal deverá funcionar offline após os recursos necessários serem carregados.

Não criar dependência de servidores para movimentação, construção, inventário ou salvamento local.

## 15. Monitoramento

Durante o desenvolvimento, medir:

- FPS.
- Tempo de frame.
- Tempo de geração.
- Tempo de carregamento.
- Consumo de memória.
- Quantidade de entidades.
- Quantidade de chunks ativos.
- Uso de CPU e GPU quando disponível.

Não utilizar estimativas como resultados de benchmark.

## 16. Testes de desempenho

Executar testes em:

- Computadores.
- Celulares Android.
- Diferentes resoluções.
- Mundos pequenos.
- Mundos extensos.
- Regiões com muitas entidades.
- Sessões prolongadas.

Registrar os resultados para comparar versões.

## 17. Processo de otimização

1. Identificar o problema.
2. Medir o comportamento atual.
3. Localizar o gargalo.
4. Escolher uma solução.
5. Implementar.
6. Medir novamente.
7. Verificar regressões.
8. Documentar o resultado.

## 18. Critérios de aprovação

Uma alteração não deverá ser considerada uma otimização apenas por parecer mais rápida.

É necessário demonstrar que:

- O comportamento continua correto.
- O consumo de recursos não piorou significativamente.
- A manutenção continua viável.
- Não foram introduzidos erros.
- Os testes continuam passando.

## 19. Regra final

A performance do Raiz deve ser construída com decisões técnicas justificadas e medições reais.

Priorizar estabilidade, eficiência e compatibilidade em vez de otimizações artificiais.
