import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";
import { tileRange, tileDescription } from "./objects/tilerange.js";
import { timeTranslate } from "./objects/translation.js";
import { DropDownMenu, PopUpWindow, screenToCanvas } from "./ui.js";

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
const time = document.querySelector('#time');
const day = document.querySelector('#day');

const HParea = document.getElementById('hp-area');
const HPvalue = document.getElementById('HP');

const gridCanvas = document.getElementById("grid");
const lightCanvas = document.getElementById("light");
const tilectx = mapLayer.getContext("2d");
const gridctx = gridCanvas.getContext("2d");
const lightCtx= lightCanvas.getContext("2d");

const tileInfo = document.createElement("div");
tileInfo.classList = 'texto importante';

//const guideHref = document.getElementById('guide-href');
//guideHref.onclick = openGuideWindow;

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;

charExpandButton.onclick = expandCharacterInfo;
charMinimizeButton.onclick = minimizeCharacterInfo;

downloadMapBtn.onclick = downloadMapData;

let txtmap = [];
// testMap();

drawMap().then(() => {
	mapLoaded = true;
})

//map.addEffect(26, 27, 6, 12, "brightness", 3);

// let loadedMap = getMapData();
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
	event.preventDefault();

    const rect = wrapper.getBoundingClientRect();
	const canvasPos = screenToCanvas(event, rect);
	let gridCoordenate = getTile(canvasPos.x, canvasPos.y);
    
	map.createSpriteOnTile(gridCoordenate.x, gridCoordenate.y, 'flag');
})

mapLayer.addEventListener('mousemove', function(event) {
	const rect = mapLayer.getBoundingClientRect();
	
	const canvasPos = screenToCanvas(event, rect);
	let gridCoordenate = getTile(canvasPos.x, canvasPos.y);
	let tilePos = tileToScreen(gridCoordenate.x, gridCoordenate.y);

	map.hoverTile = {x:gridCoordenate.x,y:gridCoordenate.y}
	if (map.mapEditor && mapLoaded) {
		tileInfo.innerHTML  = `${tileDescription[map.surfaceMap[map.hoverTile.y][map.hoverTile.x]]} : 
								textura ${map.textureMap[map.hoverTile.y][map.hoverTile.x]} : 
								altura ${map.altitudeMap[map.hoverTile.y][map.hoverTile.x]}`;
		tileInfo.style.left = tilePos.x - 150;
		tileInfo.style.top  = tilePos.y - 80 * map.camera.z;
		tileInfo.style.position = 'absolute';
		tileInfo.style.zIndex = 3;
		wrapper.appendChild(tileInfo);
	}
})

mapLayer.addEventListener('mouseout', function(event) {
	if (tileInfo) tileInfo.remove();
})

mapLayer.addEventListener("wheel", (event) => {

	const zoomSpeed = 0.1;

	if (event.deltaY < 0)
		map.camera.z *= 1 + zoomSpeed;
	else
		map.camera.z *= 1 - zoomSpeed;

	map.camera.z = Math.max(0.5, Math.min(3, map.camera.z));
	console.log(map.camera.z)

});

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

// ---------------------------------- FUNCOES DO MAPA ----------------------------------
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
	  map.surfaceMap = result.surface;
	  map.altitudeMap = result.altitude;
	  map.textureMap = result.texture;
	  map.spriteMap = result.sprite;
	  map.lightingMap = result.light;

	  map.createGridTile();

	  return result;
	} catch (error) {
	  	console.error(error.message);
	}
}

function downloadMapData() {
	const m = {surface: map.surfaceMap, altitude: map.altitudeMap, texture: map.textureMap, sprite: map.spriteMap, light: map.lightingMap};
	const jsonString = JSON.stringify(m);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = "map.json";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

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
	map.spriteMap = randomMap[2];
	console.log(randomMap);
	map.textureMap = txtmap;
}

async function drawMap() {
	const loadedMap = await loadMapData();
	drawGrid();
	for (let i = 0; i < 123; i++)
		map.lightingMap.push(Array(123).fill(0));
	console.log('map loaded');
	return true;
}

async function createRandomMap(visibleMapSize) {
	// let visibleMapSize = Math.floor( 4050 / mapZoomLevel) - mapZoomLevel/15 + 6;
	let tileCategories = ['g', 's'];
	let arr = [];
	let alt = [];
	let prop= [];
	
	for (let i = 0; i < visibleMapSize; i++) {
		arr.push(Array.from({length: visibleMapSize}, () => tileCategories[Math.floor(Math.random() * tileCategories.length)]))
	}
	
	for (let i = 0; i < visibleMapSize; i++) {
		alt.push(Array.from({length: visibleMapSize}, () => Math.ceil(Math.random() * 3)))
	}

	for (let i = 0; i < visibleMapSize; i++) {
		prop.push(Array(visibleMapSize).fill(' '))
	}

	return [arr, alt, prop];
}

function drawGrid()
{
	gridctx.imageSmoothingEnabled = false;
	map.drawGrid();
}

function getTile(x, y)
{
	const worldX = (x - mapLayer.width/2) / map.camera.z + map.camera.x;
	const worldY = (y - mapLayer.height/2) / map.camera.z + map.camera.y;;

	const halfW = map.gridWidth / 2;
	const halfH = map.gridHeight[0] / 2;

	const tileX = (worldX / halfW + worldY / halfH) / 2;
	const tileY = (worldY / halfH - worldX / halfW) / 2;

	return {
		x: Math.floor(tileX),
		y: Math.floor(tileY)
	};
}

function tileToScreen(tileX, tileY){

	const worldX = (tileX - tileY) * map.gridWidth / 2;
	const worldY = (tileX + tileY) * (map.gridHeight[0] / 2) + map.gridHeight[0];

	const screenX =
		(worldX - map.camera.x) * map.camera.z +
		mapLayer.width / 2;

	const screenY =
		(worldY - map.camera.y) * map.camera.z +
		mapLayer.height / 2;

	return {x: screenX, y: screenY};
}

// ---------------------------------- FUNCOES DA INTERFACE ----------------------------------

function updateHP(newHP) {
	let hp = newHP;
	HPvalue.innerHTML = hp;
	if (hp > 50) HParea.className = '';
	else if (hp > 30) HParea.className = 'alerta';
	else { HParea.className = 'perigo' };
}

function updateTime(hours, minutes, displayMode) {
	if (displayMode === "window")
		time.innerHTML = timeTranslate["pt"][gameTime.window];
	else {time.innerHTML = `${hours}:${minutes}`}
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

// ------------------ GAME LOOP E PASSAGEM DO TEMPO --------------------


const HOUR_LENGTH = 6;
const MINUTE_LENGTH = .1;

const gameTime = {
	minute: 0,
	hour: 3,
	day: 1,
	window: ' '
};

function update(dt) {

	if(keys["ArrowUp"]) map.camera.y -= map.camera.speed * dt
	if(keys["ArrowDown"]) map.camera.y += map.camera.speed * dt
	if(keys["ArrowLeft"]) map.camera.x -= map.camera.speed * dt
	if(keys["ArrowRight"]) map.camera.x += map.camera.speed * dt

	if(keys["w"]) map.camera.y -= map.camera.speed * dt
	if(keys["s"]) map.camera.y += map.camera.speed * dt
	if(keys["a"]) map.camera.x -= map.camera.speed * dt
	if(keys["d"]) map.camera.x += map.camera.speed * dt
}

function hourTick() {

	gameTime.hour++;

	if(gameTime.hour >= 24){
		gameTime.hour = 0;
		gameTime.day++;
	}
}

function minuteTick() {

	gameTime.minute++;

	if(gameTime.minute >= 60){
		gameTime.minute = 0;
	}

	updateTime(gameTime.hour, gameTime.minute < 10 ? `0${gameTime.minute}` : gameTime.minute, "window")
}

function updateDynamicLighting(globalLighting) {
	// map.addLight(30, 30, 10, globalLighting);
	map.addSinglePointLight(30, 30, 2*globalLighting);
}

function updateGlobalLighting() {
	if (gameTime.hour >= 11 && gameTime.hour < 15) noon();
	else if (gameTime.hour >= 16 && gameTime.hour < 18) dusk();
	else if (gameTime.hour == 18)  nightfall();
	else if (gameTime.hour == 19)  lateNightFall();
	else if (gameTime.hour >= 20 || gameTime.hour < 4) nighttime();
	else if (gameTime.hour == 4) dawn();
	else if (gameTime.hour >= 5 && gameTime.hour < 7) lateDawn();
	else if (gameTime.hour >= 7 && gameTime.hour < 11) {
		defaultGameTime();
		if (gameTime.window != "morning")
			updateDynamicLighting(0)
		gameTime.window = "morning";
	}
	else if (gameTime.hour > 13 && gameTime.hour < 16) {
		if (gameTime.hour === 15)
			defaultGameTime();
		gameTime.window = "afternoon";
	}
	
}

function nightfall() {
	map.applyNightTint(tilectx, mapLayer, .7);
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(180,140,200)",
		"rgb(255,160,120)",
		.7
	);
	
	document.body.style.background = `linear-gradient(#6663a6, #816b7c)`;
	if (gameTime.window != "nightfall")
	{
		gameTime.window = 'nightfall';
		updateDynamicLighting(1);
	}
}

function lateNightFall() {
	map.applyNightTint(tilectx, mapLayer, .9);
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(40,60,120)",
		"rgb(20,30,60)",
		0.7
	);
	document.body.style.background = `linear-gradient(#2b355b, #262c43)`;
	gameTime.window = 'nightfall';
}

function nighttime() {
	map.applyNightTint(tilectx, mapLayer, 1.2);
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(40,60,120)",
		"rgb(20,30,60)",
		0.7
	);
	document.body.style.background = `linear-gradient(#2b355b, #262c43)`;
	if (gameTime.window != "nighttime")
	{
		gameTime.window = 'nighttime';
		updateDynamicLighting(1);
	}
}

function dusk() {
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(180,140,200)",
		"rgb(255,160,120)",
		.8
	);
	map.applyDuskTint(tilectx, mapLayer, (gameTime.hour - 15) / 2);
	document.body.style.background = `linear-gradient(#c2a1ba, #fdb083)`;
	if (gameTime.window != "dusk")
	{
		gameTime.window = 'dusk';
		updateDynamicLighting(1);
	}
}

function dawn() {
	map.applyDuskTint(tilectx, mapLayer, 2 / (gameTime.hour - 3));
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(40,60,120)",
		"rgb(20,30,60)",
		0.7
	);
	document.body.style.background = `linear-gradient(rgb(114, 91, 125), rgb(198, 147, 125))`;
	if (gameTime.window != "dawn")
	{
		gameTime.window = 'dawn';
		updateDynamicLighting(1);
	}
}

function lateDawn() {
	map.applyDuskTint(tilectx, mapLayer, 2 / (gameTime.hour - 3));
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(180,140,200)",
		"rgb(255,160,120)",
		.8
	);
	document.body.style.backgroundColor = `rgb(245, 192, 101)`;
	gameTime.window = 'dawn';
}

function noon() {
	map.applySkyLight(
		tilectx,
		mapLayer,
		"rgb(220,235,255)",
		"rgb(255,255,255)",
		.15
	);
	document.body.style.background = `linear-gradient(rgb(220,235,255), #FDF9ED)`;
	if (gameTime.window != "noon")
	{
		gameTime.window = 'noon';
		updateDynamicLighting(0);
	}
}

function defaultGameTime() {
	document.body.style.backgroundColor = '#FDF9ED';
}

let last = performance.now()
let hourTimer = 0;
let minuteTimer = 0;

function loop(now) {

	const dt = Math.min((now - last) / 1000, 0.1);
	last = now;

	update(dt);

	minuteTimer += dt;
	hourTimer += dt;

	if (hourTimer >= HOUR_LENGTH){
		hourTimer -= HOUR_LENGTH;
		hourTick();
	}

	if (minuteTimer >= MINUTE_LENGTH){
		minuteTimer -= MINUTE_LENGTH;
		minuteTick();
	}

	if (mapLoaded){
		map.draw(tilectx, mapLayer, lightCtx, lightCanvas);
		updateGlobalLighting();
	}

	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);