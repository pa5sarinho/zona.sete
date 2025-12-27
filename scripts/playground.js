import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";

console.log(animais);

let gato = new Bicho(animais.gato_domestico);
let map = new Map(document.getElementById('map'), 30);

const logExpandButton = document.getElementById('log-expand');
const logMinimizeButton = document.getElementById('log-minimize');
const expandedLog = document.getElementById('expanded-log');
const teste = document.getElementById('botao-window');

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;
teste.onclick = function() { addWindow('window', 20, 10); }

let mapArray = Array.from({length: 1920}, () => Math.floor(Math.random() * 14));
console.log(mapArray);

map.draw(1800, 960, mapArray); // 60x32

function expandLog(event) {
	expandedLog.style.display = 'flex';
}

function minimizeLog(event) {
	expandedLog.style.display = 'none';
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

	windowClose.className = 'close-button';
	windowClose.innerHTML = '🞫';
	windowClose.onclick = function() {windowPopUp.remove()}
	
	document.getElementById('ui').appendChild(windowPopUp);
	windowPopUp.appendChild(windowHeader);
	windowPopUp.appendChild(windowClose);
}
