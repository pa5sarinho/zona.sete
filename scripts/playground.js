import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";
import { Map } from "./Map.js";

console.log(animais);

let gato = new Bicho(animais.gato_domestico);
const p = document.getElementById('teste');
let map = new Map(document.getElementById('map'), 30);
map.draw(1800, 960);
p.innerHTML = gato.speak();
