import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";
import { DropDownMenu, PopUpWindow, screenToCanvas } from "./ui.js";

let mapZoomLevel = 45;

let gato = new Bicho(animais.gato_domestico);
let map = new Map(document.getElementById('map'), mapZoomLevel);

// let popUp = new PopUpWindow('bem vindo à zona 7', 21, 7);
// popUp.html = "<p>Este jogo é melhor jogado com a tela do navegador cheia. Entre no modo tela cheia com F11!</p><a id='guide-href'>É novato? Veja o guia rápido aqui</a>";
// popUp.draw();

let menu = 0;
const mapLayer = document.getElementById('map');

const logExpandButton = document.getElementById('log-expand');
const logMinimizeButton = document.getElementById('log-minimize');
const expandedLog = document.getElementById('expanded-log');
const charExpandButton = document.getElementById('char-expand');
const charMinimizeButton = document.getElementById('char-minimize');
const characterInfoWindow = document.getElementById('sticky-window');

const HParea = document.getElementById('hp-area');
const HPvalue = document.getElementById('HP');

//const guideHref = document.getElementById('guide-href');

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;
//teste.onclick = function() { addWindow('window', 20, 10); }

charExpandButton.onclick = expandCharacterInfo;
charMinimizeButton.onclick = minimizeCharacterInfo;
//guideHref.onclick = openGuideWindow;

// const randomMap = createRandomMap();
// map.surfaceMap = map.translate(randomMap[0]);
// map.altitudeMap = map.translate(randomMap[1]);

drawMap();

console.log(map.surfaceMap);

//map.addEffect(26, 27, 6, 12, "brightness", 3);

//downloadMapData();
let loadedMap = getMapData();
updateHP(100);

let choices = 
[
	"run", "dig", "build"
]


// gere todos os cliques com o botão esquerdo no mapa
mapLayer.addEventListener('click', function(event) {
    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
    if (document.getElementById('open-drop-down-menu'))
    {
    	menu.destroy();
    }
    else
    {
		const canvasPos = screenToCanvas(event);
	    menu = new DropDownMenu(canvasPos.x, canvasPos.y, choices);
	    menu.draw();
    }
});

// gere todos os cliques com o botão direito no mapa
mapLayer.addEventListener('contextmenu', function(event) {
	let bluedot = document.createElement('img');
	const canvasPos = screenToCanvas(event);
    bluedot.style.left = canvasPos.x - 30;
    bluedot.style.top = canvasPos.y - 30;
    bluedot.className = 'click-item';
    //bluedot.src = "../assets/map/blue_circle.gif";
    bluedot.src = "../assets/sprites/PC.gif";
    bluedot.addEventListener("mouseout", () => {
    	bluedot.remove();
    });
    event.preventDefault();
    mapLayer.appendChild(bluedot);
})

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
	  return result;
	} catch (error) {
	  	console.error(error.message);
	}
}

async function downloadMapData() {
	const m = {surface: map.surfaceMap, altitude: map.altitudeMap};
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
	map.draw(1800, 960); // 60x32
}

function createRandomMap() {
	let visibleMapSize = Math.floor( 4050 / mapZoomLevel) - mapZoomLevel/15 + 6;
	let tileCategories = ['g', 's'];
	let arr = [];
	let alt = [];
	
	for (let i = 0; i < visibleMapSize; i++) {
		arr.push(Array.from({length: visibleMapSize}, () => tileCategories[Math.floor(Math.random() * 2)]))
	}
	
	for (let i = 0; i < visibleMapSize; i++) {
			alt.push(Array.from({length: visibleMapSize}, () => Math.ceil(Math.random() * 2)))
	}
	return [arr, alt];
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
