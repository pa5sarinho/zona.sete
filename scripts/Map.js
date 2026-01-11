import { tileRange } from "./objects/tilerange.js";

export class Map
{
    constructor(mapDocObject, gridSize)
    {
        this.mapDocObject = mapDocObject;
        this.gridSize = gridSize;
        this.surfaceMap = [];

        // calculando altura com 45 graus de rotação e hipotenusa gridSize
        this.gridHeight = Math.round(.707106781 * this.gridSize);
        // comprimento da sombra do quadrado com rotação de 60 graus
        this.gridWidth = Math.round(.5 * this.gridSize + .866025404 * this.gridSize);
    }

    draw(width, height, wallMap = [], fade = 1)
    // desenha mapa isométrico através de array 2D com formato em losango/diamante
    {
        let grid_Xaxis = Math.floor(width/this.gridSize);
        let grid_Yaxis = Math.floor(height/this.gridSize);

        let x = 0;
        let y = 0;
        let arrayIndex = 0;
        let decrease = 0;
        
        let fadeDistance = (this.surfaceMap.length/3) * fade;
        let fadeIndex = 0;
        let fadeArray = [];
        let i = 0;
        let fadeInOut = 0;
        
        let randomTile = 0;
        let minRange = 0;
        let maxRange = 0;

        for (let y_index = 0; y_index < this.surfaceMap.length; y_index++)
        {
            const grid_row = document.createElement('div');
            grid_row.className = 'grid-row';
            grid_row.id = y_index;

            x = this.gridWidth * y_index + this.gridWidth;
            y = (this.gridHeight/2) * y_index;

            // se estiver diminuindo, reverte as posições iniciais
			if (y_index > 0) {
				if (this.surfaceMap[y_index].length <= this.surfaceMap[y_index-1].length)
				{
					decrease++;
					x -= decrease * (this.gridWidth);
					y += decrease - (1 * decrease);
					fadeInOut--;
				}
				else { fadeInOut++; }
			}

            for (let x_index = 0; x_index < this.surfaceMap[y_index].length; x_index++)
            {
                const grid = document.createElement('div');
                grid.className = 'grid-item';
                grid.style.height = this.gridSize + "px";
                grid.style.width = this.gridSize + "px";

				grid.style.top = y - ((this.surfaceMap[y_index].length-1)/2) * (this.gridHeight/2) + (this.gridHeight/2) * x_index - 40;
				grid.style.right = x - (this.gridWidth/2) * x_index - 220;
                
                grid.id = `(${x_index}, ${y_index})`;

                if (x_index <= this.surfaceMap[y_index].length/2)
                {
                	grid.style.opacity = (fadeDistance * fadeInOut + x)/100;
                	fadeArray.push(grid.style.opacity);
                	fadeIndex++;
                }
                else { 
                	i++;
                	grid.style.opacity = fadeArray[fadeArray.length-i];
                	fadeIndex--;
                }

                // escolhe um tile aleatorio pra cada categoria de chão

				minRange = tileRange[this.surfaceMap[y_index][x_index]][0];
				maxRange = tileRange[this.surfaceMap[y_index][x_index]][1] + 1;
                randomTile = Math.floor(Math.random() * (maxRange - minRange) + minRange);
				grid.style.backgroundImage = `url(../assets/map/${randomTile}.png)`;
				
                grid_row.appendChild(grid);
            }
            this.mapDocObject.appendChild(grid_row);
            console.log(fadeArray, i);
            fadeIndex /= y_index**3 + 1;
            fadeArray = [];
            i = 0;
        }
    }

    translate(mapSection)
    // transforma array 2D de mapa quadrado em formato diamante para argumento em draw()
    // é importante que o tamanho dos arrays sejam impares e iguais para altura e largura
    // exemplo visual:
    //
	// 3 2 1 0 1 2 3              0
	// 3 2 1 0 1 2 3            1 0 1
	// 3 2 1 0 1 2 3          2 1 0 1 2
	// 3 2 1 0 1 2 3   ->   3 2 1 0 1 2 3
	// 3 2 1 0 1 2 3          2 1 0 1 2
	// 3 2 1 0 1 2 3            1 0 1
	// 3 2 1 0 1 2 3              0
    {
    	let isometricMap = [];
    	let middlePointIndex = 0;
    	let maxLen = 1;
    	let len = 1;
    	let turningPoint = mapSection.length;
    	mapSection.forEach((element) => {
    		let a = new Array();
    		middlePointIndex = Math.floor(element.length/2);

    		a.push(element[middlePointIndex]);
    		if (len != 1) {
	    		for (let i = 1; i <= Math.floor(len/2); i++)
	    		{
	    			a.unshift(element[middlePointIndex-i]);
	    			a.push(element[middlePointIndex+i]);
	    		}
    		}
    		if (maxLen < turningPoint)
    		{ 
    			len += 2;
    			maxLen += 2;
    		}
    		else { len -= 2; }
    		isometricMap.push(a);
    	});
    	this.surfaceMap = isometricMap;
    	return isometricMap;
    }
}
