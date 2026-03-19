# Ideia Geral

Trata-se de um jogo de simulação de vida com mecânicas de sobrevivência e exploração. O cenário é baseado nas sub-regiões sertão, agreste e zona da mata dos estados de Pernambuco e Paraíba em uma linha do tempo fantasiosa em que humanos foram extintos nos anos 2000 e, anos depois, outros animais desenvolvem um nível de inteligência quase humana, capazes de se comunicar entre diferentes espécies, usar ferramentas e construir modelos de sociedade complexos.

O jogador começa com um animal no meio da cadeia alimentar e precisa sobreviver enquanto tenta recrutar outros animais para o seu grupo, com diferentes níveis de esforço e chance de sucesso, a depender da espécie, usando a premissa de que juntos em comunidade eles têm mais chances de sobrevivência. Tambem há a possibilidade de adicionar um mal maior (a ser definido).

Todos os animais recrutados podem ser controlados e trocados a qualquer momento (como em The Sims) e o número máximo de personagens será próximo de cem.

À medida que o jogador avança, a progressão se dá por aprender habilidades humanas ao estudar o que foi deixado para trás. Artesanato, pesca, agricultura, leitura, escrita, mecânica, eletrônica e eletrotécnica são alguns dos conhecimentos que podem ser adquiridos e aprimorados com treino e estudo.

Relações sociais podem ser cultivadas e, caso sejam geneticamente compatíveis, dois animais podem ter filhotes. A criação de comunidades é essencial para a organização do grupo. Cada um dos integrantes pode ser alocado em uma ocupação na qual trabalham enquanto não estão sendo controlados pelo jogador.

A ideia é que o mundo dê ao jogador a sensação de insegurança e que coisas podem dar errado a qualquer momento. Más escolhas ou descuidos podem fazê-lo perder um ou mais Sims para sempre, tendo em vista que a morte é permanente e irreversível, salvo no ato de carregar um save anterior e perder parte do seu progresso.

## Identidade visual

A interface do usuário se inspira em sistemas operacionais e sites dos anos 2000 e 90 com toques de geometria quadriculada, como em papéis. As cores principais são off-white e azul escuro, os elementos têm bordas quadradas e a fonte é monespaçada.

Toda a arte do jogo, seja assets do mapa, personagens ou interface, deve seguir uma paleta de cores limitada de 32 cores. As variações nessas cores se dão somente por filtros aplicados sobre o mapa, como mudanças de iluminação e fenômenos temporais.

Ela também tem resolução consistente com a resolução base de 1080p. Independente do tamanho da tela do usuário, a UI mantém as mesmas proporções da tela em 1080p. Se um asset de interface vai ocupar um espaço de 30 pixels por 30 pixels num canvas de 1080p, a pixel art deve ter 30x30 pixels. Distorções irão ocorrer na transformação para outras resoluções que nao sejam 4K. No mapa isso se torna ainda mais complicado por conta do zoom. Qualquer nível de zoom diferente do padrão (1) não terá pixel art perfeita.

O mapa é isométrico 2D, com seus assets renderizados a partir de modelagens 3D e posteriormente editados. Os assets inanimados (móveis, construção, plantas, pedras, etc.) terão 4 variações de rotação: norte, sul, leste e oeste (relativo ao mapa). Os assets de animais provavelmente terão 4 renders adicionais para diagonais.

Devido ao mapa isométrico de baixa resolução e estruturas modulares, o visual do jogo deve ficar parecido com The Sims 1 e Project Zomboid, porém com variações de relevo da superfície.

Cada espécie de animal terá uma "foto de perfil" (talvez com mais alguma coisa para diferenciar entre os indivíduos da mesma espécie) que vai aparecer na lista de seleção de personagens, ao lado do nome dele em qualquer menção e no mapa com a visão geral da região. Esse retrato deve ter 30x30 pixels.

## Lore

O jogo não tem foco algum em história, mas o worldbuilding é uma parte importante da sua identidade. Não bati o martelo na razão dos humanos terem sido extintos, mas estou estudando um cenário de pandemia. Um fungo desenvolvido em laboratório; fatal para humanos (e talvez outros primatas),porém estável em outros hospedeiros mamíferos, com mutação recente para infecção das aves. Ele afeta diretamente o sistema nervoso central, diminuindo o medo, aumentando a curiosidade e a sociabilidade do animal.

Ao iniciar o jogo, o jogador não tem nenhuma dessas informações. Todos os detalhes do que aconteceu, onde ele está e em que época ele está devem ser apresentados ao longo do gameplay, com storytelling visual/ambiental e pistas escritas que ficam mais acessíveis à medida que o seu sim progride intelectualmente (aprender a ler, usar computadores, etc)