# Art Guidelines — Raiz

## 1. Objetivo

Definir a identidade artística oficial do Raiz.

Toda arte deverá respeitar estas diretrizes para manter consistência entre personagens, ambientes, criaturas, objetos e interface.

## 2. Identidade visual

Raiz utiliza Pixel Art original.

A identidade deverá transmitir:

- Natureza.
- Exploração.
- Criatividade.
- Vida.
- Aventura.
- Personalidade.

O estilo deverá ser reconhecível sem depender de elementos visuais de outros jogos.

Não utilizar sprites extraídos, copiados ou reproduzidos de jogos comerciais.

## 3. Filosofia artística

A arte deverá parecer cuidadosamente desenhada por uma pessoa.

Isso significa:

- Silhuetas reconhecíveis.
- Detalhes intencionais.
- Texturas coerentes.
- Animações naturais.
- Proporções consistentes.
- Variação visual controlada.
- Uso consciente de cores.

Imagens geradas automaticamente não devem ser incorporadas diretamente como arte final sem revisão e adaptação para o estilo Pixel Art oficial.

## 4. Grade e resolução

### Unidade-base

Adotar inicialmente:

- Tile padrão: 16 × 16 pixels.
- Personagens: dimensões múltiplas da unidade-base.
- Objetos: dimensões variáveis conforme sua função.
- Interface: elementos alinhados à mesma grade visual.

Tiles maiores poderão ser utilizados quando houver justificativa artística.

A resolução lógica do jogo deverá ser independente da resolução física do dispositivo.

### Regras

- Não utilizar redimensionamento fracionário dos sprites.
- Preservar bordas nítidas.
- Utilizar alinhamento consistente.
- Evitar suavização automática.
- Evitar pixels de tamanhos inconsistentes.

## 5. Paleta oficial

A paleta deve ser organizada por famílias de cores.

### Natureza

| Família | Direção |
|---|---|
| Vegetação | Verdes naturais |
| Grama | Verdes claros e médios |
| Árvores | Verdes profundos |
| Madeira | Marrons naturais |
| Solo | Tons terrosos |

### Ambiente

| Família | Direção |
|---|---|
| Céu | Azuis suaves |
| Água | Azuis e cianos |
| Pedra | Cinzas neutros |
| Areia | Amarelos terrosos |
| Cavernas | Tons escuros controlados |

### Iluminação

| Família | Direção |
|---|---|
| Luz solar | Amarelos quentes |
| Noite | Azuis profundos |
| Iluminação artificial | Tons quentes |
| Sombras | Tons escuros derivados do ambiente |

### Interface

A interface deverá possuir uma paleta independente, mas coerente com o universo do jogo.

Cores funcionais:

- Informação.
- Sucesso.
- Aviso.
- Erro.
- Seleção.
- Desativado.

### Regras de cores

- Não escolher cores aleatoriamente.
- Não utilizar saturação excessiva.
- Evitar contrastes inadequados.
- Documentar novas cores.
- Reutilizar cores existentes sempre que possível.

Os valores HEX oficiais deverão ser registrados em `src/config/art/palette.ts` ou arquivo equivalente.

## 6. Personagens

Todos os personagens deverão possuir:

- Silhueta identificável.
- Proporções consistentes.
- Paleta controlada.
- Animações coerentes.
- Estados visuais distintos.

### Animações necessárias

- Parado.
- Caminhando.
- Pulando.
- Caindo.
- Interagindo.
- Coletando.
- Recebendo feedback de dano.
- Outras ações específicas.

As animações deverão preservar a identidade do personagem.

## 7. Criaturas

As criaturas devem possuir identidades visuais próprias.

Cada criatura deverá definir:

- Silhueta.
- Tamanho.
- Paleta.
- Animações.
- Expressões ou sinais visuais.
- Características do bioma.

Evitar reutilizar o mesmo desenho com pequenas alterações de cor para representar criaturas completamente diferentes.

## 8. Tilesets

Os tilesets deverão seguir padrões de encaixe.

### Categorias

- Grama.
- Terra.
- Pedra.
- Areia.
- Água.
- Madeira.
- Vegetação.
- Materiais construídos.
- Elementos decorativos.

### Regras

- Bordas compatíveis.
- Transições naturais.
- Texturas não excessivamente repetitivas.
- Variações controladas.
- Compatibilidade com geração procedural.

Os tiles deverão funcionar corretamente em diferentes combinações de terreno.

## 9. Biomas

Cada bioma deverá possuir uma identidade própria.

Definir:

- Paleta.
- Vegetação.
- Terreno.
- Elementos ambientais.
- Criaturas.
- Recursos.
- Elementos decorativos.

As transições entre biomas deverão parecer naturais.

## 10. Iluminação e sombras

A iluminação deverá complementar a arte sem prejudicar sua leitura.

Regras:

- Utilizar sombras consistentes.
- Evitar gradientes excessivamente suaves.
- Preservar o estilo pixelado.
- Controlar o contraste.
- Adaptar a iluminação ao ciclo de dia e noite.

## 11. Interface visual

A interface deverá seguir a identidade do Raiz.

### Elementos

- Ícones.
- Botões.
- Inventário.
- Slots.
- Barras.
- Menus.
- Janelas.
- Indicadores.
- Tooltips.

### Regras

- Utilizar formas coerentes.
- Manter alinhamento.
- Preservar legibilidade.
- Evitar excesso de decoração.
- Criar estados visuais claros.
- Manter consistência entre desktop e celular.

## 12. Tipografia

Utilizar fontes legíveis e adequadas ao universo visual.

A fonte deverá:

- Possuir licença compatível.
- Suportar caracteres acentuados.
- Funcionar em diferentes resoluções.
- Ter boa legibilidade em tamanhos pequenos.

## 13. Animações

As animações devem transmitir movimento natural.

Evitar:

- Movimentos bruscos sem intenção.
- Quadros inconsistentes.
- Alterações desnecessárias de proporção.
- Excesso de efeitos.
- Animações que prejudiquem a leitura.

## 14. Organização dos arquivos

Organizar os recursos por categoria.

Exemplo:

```text
public/assets/
├── sprites/
│   ├── player/
│   ├── creatures/
│   ├── objects/
│   └── items/
├── tilesets/
│   ├── terrain/
│   ├── vegetation/
│   └── structures/
├── ui/
├── audio/
└── fonts/
```

Utilizar nomes descritivos e consistentes.

## 15. Formatos e otimização

- PNG para sprites e recursos com transparência.
- Formatos adequados para áudio.
- Atlas de texturas quando apropriado.
- Evitar arquivos duplicados.
- Evitar recursos maiores que o necessário.
- Carregar recursos sob demanda.

## 16. Licenciamento

Os recursos originais deverão ser identificados.

Recursos externos deverão possuir:

- Nome.
- Autor.
- Origem.
- Licença.
- Atribuição exigida.

Não incorporar recursos sem verificar seus termos de utilização.

## 17. Revisão artística

Antes de aprovar uma arte, verificar:

- Está no estilo oficial?
- Possui proporções coerentes?
- Utiliza a paleta correta?
- É visualmente reconhecível?
- Funciona na escala do jogo?
- Possui boa legibilidade?
- É original?
- Possui licença documentada?

## 18. Regra final

A identidade artística do Raiz deve ser consistente, original e reconhecível.

Não sacrificar a qualidade visual para produzir grandes quantidades de conteúdo rapidamente.
