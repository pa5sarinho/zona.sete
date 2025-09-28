# Fases de desenvolvimento

## Etapa 1: Funcionalidades básicas

Nesta etapa, toda a simulação e interação com o mundo/animais será à base de texto. O objetivo final é ter um ecossistema simples, mas que permite interações entre as diferentes classes de objetos num mapa 2D: animais, plantas, materiais e ferramentas.

| Tarefa                         | Fase 1                                                   | Fase 2                                |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| Criar espécies iniciais        | [ ] Definição de atributos básicos dos objetos (animais) | [ ] Expansão no número de espécies    |
| Criar simulação simples        | [ ] Modificadores de fome, humor, temperatura, etc.      | [ ] Interação com objetos inanimados  |
| Escrever funções do mapa       | [ ] Funções de corte e movimentação da "câmera"          | [ ] Posicionamento de objetos, regras |
| Criar itens iniciais           | [ ] Definição de atributos básicos de ferramentas, etc.  | [ ] Crafting simplificado             |
| Botânica e matérias primas     | [ ] Definição de atributos básicos de plantas e outros   | [ ] Expansão no número de materiais   |
| Design de interface grafica 1  | [ ] Framework de comandos para gameplay a base de texto  | [ ] Log GUI no navegador (texto)      |

## Etapa 2: Avançando a simulação

Nesta etapa, o foco continua sendo na gameplay à base de texto. No fim, o mundo simulado deve ser mais dinâmico e aparentar "vivo" além da visão e influência do jogador.

| Tarefa                         | Fase 1                                                   | Fase 2                                |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| Criar relógio                  | [ ] Criação de função do passar do tempo                 | [ ] Incluir tempo em ações existentes |
| Criar simulação social         | [ ] Modificadores de relacionamento e tipos de vínculos  | [ ] Ações de interação social         |
| Algoritmo de preenchimento mapa| [ ] Definir quais espécies devem spawnar onde/condições  | [ ] Escrever algoritmo de spawning    |
| Scripts de autonomia           | [ ] Definição de categorias e prioridade entre elas      | [ ] Decisões de satisfazer necs.      |
| Criar simulação hostilidade    | [ ] Ações territorialistas e de caça                     | [ ] Resposta de defesa e fuga         |

## Etapa 3: Adicionando personalidade

Nesta etapa, os elementos gráficos do jogo começam a aparecer. No final dela, "sims" terão personalidade própria e serão capazes de falar algumas frases.

| Tarefa                         | Fase 1                                                   | Fase 2                                |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| Interações sociais verbais     | [ ] Escrever set inicial de diálogos                     | [ ] Implementar condições para cada   |
| Design de interface gráfica 2  | [ ] Desenhar os primeiros ícones para teste + emoções    | [ ] Adicionar ícones no log           |
| Design do mapa 1               | [ ] Criação da primeira área fixa feita na mão           | [ ] Primeiros ícones do mapa          |
| Listar opções de interação     | [ ] Definir ações para interagir com cada objeto         | [ ] Design do menu no navegador       |
| Criar calendário               | [ ] Funções do calendário e interação com o relógio      |                                       |

## Etapa 4: Populando o mapa com atividades e lore

| Tarefa                         | Fase 1                                                   | Fase 2                                |
| ------------------------------ | -------------------------------------------------------- | ------------------------------------- |
| Design de interface gráfica 3  | [ ] Adicionar o grid do mapa na tela com ícones          | [ ] Adicionar menu ao clicar no mapa  |
| Progressão 1                   | [ ] Definição da árvore de desbloqueio de mecânicas      | [ ] Desbloqueio de relógio/calendário |
| Design do mapa 1               | [ ] Criação de serviços como lojinhas no mapa            | [ ] Adicionar itens de progressão     |
| Listar opções de interação     | [ ] Escrever os primeiros textos deixados por humanos    | [ ] Design do menu no navegador       |
