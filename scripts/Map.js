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
		this.lightingMap = [];
		this.spriteMap = [];
		this.gridTile = null;
		this.gridctx = null;
		this.mapEditor = true;

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
			y: 900,
			z: 1,
			speed: 500
		}
    }

    draw(ctx, canvas, lightCtx, lightCanvas)
    // desenha mapa isométrico através de array 2D com formato em losango/diamante
    {
		// ctx.filter = "brightness(.7)";
		ctx.imageSmoothingEnabled = false;

		ctx.clearRect(0,0,canvas.width,canvas.height);
		lightCtx.clearRect(0,0, lightCanvas.width, lightCanvas.height);

		const camTileX =
			(this.camera.x/(this.gridWidth/2) +
			this.camera.y/(this.gridHeight[0]/2)) / 2

		const camTileY =
			(this.camera.y/(this.gridHeight[0]/2) -
			this.camera.x/(this.gridWidth/2)) / 2

		const centerX = Math.floor(camTileX);
		const centerY = Math.floor(camTileY);

		let range = Math.ceil(34/this.camera.z);
		// mantendo capado em zoom de 0.7 por questoes de performance...
		if (this.camera.z < 0.7) range = Math.ceil(34/0.7)

        for (let y_index = centerY-range; y_index < centerY+range; y_index++)
        {
			if(!this.surfaceMap[y_index]) continue;

            for (let x_index = centerX-range; x_index < centerX+range; x_index++)
            {
				if(this.surfaceMap[y_index][x_index] === undefined) continue;

				let level = this.altitudeMap[y_index][x_index];

				const tile = this.loadImg(`../assets/map/${level}/${this.textureMap[y_index][x_index]}.png`);
				this.drawTile(x_index, y_index, tile, canvas, ctx);

				if (this.lightingMap[x_index][y_index] != 0)
					this.drawLightOverTile(x_index, y_index, 100*this.lightingMap[x_index][y_index], lightCtx, lightCanvas);
				
				if (this.spriteMap[y_index][x_index] != ' ') 
				{
					const prop = this.loadImg(`../assets/sprites/${this.spriteMap[y_index][x_index]}.png`);
					this.drawSpriteOnTile(x_index, y_index, prop, canvas, ctx, level);
				}
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

		const screenX = (pos.x - this.camera.x) * this.camera.z + canvas.width/2;
		const screenY = (pos.y - this.camera.y) * this.camera.z + canvas.height/2;

		let offsetX = img.width / 2;
		let offsetY = img.height - this.gridHeight[0];

		ctx.save();
		if (this.mapEditor && this.hoverTile.x == tileX && this.hoverTile.y == tileY) {
			ctx.filter = "brightness(1.2)";
		}

		// const light = this.lightingMap[tileY][tileX];

		// if (light > 1)
		// 	ctx.filter = `brightness(${light}) saturate(${light})`;

		ctx.drawImage(
			img,
			screenX - offsetX * this.camera.z,
			screenY - offsetY * this.camera.z,
			img.width * this.camera.z,
			img.height * this.camera.z
		)
		// ctx.filter = "none";
		ctx.restore()
	}

	drawSpriteOnTile(tileX, tileY, img, canvas, ctx, level)
	{
		const pos = {
			x: (tileX - tileY) * this.gridWidth/2,
			y: (tileX + tileY) * (this.gridHeight[0]/2)
		};

		const distanceFromGround = (level / 4);

		const screenX = (pos.x - this.camera.x) * this.camera.z + canvas.width/2;
		const screenY = (pos.y - this.camera.y) * this.camera.z + canvas.height/2;

		let offsetX = img.width / 2;
		let offsetY = img.height - distanceFromGround;

		ctx.drawImage(
			img,
			screenX - offsetX * this.camera.z,
			screenY - offsetY * this.camera.z,
			img.width * this.camera.z,
			img.height * this.camera.z
		)
	}

	addLight(tileX, tileY, radius, intensity)
	// adiciona iluminacao radial aos tiles individualmente (canvas de tiles)
	{
		if (radius == 0) return;
		for (let y = -radius; y <= radius; y++){
			for (let x = -radius; x <= radius; x++){

				const gx = tileX + x;
				const gy = tileY + y;

				if (!this.lightingMap[gy] || this.lightingMap[gy][gx] === undefined)
					continue;

				const dist = Math.sqrt(x*x + y*y);

				if (dist > radius) continue;

				const falloff = 2 - dist / radius;

				this.lightingMap[gy][gx] = falloff * intensity;
			}
		}
	}

	addSinglePointLight(x, y, radius)
	// adiciona iluminacao em 1 tile para uso com drawLightOverTile (canvas de luz)
	{
		this.lightingMap[y][x] = radius;
	}

	drawLightOverTile(x, y, radius, ctx, canvas)
	// renderiza iluminacao por cima dos tiles (canvas de luz)
	{
		const pos = {
			x: (x - y) * this.gridWidth/2,
			y: (x + y) * (this.gridHeight[0]/2)
		};

		const screenX = (pos.x - this.camera.x) * this.camera.z + canvas.width/2;
		const screenY = (pos.y - this.camera.y) * this.camera.z + canvas.height/2;
		const isoRatio = (this.gridHeight[0] / this.gridWidth); 

		ctx.save();

		ctx.translate(screenX, screenY);
		ctx.scale(1, isoRatio);

		// let offsetX = 0;
		// let offsetY = this.gridHeight[0];

		const gradient = ctx.createRadialGradient(
			0, 0, 0,
			0, 0, radius * this.camera.z
		);

		gradient.addColorStop(0, "rgba(255, 226, 123, 0.4)");
		gradient.addColorStop(0.3, "rgba(255, 204, 128, 0.2)");
		gradient.addColorStop(1, "rgba(255,200,120,0)");

		ctx.globalCompositeOperation = "overlay";

		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(
			0,
			0,
			radius * this.camera.z, 0, Math.PI*2)
		ctx.fill();

		ctx.globalCompositeOperation = "source-over";
		ctx.restore();
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

	createSpriteOnTile(tileX, tileY, sprite)
	{
		this.spriteMap[tileY][tileX] = sprite;
	}

	applyNightTint(ctx, canvas, darkness=1)
	{
		if (darkness === 0) darkness += .1;
		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = `rgb(${52 / darkness}, ${69 / darkness}, ${121 / darkness})`;
		ctx.globalAlpha = .7
		ctx.fillRect(0,0,canvas.width,canvas.height);

		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}

	applyDuskTint(ctx, canvas, darkness=1)
	{
		if (darkness === 0) darkness += .1;
		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = `rgb(${245 / darkness}, ${192 / darkness}, ${101 / darkness})`;
		ctx.globalAlpha = .5
		ctx.fillRect(0,0,canvas.width,canvas.height);

		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}

	applyNoonTint(ctx, canvas, strength=.40)
	{
		ctx.globalCompositeOperation = "overlay";
		ctx.fillStyle = `rgba(255,180,120,${strength})`;
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalCompositeOperation = "source-over";
	}

	applySkyLight(ctx, canvas, topColor, horizonColor, strength=0.35){

		ctx.globalCompositeOperation = "multiply";

		const gradient = ctx.createLinearGradient(
			0, -this.camera.y * this.camera.z,
			0, canvas.height + this.camera.y * this.camera.z
		);

		gradient.addColorStop(0, topColor);
		gradient.addColorStop(1, horizonColor);

		ctx.globalAlpha = strength;
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,canvas.width,canvas.height);

		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}
}