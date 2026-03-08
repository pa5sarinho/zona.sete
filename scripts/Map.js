import { tileRange } from "./objects/tilerange.js";

export class Map
{
    constructor(mapDocObject, gridSize)
    {
        this.mapDocObject = mapDocObject;
        this.gridSize = gridSize; // gridSize^2 é justamente os cm^2 na escala do mapa
        this.surfaceMap = [];
		this.altitudeMap = [];
		this.textureMap = [];
		this.gridTile = null;
		this.gridctx = null;
		this.canvasPositionX = 0;
		this.canvasPositionY = 0;

        // calculando altura com 45 graus de rotação e hipotenusa gridSize
        // this.gridHeight = Math.round(.707106781 * this.gridSize);
        // comprimento da sombra do quadrado com rotação de 60 graus
        // this.gridWidth = Math.round(.5 * this.gridSize + .866025404 * this.gridSize);
        this.gridWidth  = 61 * (this.gridSize/45);
		this.gridHeight = [
			30, 37, 41
		]

		this.hoverTile = {x:0,y:0}

		this.imageCache = {}

		this.camera = {
			x: 50,
			y: 1000,
			speed: 500
		}
    }

    draw()
    // desenha mapa isométrico através de array 2D com formato em losango/diamante
    {
		const canvas = document.getElementById("map");
		const ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false

		ctx.clearRect(0,0,canvas.width,canvas.height);

		const camTileX =
			(this.camera.x/(this.gridWidth/2) +
			this.camera.y/(this.gridHeight[0]/2)) / 2

		const camTileY =
			(this.camera.y/(this.gridHeight[0]/2) -
			this.camera.x/(this.gridWidth/2)) / 2

		const centerX = Math.floor(camTileX);
		const centerY = Math.floor(camTileY);

		const range = 30;

        for (let y_index = centerY-range; y_index < centerY+range; y_index++)
        {
			if(!this.surfaceMap[y_index]) continue;

            for (let x_index = centerX-range; x_index < centerX+range; x_index++)
            {
				if(this.surfaceMap[y_index][x_index] === undefined) continue;

				let level = this.altitudeMap[y_index][x_index];
				
				const img = this.loadImg(`../assets/map/${level}/${this.textureMap[y_index][x_index]}.png`);
				this.drawTile(x_index, y_index, img, canvas, ctx);
            }
        }
    }

	loadImg(src)
	{

		if(!this.imageCache[src]){

			const img = new Image();
			img.src = src;

			this.imageCache[src] = img;
		}

		return this.imageCache[src];

	}
	drawGrid()
	{
		const canvas = document.getElementById("grid");
		const ctx = canvas.getContext("2d");

		for (let y_index = -50; y_index < 500; y_index++)
		{
			for (let x_index = -50; x_index < 500; x_index++)
            {
				const pos = {
					x: (x_index - y_index) * (this.gridWidth/2),
					y: (x_index + y_index) * (this.gridHeight[0]/2) + this.gridHeight[0]
				}

				const screenX = pos.x - canvas.width/2;
				const screenY = pos.y - canvas.height/2;

				ctx.drawImage(
					this.gridTile,
					screenX - this.gridWidth/2,
					screenY
				)
			}
		}
		
	}

	drawTile(tileX, tileY, img, canvas, ctx)
	{
		const pos = {
			x: (tileX - tileY) * this.gridWidth/2,
			y: (tileX + tileY) * (this.gridHeight[0]/2)
		};

		const screenX = pos.x - this.camera.x + canvas.width/2;
		const screenY = pos.y - this.camera.y + canvas.height/2;

		let offsetX = img.width / 2;
		let offsetY = img.height - this.gridHeight[0];

		if (this.hoverTile.x == tileX && this.hoverTile.y == tileY)
			offsetY += 3;

		ctx.drawImage(
			img,
			screenX - offsetX,
			screenY - offsetY
		)
	}

	createGridTile()
	{
		const c = document.createElement("canvas");
		c.width = this.gridWidth;
		c.height = this.gridHeight[0];

		const ctx = c.getContext("2d");

		ctx.beginPath()
		ctx.moveTo(this.gridWidth/2, 0);
		ctx.lineTo(this.gridWidth, (this.gridHeight[0])/2);
		ctx.lineTo(this.gridWidth/2, this.gridHeight[0]);
		ctx.lineTo(0, (this.gridHeight[0])/2);
		ctx.closePath();

		ctx.strokeStyle = "#5986b2";
		ctx.stroke();

		this.gridTile = c;
		this.gridctx = this.gridTile.getContext("2d");
		console.log('grid tile ', c)
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
    	return isometricMap;
    }

	// moveView(x, y)
	// {
	// 	this.canvasPositionX -= x;
	// 	this.canvasPositionY += y;
	// 	this.mapDocObject.style.top = this.canvasPositionY;
	// 	this.mapDocObject.style.right = this.canvasPositionX;
	// }

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
    
    changeTile(tileID, newTile, newHeight)
    {
    	const regex = /$$\s*([+-]?\d+)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*$$/;
    	const x = 0;
    	const y = 0;
		while ((match = regex.exec(texto)) !== null) {
			x = parseFloat(match[1]); // coordenada x
			y = parseFloat(match[2]); // coordenada y
    	}
    	
		//escolhe um tile aleatorio pra cada categoria de chão
		let minRange = tileRange[newTile][0];
		let maxRange = tileRange[newTile][1] + 1;
		let randomTile = Math.floor(Math.random() * (maxRange - minRange) + minRange);
		this.surfaceMap[x][y] = randomTile;
    	this.altitudeMap[x][y] = newHeight;
		return this.loadImg(`../assets/map/${newHeight}/${randomTile}.png`);
    }
}
