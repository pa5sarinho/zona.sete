import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";
import { tileRange } from "./objects/tilerange.js";
import { DropDownMenu, PopUpWindow, screenToCanvas } from "./ui.js";

let mapZoomLevel = 1;
const speed = 5;

let gato = new Bicho(animais.gato_domestico);
let map = new Map(document.getElementById('map'), 45);

// let popUp = new PopUpWindow('bem vindo à zona 7', 21, 8);
// popUp.html = "<p>Este jogo é melhor jogado com a tela do navegador cheia. Entre no modo tela cheia com F11 ou <a id='fullscreen-welcome' class='destaque'>clicando aqui</a>!</p><a id='guide-href'>É novato? Veja o guia rápido aqui</a>";
// popUp.draw();

let menu = 0;
const mapLayer = document.getElementById('map');
let mapLoaded = false;

const logExpandButton = document.getElementById('log-expand');
const logMinimizeButton = document.getElementById('log-minimize');
const expandedLog = document.getElementById('expanded-log');
const charExpandButton = document.getElementById('char-expand');
const charMinimizeButton = document.getElementById('char-minimize');
const characterInfoWindow = document.getElementById('sticky-window');
const wrapper = document.querySelector('.wrapper');

const downloadMapBtn = document.querySelector(".download-map");

const HParea = document.getElementById('hp-area');
const HPvalue = document.getElementById('HP');

const gridCanvas = document.getElementById("grid");
const tileCanvas = document.getElementById("map");
const tilectx = tileCanvas.getContext("2d");
const gridctx = gridCanvas.getContext("2d");

//const guideHref = document.getElementById('guide-href');
//guideHref.onclick = openGuideWindow;

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;

charExpandButton.onclick = expandCharacterInfo;
charMinimizeButton.onclick = minimizeCharacterInfo;

downloadMapBtn.onclick = downloadMapData;

let txtmap = [];

// criar um mapa base aleatorio pra editar
async function testMap()
{
	const randomMap = await createRandomMap(123);
	for (let i = 0; i < 123; i++) {
		let txt = [];
		for (let j = 0; j < 123; j++) {
			txt.push(tileRange[randomMap[0][i][j]][Math.floor(Math.random() * 2)])
		}
		txtmap.push(txt);
	}
	map.surfaceMap = randomMap[0];
	map.altitudeMap = randomMap[1];
	map.textureMap = txtmap;
}

// testMap();

drawMap().then(() => {
	mapLoaded = true;
})

//map.addEffect(26, 27, 6, 12, "brightness", 3);

let loadedMap = getMapData();
updateHP(100);

let choices = 
[
	"run", "dig", "build"
]

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

// moveView();

// ---------------------------------- EVENT LISTENERS ----------------------------------
// gere todos os cliques com o botão esquerdo no mapa
mapLayer.addEventListener('click', function(event) {
    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
    if (document.getElementById('open-drop-down-menu'))
    {
    	menu.destroy();
    }
    else
    {
		const rect = wrapper.getBoundingClientRect();
		const canvasPos = screenToCanvas(event, rect);
	    menu = new DropDownMenu(canvasPos.x, canvasPos.y, choices);
	    menu.draw();
    }
});

// gere todos os cliques com o botão direito no mapa
mapLayer.addEventListener('contextmenu', function(event) {
	let bluedot = document.createElement('img');
	
    const rect = wrapper.getBoundingClientRect();
	const canvasPos = screenToCanvas(event, rect);

    bluedot.style.left = canvasPos.x - 30;
    bluedot.style.top = canvasPos.y - 30;
    bluedot.className = 'click-item';
    //bluedot.src = "../assets/map/blue_circle.gif";
    bluedot.src = "../assets/sprites/gato_domestico.png";
    bluedot.addEventListener("mouseout", () => {
    	bluedot.remove();
    });
    event.preventDefault();
    mapLayer.appendChild(bluedot);
})

mapLayer.addEventListener('mousemove', function(event) {
	const rect = tileCanvas.getBoundingClientRect();
	// const rect = tileCanvas.getBoundingClientRect();
	
	const canvasPos = screenToCanvas(event, rect);
	let gridCoordinate = getCoordenates(canvasPos.x, canvasPos.y);

	map.hoverTile = {x:gridCoordinate[0],y:gridCoordinate[1]}
})

// gere as teclas pressionadas
document.addEventListener("keydown", (event) => {
	if (event.key in keys) keys[event.key] = true;
	// switch(event.key) {
	// 	case "ArrowDown":
	// 		moveView(0, -10);
	// 		console.log("down");
	// 		break;
	// 	case "ArrowUp":
	// 		moveView(0, 10);
	// 		break;
	// 	case "ArrowLeft":
	// 		moveView(10, 0);
	// 		break;
	// 	case "ArrowRight":
	// 		moveView(-10, 0);
	// 		break;
	// }
})

document.addEventListener("keyup", (event) => {
  if (event.key in keys) keys[event.key] = false;
});

// ---------------------------------- FUNCOES ----------------------------------
async function getMapData() {
	const url = "./scripts/objects/map.json";
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
	    throw new Error(`Response status: ${response.status}`);
	  }

	  const result = await response.json();
	  //console.log(result);
	  return result;
	} catch (error) {
	  	console.error(error.message);
	}
}

async function loadMapData() {
	const url = "./scripts/objects/map.json";
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
	    throw new Error(`Response status: ${response.status}`);
	  }

	  const result = await response.json();
	  console.log(result.altitude);
	  map.surfaceMap = result.surface;
	  map.altitudeMap = result.altitude;
	  map.textureMap = result.texture;

	  map.createGridTile();

	  return result;
	} catch (error) {
	  	console.error(error.message);
	}
}

function downloadMapData() {
	const m = {surface: map.surfaceMap, altitude: map.altitudeMap, texture: map.textureMap};
	const jsonString = JSON.stringify(m);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = "map.json";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

async function drawMap() {
	const loadedMap = await loadMapData();
	drawGrid();
	console.log('map loaded');
	return true; // 60x32
}

async function createRandomMap(visibleMapSize) {
	// let visibleMapSize = Math.floor( 4050 / mapZoomLevel) - mapZoomLevel/15 + 6;
	let tileCategories = ['g', 's'];
	let arr = [];
	let alt = [];
	
	for (let i = 0; i < visibleMapSize; i++) {
		arr.push(Array.from({length: visibleMapSize}, () => tileCategories[Math.floor(Math.random() * tileCategories.length)]))
	}
	
	for (let i = 0; i < visibleMapSize; i++) {
			alt.push(Array.from({length: visibleMapSize}, () => Math.ceil(Math.random() * 3)))
	}

	return [arr, alt];
}

function drawGrid()
{
	gridctx.imageSmoothingEnabled = false;
	map.drawGrid();
}

function getCoordenates(x, y)
{
	const worldX = x + map.camera.x - tileCanvas.width/2;
	const worldY = y + map.camera.y - tileCanvas.height/2;
	const tileX =
		(worldX/(map.gridWidth/2) +
		worldY/(map.gridHeight[0]/2)) / 2

	const tileY =
		(worldY/(map.gridHeight[0]/2) -
		worldX/(map.gridWidth/2)) / 2

	const gridX = Math.floor(tileX)
	const gridY = Math.floor(tileY)
	return [gridX, gridY];
}

function updateHP(newHP) {
	let hp = newHP;
	HPvalue.innerHTML = hp;
	if (hp > 50) HParea.className = '';
	else if (hp > 30) HParea.className = 'alerta';
	else { HParea.className = 'perigo' };
}

function expandLog(event) {
	expandedLog.style.display = 'flex';
	logExpandButton.style.display = 'none';
}

function minimizeLog(event) {
	expandedLog.style.display = 'none';
	logExpandButton.style.display = 'inline';
}

function expandCharacterInfo(event) {
	characterInfoWindow.style.display = 'flex';
	charMinimizeButton.style.display = 'inline';
}

function minimizeCharacterInfo(event) {
	characterInfoWindow.style.display = 'none';
	charMinimizeButton.style.display = 'none';
}

function openGuideWindow() {
	let guideWindow = new PopUpWindow('Noções básicas para começar', 45, 27);
	guideWindow.html = "alguns textos q vou escrever muito depois...";
	guideWindow.draw();
}

function moveView() {
	if (keys.ArrowUp) map.canvasPositionY -= speed;
	if (keys.ArrowDown) map.canvasPositionY += speed;
	if (keys.ArrowLeft) map.canvasPositionX -= speed;
	if (keys.ArrowRight) map.canvasPositionX += speed;
	mapLayer.style.transform = `translate(${-map.canvasPositionX}px, ${-map.canvasPositionY}px)`;

	requestAnimationFrame(moveView);
}

function update(dt){

  if(keys["ArrowUp"]) map.camera.y -= map.camera.speed * dt
  if(keys["ArrowDown"]) map.camera.y += map.camera.speed * dt
  if(keys["ArrowLeft"]) map.camera.x -= map.camera.speed * dt
  if(keys["ArrowRight"]) map.camera.x += map.camera.speed * dt

  if(keys["w"]) map.camera.y -= map.camera.speed * dt
  if(keys["s"]) map.camera.y += map.camera.speed * dt
  if(keys["a"]) map.camera.x -= map.camera.speed * dt
  if(keys["d"]) map.camera.x += map.camera.speed * dt

}

let last = performance.now()

function loop(now){

  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;

  update(dt);
  if (mapLoaded)
  	map.draw();

  requestAnimationFrame(loop);

}

requestAnimationFrame(loop)