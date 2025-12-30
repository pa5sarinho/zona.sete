import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";

let gato = new Bicho(animais.gato_domestico);
let map = new Map(document.getElementById('map'), 30);

const logExpandButton = document.getElementById('log-expand');
const logMinimizeButton = document.getElementById('log-minimize');
const expandedLog = document.getElementById('expanded-log');
const charExpandButton = document.getElementById('char-expand');
const charMinimizeButton = document.getElementById('char-minimize');
const characterInfoWindow = document.getElementById('sticky-window');

const HParea = document.getElementById('hp-area');
const HPvalue = document.getElementById('HP');

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;
//teste.onclick = function() { addWindow('window', 20, 10); }

charExpandButton.onclick = expandCharacterInfo;
charMinimizeButton.onclick = minimizeCharacterInfo;

let walls = [0, 6, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0];
let mapArray = Array.from({length: 1920}, () => Math.floor(Math.random() * 14));
let wallsArray = Array.from({length: 1920}, () => walls[Math.floor(Math.random() * 12)]);
console.log(wallsArray);

map.draw(1800, 960, mapArray, wallsArray); // 60x32

updateHP(100);

function updateHP(newHP) {
	let hp = newHP;
	HPvalue.innerHTML = hp;
	if (hp > 50) HParea.className = '';
	else if (hp > 30) HParea.className = 'alerta';
	else { HParea.className = 'perigo' };
}

function expandLog(event) {
	expandedLog.style.display = 'flex';
}

function minimizeLog(event) {
	expandedLog.style.display = 'none';
}

function expandCharacterInfo(event) {
	characterInfoWindow.style.display = 'flex';
	charMinimizeButton.style.display = 'absolute';
}

function minimizeCharacterInfo(event) {
	characterInfoWindow.style.display = 'none';
	charMinimizeButton.style.display = 'flex';
}

function addWindow(name, width, height) {
	const windowPopUp = document.createElement('div');
	const windowHeader = document.createElement('div');
	const windowClose = document.createElement('div');
	
	windowPopUp.className = 'ui-layer';
	windowPopUp.id = 'window-popup';
	windowPopUp.style.width = width*30;
	windowPopUp.style.height= height*30;
	windowPopUp.style.right = ((60-width)/2)*30 + 120;
	windowPopUp.style.bottom = ((32-height)/2)*30 + 120;
	
	windowHeader.className = 'ui-header texto';
	windowHeader.innerHTML = name;
	windowHeader.style.width = 'auto';

	windowClose.className = 'expand-minimize-button';
	windowClose.style.top = '0px';
	windowClose.style.right = '0px';
	windowClose.innerHTML = '🞫';
	windowClose.onclick = function() {windowPopUp.remove()}
	
	document.getElementById('ui').appendChild(windowPopUp);
	windowPopUp.appendChild(windowHeader);
	windowPopUp.appendChild(windowClose);
}
