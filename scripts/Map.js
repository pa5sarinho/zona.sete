export class Map
{
    constructor(mapDocObject, gridSize)
    {
        this.mapDocObject = mapDocObject;
        this.gridSize = gridSize;
    }

    draw(width, height, surfaceMap = [], wallMap = [], fade = 1)
    // desenha mapa isométrico através de array 2D com formato em losango/diamante
    {
        let grid_Xaxis = Math.floor(width/this.gridSize);
        let grid_Yaxis = Math.floor(height/this.gridSize);

		// calculando altura com 45 graus de rotação e hipotenusa gridSize
        const gridHeight = Math.round(.707106781 * this.gridSize);
        // comprimento da sombra do quadrado com rotação de 60 graus
        const gridWidth = Math.round(.5 * this.gridSize + .866025404 * this.gridSize);

        let x = 0;
        let y = 0;
        let arrayIndex = 0;
        let decrease = 0;
        let fadeDistance = (surfaceMap.length/3) * fade;
        let fadeIndex = 0;
        let fadeArray = [];
        let i = 0;

        for (let y_index = 0; y_index < surfaceMap.length; y_index++)
        {
            const grid_row = document.createElement('div');
            grid_row.className = 'grid-row';
            grid_row.id = y_index;

            x = gridWidth * y_index + gridWidth - 80;
            y = (gridHeight/2) * y_index - 90;

            // se estiver diminuindo, reverte as posições iniciais
			if (y_index > 0) {
				if (surfaceMap[y_index].length <= surfaceMap[y_index-1].length)
				{
					decrease++;
					x -= decrease * (gridWidth);
					y += decrease;
					console.log(x, y);
				}
			}

            for (let x_index = 0; x_index < surfaceMap[y_index].length; x_index++)
            {
                const grid = document.createElement('div');
                grid.className = 'grid-item';
                grid.style.height = this.gridSize + "px";
                grid.style.width = this.gridSize + "px";

				grid.style.top = y - ((surfaceMap[y_index].length-1)/2) * (gridHeight/2) + (gridHeight/2) * x_index;
				grid.style.right = x - (gridWidth/2) * x_index;
                
                grid.id = `(${x_index}, ${y_index})`;

                if (x_index <= surfaceMap[y_index].length/2)
                {
                	grid.style.opacity = ((fadeDistance-(10*fade)) * fadeIndex + y_index)/100;
                	fadeArray.push(grid.style.opacity);
                	fadeIndex++;
                }
                else { 
                	i++;
                	grid.style.opacity = fadeArray[fadeArray.length-i];
                	fadeIndex--;
                	}

                //if (wallMap[arrayIndex] > 0) {
                //	grid.style.opacity = 1;
                //	grid.style.backgroundImage = `url(../assets/map/${wallMap[y_index][x_index]}.png)`;
                //}
                
				grid.style.backgroundImage = `url(../assets/map/${surfaceMap[y_index][x_index]}.png)`;
				
                grid_row.appendChild(grid);

                //y += gridHeight/2;
            }
            this.mapDocObject.appendChild(grid_row);
            console.log(fadeArray, i);
            fadeIndex /= y_index**3 + 1;
            fadeArray = [];
            i = 0;
        }
    }
}
