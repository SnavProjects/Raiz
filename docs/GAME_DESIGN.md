# Game Design Document — Raiz

## 1. Visão geral

Raiz é um jogo 2D Sandbox Survival com Pixel Art original, centrado na exploração, sobrevivência, criatividade e construção.

O jogador deve ter liberdade para explorar um mundo procedural, coletar recursos, construir estruturas, descobrir ambientes e desenvolver sua própria experiência.

O jogo não deve impor uma única maneira de jogar.

### Pilares de design

1. Liberdade: permitir diferentes maneiras de explorar e construir.
2. Descoberta: recompensar a curiosidade do jogador.
3. Criatividade: oferecer ferramentas para criar e modificar o mundo.
4. Sobrevivência: introduzir desafios que deem propósito à exploração.
5. Progressão: permitir evolução sem limitar artificialmente o jogador.
6. Originalidade: estabelecer mecânicas e identidade próprias.

## 2. Perspectiva e jogabilidade

- Perspectiva 2D lateral.
- Mundo construído com tiles.
- Movimento horizontal e vertical por meio de pulo e interação com o terreno.
- Exploração de superfícies e ambientes subterrâneos.
- Construção livre.
- Interação com objetos e entidades.
- Câmera acompanhando o jogador.

A movimentação deve ser fluida e previsível.

## 3. Geração de mundos

Cada mundo deve possuir uma identidade própria.

### Criação de mundo

O jogador poderá:

- Criar um mundo.
- Definir seu nome.
- Escolher uma seed.
- Selecionar configurações de geração.
- Escolher uma dificuldade.
- Iniciar a exploração.

### Geração procedural

O sistema deverá gerar:

- Terrenos.
- Montanhas.
- Planícies.
- Florestas.
- Desertos.
- Regiões úmidas.
- Cavernas.
- Lagos.
- Rios.
- Recursos naturais.
- Estruturas naturais.

Os biomas deverão possuir características próprias, incluindo vegetação, cores, recursos e criaturas.

### Seeds

A mesma seed, utilizando a mesma versão do gerador e as mesmas configurações, deverá produzir o mesmo mundo inicial.

Alterações realizadas pelo jogador deverão ser preservadas independentemente da geração original.

## 4. Exploração

A exploração é uma atividade central.

Implementar:

- Diferentes biomas.
- Regiões subterrâneas.
- Recursos raros.
- Estruturas naturais.
- Pontos de interesse.
- Variações ambientais.
- Descobertas progressivas.

O jogador deve encontrar motivos para continuar explorando.

Evitar mundos repetitivos e distribuição excessivamente previsível de recursos.

## 5. Mineração e coleta

O mundo deverá ser composto por diferentes materiais.

Cada material poderá possuir:

- Identificador.
- Nome.
- Textura.
- Resistência.
- Categoria.
- Recursos obtidos.
- Ferramentas apropriadas.
- Regras de coleta.

A mineração deverá atualizar o mundo e gerar recursos reais para o inventário.

## 6. Construção

O jogador deverá poder criar estruturas livremente.

### Funcionalidades

- Colocar blocos.
- Remover blocos.
- Construir paredes.
- Criar pisos.
- Criar telhados.
- Colocar portas.
- Instalar iluminação.
- Posicionar móveis e objetos.
- Personalizar construções.

As construções deverão permanecer salvas quando o jogador sair do mundo.

## 7. Crafting

O crafting permitirá transformar recursos em novos itens.

### Categorias

- Ferramentas.
- Materiais.
- Construção.
- Iluminação.
- Utilidades.
- Equipamentos.
- Decoração.

Cada receita deverá definir:

- Identificador.
- Ingredientes.
- Quantidades.
- Resultado.
- Quantidade produzida.
- Requisitos adicionais, quando aplicáveis.

A interface deverá informar quais recursos estão disponíveis e quais faltam.

O sistema deverá ser orientado por dados para facilitar a adição de receitas.

## 8. Inventário

O inventário será responsável pelo armazenamento dos itens.

### Funcionalidades

- Slots.
- Empilhamento.
- Limites de quantidade.
- Seleção de itens.
- Transferência entre espaços.
- Barra de acesso rápido.
- Organização.
- Descarte.
- Separação de categorias, quando necessário.

O inventário deverá permanecer consistente durante salvamentos e carregamentos.

## 9. Criaturas e animais

O mundo deverá possuir vida própria.

### Categorias

- Animais passivos.
- Animais que interagem com o ambiente.
- Criaturas hostis fictícias.
- Criaturas específicas de determinados biomas.

### Comportamentos

- Movimentação.
- Descanso.
- Alimentação.
- Reações ao ambiente.
- Interação com outras entidades.
- Animações.
- Estados comportamentais.

As criaturas deverão possuir comportamentos adequados ao ambiente em que vivem.

Evitar manter entidades desnecessariamente ativas quando estiverem longe do jogador.

## 10. Sobrevivência

O sistema de sobrevivência deverá oferecer desafios sem tornar a experiência excessivamente punitiva.

### Atributos

- Saúde.
- Fome.
- Recuperação.
- Condições ambientais.

A fome deverá influenciar a recuperação e o planejamento do jogador.

Alimentos poderão possuir características diferentes.

A dificuldade deverá ser configurável.

## 11. Ciclo de dia e noite

Implementar um ciclo temporal completo.

### Períodos

- Amanhecer.
- Dia.
- Entardecer.
- Noite.

### Efeitos

- Mudança gradual de iluminação.
- Alteração das cores do ambiente.
- Variação de atividade das criaturas.
- Sons ambientais.
- Eventos específicos de determinados períodos.

A iluminação não deverá comprometer a legibilidade da Pixel Art.

## 12. Progressão

A progressão deverá ser baseada principalmente em exploração e descoberta.

### Progressão proposta

1. Descoberta dos recursos básicos.
2. Criação de ferramentas.
3. Construção de abrigo.
4. Exploração de novos ambientes.
5. Descoberta de materiais diferentes.
6. Desenvolvimento de construções mais elaboradas.
7. Acesso a novas receitas.
8. Personalização avançada do mundo.

Não utilizar progressão excessivamente linear.

O jogador deverá poder escolher quais atividades deseja priorizar.

## 13. Sistema de mundos

Implementar gerenciamento completo de mundos.

- Criar.
- Renomear.
- Carregar.
- Excluir.
- Salvar.
- Exportar.
- Importar.
- Exibir informações.
- Recuperar dados quando possível.

Cada mundo deverá possuir identificação e versão próprias.

## 14. Interface e experiência

A interface deverá conter:

- Menu principal.
- Seleção de mundos.
- Criação de mundos.
- Inventário.
- Crafting.
- Barra de acesso rápido.
- Configurações.
- Pausa.
- Indicadores de sobrevivência.
- Informações contextuais.

A interface deverá ser adaptada para desktop e touchscreen.

## 15. Áudio

Criar uma identidade sonora própria.

Incluir:

- Música ambiente.
- Sons de natureza.
- Sons de interação.
- Sons de movimentação.
- Sons de coleta.
- Sons de construção.
- Sons de criaturas.
- Sons de interface.

Todos os recursos deverão possuir licenciamento documentado.

## 16. Configurações

O jogador deverá poder configurar:

- Volume geral.
- Música.
- Efeitos sonoros.
- Sensibilidade dos controles.
- Tamanho dos controles touchscreen.
- Escala da interface.
- Opções gráficas.
- Idioma.
- Recursos de acessibilidade.

## 17. Salvamento

O progresso deverá ser salvo localmente.

O salvamento deverá preservar:

- Mundo.
- Seed.
- Jogador.
- Inventário.
- Construções.
- Recursos modificados.
- Criaturas e estados persistentes.
- Tempo do mundo.
- Configurações individuais.

## 18. Escopo inicial e expansões

O lançamento inicial deverá priorizar uma experiência completa de um jogador.

Funcionalidades futuras possíveis:

- Suporte a modificações (mods).
- Novos biomas.
- Novos conteúdos.
- Mais opções de personalização.
- Novos sistemas ambientais.
- Compartilhamento de mundos.
- Recursos comunitários.

Multijogador não faz parte do escopo inicial e deverá receber um projeto técnico separado caso seja aprovado.

## 19. Critério de qualidade

Uma mecânica somente estará concluída quando estiver integrada ao jogo, possuir comportamento real, tratamento de erros e testes.

O objetivo é entregar uma experiência completa, não apenas uma coleção de telas e sistemas isolados.
