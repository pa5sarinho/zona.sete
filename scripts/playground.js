import { Bicho } from "./objects/Bicho.js";
import { animais } from "./objects/animais.js";

console.log(animais);

let gato = new Bicho(animais.gato_domestico);
const p = document.getElementById('teste');
p.innerHTML = gato.speak();
