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

    draw(width, height, wallMap = [])
    // desenha mapa isométrico através de array 2D com formato em losango/diamante
    {
        let grid_Xaxis = Math.floor(width/this.gridSize);
        let grid_Yaxis = Math.floor(height/this.gridSize);

        let x = 0;
        let y = 0;
        let arrayIndex = 0;
        let decrease = 0;
        
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
				}
			}

            for (let x_index = 0; x_index < this.surfaceMap[y_index].length; x_index++)
            {
                const grid = document.createElement('div');
                grid.className = 'grid-item';
                grid.style.height = this.gridSize + "px";
                grid.style.width = this.gridSize + "px";
                //grid.style.filter = "brightness(0.15)";

				grid.style.top = y - ((this.surfaceMap[y_index].length-1)/2) * (this.gridHeight/2) + (this.gridHeight/2) * x_index - 40;
				grid.style.right = x - (this.gridWidth/2) * x_index - 220;
                
                grid.id = `(${x_index}, ${y_index})`;

                // escolhe um tile aleatorio pra cada categoria de chão

				minRange = tileRange[this.surfaceMap[y_index][x_index]][0];
				maxRange = tileRange[this.surfaceMap[y_index][x_index]][1] + 1;
                randomTile = Math.floor(Math.random() * (maxRange - minRange) + minRange);
				grid.style.backgroundImage = `url(../assets/map/${randomTile}.png)`;
				
                grid_row.appendChild(grid);
            }
            this.mapDocObject.appendChild(grid_row);
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

    addEffect(posX, posY, coreRadius, endRadius, effect, intensity = 4, luminosity = 1)
    // posX, posY: posicao xy de onde o efeito inicia
    // coreRadius, endRadius: raio limite do efeito maximo, raio até onde o efeito diminui
    // effect: tipo do efeito
    // intensity: intensidade de evolução (valores maiores demoram mais para diminuir)
    // luminosity: (para brightness) valores entre 0 e 1 são luzes fracas, valores entre 1 e 2 são luzes muito fortes
    {
    	if (effect == "fog")
    	{
    		document.getElementById(`(${posX}, ${posY})`).style.opacity = 1;
    	}
    	else if (effect == "brightness")
    	{
    		document.getElementById(`(${posX}, ${posY})`).style.filter = `brightness(${luminosity})`;
    	}

    	// raio de efeito que sofre com a diminuição do mesmo, passar 0 se nao for usar
    	if (endRadius > 0)
    	{
    		let x = 0;
		    let y = 0;
		    let t = 0;
		    
			for (let i = 1; i <= endRadius; i++)
	    	{
	    		let outerEffectMath = 1-((i-1)/(endRadius-1))**(intensity/2);
	    		try 
	    		{
	    			if (posY-i >= Math.floor(this.surfaceMap.length/2)) x = i+i;
	   		    	if (posY+i <= Math.floor(this.surfaceMap.length/2)) y = i+i;
	   		    	else {
	   		    		if (y != 0)
	   		    		{
	   		    			if (t == 0) t = (i-1);
	   		    			y = t*2;	
	   		    			console.log(i, y);
	   		    		}
	   		    	}
	   		    	
		    		if (effect == "fog")
			    	{
			    		
			    		// north
			    		document.getElementById(`(${posX-i+x}, ${posY-i})`).style.opacity = outerEffectMath;
			    		// south
			    		document.getElementById(`(${posX-i+y}, ${posY+i})`).style.opacity = outerEffectMath;
			    		// east
			    		document.getElementById(`(${posX+i}, ${posY})`).style.opacity = outerEffectMath;
			    		// west
			    		document.getElementById(`(${posX-i}, ${posY})`).style.opacity = outerEffectMath;

			    		//preenchimento da cruz
			    		for (let j = 1; j <= endRadius-(i*i/endRadius); j++)
			    		{
			    			document.getElementById(`(${posX-i-j+x}, ${posY-i})`).style.opacity = outerEffectMath - ((j-1)/(endRadius-1))**(intensity);
			    			document.getElementById(`(${posX-i+j+x}, ${posY-i})`).style.opacity = outerEffectMath - ((j-1)/(endRadius-1))**(intensity);
			    			document.getElementById(`(${posX-i-j+y}, ${posY+i})`).style.opacity = outerEffectMath - ((j-1)/(endRadius-1))**(intensity);
			    			document.getElementById(`(${posX-i+j+y}, ${posY+i})`).style.opacity = outerEffectMath - ((j-1)/(endRadius-1))**(intensity);
			    		}
			    	}
			    	
			    	else if (effect == "brightness")
			    	{
			    		// north
			    		document.getElementById(`(${posX-i+x}, ${posY-i})`).style.filter = `brightness(${outerEffectMath * luminosity})`;
			    		// south
			    		document.getElementById(`(${posX-i+y}, ${posY+i})`).style.filter = `brightness(${outerEffectMath * luminosity})`;
			    		// east
			    		document.getElementById(`(${posX+i}, ${posY})`).style.filter = `brightness(${outerEffectMath * luminosity})`;
			    		// west
			    		document.getElementById(`(${posX-i}, ${posY})`).style.filter = `brightness(${outerEffectMath * luminosity})`;

			    		//preenchimento da cruz
			    		for (let j = 1; j <= endRadius-(i*i/endRadius); j++)
			    		{
			    			document.getElementById(`(${posX-i-j+x}, ${posY-i})`).style.filter = `brightness(${(outerEffectMath * luminosity) - ((j-1)/(endRadius-1))**(intensity)}`;
			    			document.getElementById(`(${posX-i+j+x}, ${posY-i})`).style.filter = `brightness(${(outerEffectMath * luminosity) - ((j-1)/(endRadius-1))**(intensity)}`;
			    			document.getElementById(`(${posX-i-j+y}, ${posY+i})`).style.filter = `brightness(${(outerEffectMath * luminosity) - ((j-1)/(endRadius-1))**(intensity)}`;
			    			document.getElementById(`(${posX-i+j+y}, ${posY+i})`).style.filter = `brightness(${(outerEffectMath * luminosity) - ((j-1)/(endRadius-1))**(intensity)}`;
			    		}
			    	}

			    	else { console.log('nenhum efeito foi aplicado'); }
	    		}
	    		catch(e) {
	    			console.log('tried applying effect on out of bounds position', i, 'tiles from', posX, posY);	
	    		}
	    	}
	    }

	    // raio de efeito que mantem a mesma intensidade em todo terreno, passar 0 se nao for usar
		if (coreRadius > 0)
		{
		    let x = 0;
		    let y = 0;
		    let t = 0;
		    
	    	for (let i = 1; i <= coreRadius; i++)
	   		{
	   		    try 
	   		    {
	   		    	if (posY-i >= Math.floor(this.surfaceMap.length/2)) x = i+i;
	   		    	if (posY+i <= Math.floor(this.surfaceMap.length/2)) y = i+i;
	   		    	else {
	   		    		if (y != 0)
	   		    		{
	   		    			if (t == 0) t = (i-1);
	   		    			y = t*2;	
	   		    			console.log(i, y);
	   		    		}
	   		    	}

	   		    	if (effect == "fog")
	   		    	{
						// north
			    		document.getElementById(`(${posX-i+x}, ${posY-i})`).style.opacity = 1;
			    		// south
			    		document.getElementById(`(${posX-i+y}, ${posY+i})`).style.opacity = 1;
			    		// east
			    		document.getElementById(`(${posX+i}, ${posY})`).style.opacity = 1;
			    		// west
			    		document.getElementById(`(${posX-i}, ${posY})`).style.opacity = 1;

			    		//preenchimento da cruz
			    		for (let j = 1; j <= coreRadius-(i*i/15); j++)
			    		{
			    			document.getElementById(`(${posX - i - j + x}, ${posY-i})`).style.opacity = 1;
			    			document.getElementById(`(${posX - i + j + x}, ${posY-i})`).style.opacity = 1;
			    			document.getElementById(`(${posX - i - j + y}, ${posY+i})`).style.opacity = 1;
			    			document.getElementById(`(${posX - i + j + y}, ${posY+i})`).style.opacity = 1;
			    		}
	   		    	}

	   		    	else if (effect == "brightness")
	   		    	{
	   		    		// north
			    		document.getElementById(`(${posX-i+x}, ${posY-i})`).style.filter = `brightness(${luminosity})`;
			    		// south
			    		document.getElementById(`(${posX-i+y}, ${posY+i})`).style.filter = `brightness(${luminosity})`;
			    		// east
			    		document.getElementById(`(${posX+i}, ${posY})`).style.filter = `brightness(${luminosity})`;
			    		// west
			    		document.getElementById(`(${posX-i}, ${posY})`).style.filter = `brightness(${luminosity})`;

			    		//preenchimento da cruz
			    		for (let j = 1; j <= coreRadius-(i*i/15); j++)
			    		{
			    			document.getElementById(`(${posX - i - j + x}, ${posY-i})`).style.filter = `brightness(${luminosity})`;
			    			document.getElementById(`(${posX - i + j + x}, ${posY-i})`).style.filter = `brightness(${luminosity})`;
			    			document.getElementById(`(${posX - i - j + y}, ${posY+i})`).style.filter = `brightness(${luminosity})`;
			    			document.getElementById(`(${posX - i + j + y}, ${posY+i})`).style.filter = `brightness(${luminosity})`;
			    		}
	   		    	}
	    		}
	    		catch(e) {
	    			console.log('tried applying effect on out of bounds position', i, 'tiles from', posX, posY);
	    		}
	   		}
	   	}
    }
}
