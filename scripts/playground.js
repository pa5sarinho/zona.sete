import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";
import { DropDownMenu, PopUpWindow } from "./ui.js";

let gato = new Bicho(animais.gato_domestico);
let map = new Map(document.getElementById('map'), 60);

let popUp = new PopUpWindow('bem vindo à zona 7', 21, 7);
popUp.html = "<p>Este jogo é melhor jogado com a tela do navegador cheia. Entre no modo tela cheia com F11!</p><a id='guide-href'>É novato? Veja o guia rápido aqui</a>";
popUp.draw();

const mapLayer = document.getElementById('map');

const logExpandButton = document.getElementById('log-expand');
const logMinimizeButton = document.getElementById('log-minimize');
const expandedLog = document.getElementById('expanded-log');
const charExpandButton = document.getElementById('char-expand');
const charMinimizeButton = document.getElementById('char-minimize');
const characterInfoWindow = document.getElementById('sticky-window');

const HParea = document.getElementById('hp-area');
const HPvalue = document.getElementById('HP');

const guideHref = document.getElementById('guide-href');

let menu = 0;

logExpandButton.onclick = expandLog;
logMinimizeButton.onclick = minimizeLog;
//teste.onclick = function() { addWindow('window', 20, 10); }

charExpandButton.onclick = expandCharacterInfo;
charMinimizeButton.onclick = minimizeCharacterInfo;

guideHref.onclick = openGuideWindow;

//let walls = [0, 6, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0];
let tileCategories = ['g', 'w', 's']
let arr = [];
// for (let i = 3; i < 53; i+=2) {
// 	arr.push(Array.from({length: i}, () => tileCategories[Math.floor(Math.random() * 4)]));
// }
// for (let i = 53; i > 0; i-=2) {
// 	arr.push(Array.from({length: i}, () => tileCategories[Math.floor(Math.random() * 4)]));
// }
for (let i = 0; i < 53; i++) {
	arr.push(Array.from({length: 53}, () => tileCategories[Math.floor(Math.random() * 3)]))
}

//let wallsArray = Array.from({length: 1920}, () => walls[Math.floor(Math.random() * 12)]);

map.translate(arr);
map.draw(1800, 960); // 60x32
//map.addEffect(26, 27, 6, 12, "brightness", 3);

updateHP(100);

let choices = ["correr até aqui", "construir...", "cavar"];

// gere todos os cliques com o botão esquerdo no mapa
mapLayer.addEventListener('click', function(event) {
    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
    if (menu !== 0)
    {
    	menu.destroy();
    	menu = 0;
    }
    else
    {
	    menu = new DropDownMenu(event.clientX, event.clientY, choices);
	    menu.draw();
    }
});

// gere todos os cliques com o botão direito no mapa
mapLayer.addEventListener('contextmenu', function(event) {
	let bluedot = document.createElement('img');
    bluedot.style.left = event.clientX - 30;
    bluedot.style.top = event.clientY - 30;
    bluedot.className = 'click-item';
    bluedot.src = "../assets/map/blue_circle.gif";
    bluedot.addEventListener("mouseout", () => {
    	bluedot.remove();
    });
    event.preventDefault();
    mapLayer.appendChild(bluedot);
})

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
