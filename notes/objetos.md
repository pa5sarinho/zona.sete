# Objetos

## Animais

`animais` (sessão espécies) é o que contém todas as informações básicas de cada espécie, enquanto `Bicho` (sessão indivíduos) é o ser individual habitante do mundo, com características e vivências próprias que fazem dele, ele.

Construtor da classe `Bicho` recebe um objeto json (de `animais.js`) que representa sua especie. Exemplo: ao criar um gato, deve-se passar `animais.gato_domestico`. Ele já contém todos os atributos necessarios na sua forma padrão.

### Espécies em animais.js

#### Dietas

`animais.diet` e `animais.diet_id`

1. Carnivoro
2. Herbivoro
3. Insetivoro
4. Onivoro

#### Habitos

`animais.habits`

1. Noturno
2. Diurno

### Indivíduos

#### Conhecimento

`Bicho.knowledge`

Uma lista com os códigos identificadores de cada conhecimento dominado (por exemplo: leitura, fazer fogo). Conhecimentos são coisas que o sim sabe fazer que são binárias, ou seja, que podem ser respondidas com sim ou não.

#### Habilidades

`Bicho.skills`

Uma lista com os códigos identificadores de cada skill, junto com seu nível de habilidade. Exemplos são: mecânica, informática, carpintaria, culinária. As habilidades têm níveis de afinidade atrelados, que podem definir se um sim está ou não apto a realizar alguma atividade, a velocidade com que algo é feito ou até mesmo a qualidade e durabilidade de suas criações.

#### Necessidades

As necessidades funcionam num intervalo de 0 a 100. Em alguns, 50 é o nível "normal", em outros, o nível 0 é o desejado e nos demais deve mirar mais próximo do 100. Abaixo estão descrições e os efeitos de cada intervalo.

+ **fome** `Bicho.hunger`: abaixo do 50, o animal está com fome. Abaixo de 30, faminto. Abaixo de 20, ele começa a levar dano por malnutrição. Se ele continua comendo após atingir 100, pode ganhar o status de empanturrado.

+ **stress** `Bicho.stress`: aumenta à medida que o sim se sente em apuros ou ameaçado, além de quando suas necessidades não estão sendo supridas. Mantê-lo elevado por muito tempo causa sintomas psicológicos indesejados.

+ **temperatura** `Bicho.temp`: o valor 50 representa uma temperatura corporal normal. Variações de +/- 20 já têm impactos na saúde do animal e é indicado buscar abrigo ou usar camadas extras de proteção. Valores abaixo de 10 e acima de 90 são mortais e muito incomuns, mas que você pode testemunhar ao ser queimado vivo ou trancado num freezer.

#### Características da Personalidade

+ **amicabilidade** `Bicho.friendly`: valor de 0 a 1 que indica a facilidade de formar laços com o animal. Valores próximos de 0 aumentam as chances de comportamentos violentos e/ou ariscos. Espécies já têm valores base em sua definição, mas pode variar de indivíduo para indivíduo.
